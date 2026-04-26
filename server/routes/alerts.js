const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las alertas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo_alerta, 
      prioridad, 
      leida, 
      vehiculo_id 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, v.placa, v.marca, v.modelo, u.nombre as resuelta_por_nombre
      FROM alertas a
      LEFT JOIN vehiculos v ON a.vehiculo_id = v.id
      LEFT JOIN usuarios u ON a.resuelta_por = u.id
      WHERE 1=1
    `;
    
    let countQuery = 'SELECT COUNT(*) FROM alertas WHERE 1=1';
    const params = [];
    const countParams = [];

    if (tipo_alerta) {
      query += ' AND a.tipo_alerta = $' + (params.length + 1);
      countQuery += ' AND tipo_alerta = $' + (countParams.length + 1);
      params.push(tipo_alerta);
      countParams.push(tipo_alerta);
    }

    if (prioridad) {
      query += ' AND a.prioridad = $' + (params.length + 1);
      countQuery += ' AND prioridad = $' + (countParams.length + 1);
      params.push(prioridad);
      countParams.push(prioridad);
    }

    if (leida !== undefined) {
      query += ' AND a.leida = $' + (params.length + 1);
      countQuery += ' AND leida = $' + (countParams.length + 1);
      params.push(leida === 'true');
      countParams.push(leida === 'true');
    }

    if (vehiculo_id) {
      query += ' AND a.vehiculo_id = $' + (params.length + 1);
      countQuery += ' AND vehiculo_id = $' + (countParams.length + 1);
      params.push(vehiculo_id);
      countParams.push(vehiculo_id);
    }

    query += ' ORDER BY a.fecha_alerta DESC, a.prioridad DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [alertsResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({
      success: true,
      data: {
        alerts: alertsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener alertas no leídas
router.get('/unread', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, v.placa, v.marca, v.modelo
      FROM alertas a
      LEFT JOIN vehiculos v ON a.vehiculo_id = v.id
      WHERE a.leida = false
      ORDER BY a.prioridad DESC, a.fecha_alerta ASC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al obtener alertas no leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Marcar alerta como leída
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE alertas 
      SET leida = true, fecha_resolucion = CURRENT_TIMESTAMP, resuelta_por = $1
      WHERE id = $2 AND leida = false
      RETURNING *
    `, [req.user.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alerta no encontrada o ya leída'
      });
    }

    res.json({
      success: true,
      message: 'Alerta marcada como leída',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al marcar alerta como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Marcar todas las alertas como leídas
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE alertas 
      SET leida = true, fecha_resolucion = CURRENT_TIMESTAMP, resuelta_por = $1
      WHERE leida = false
      RETURNING id
    `, [req.user.id]);

    res.json({
      success: true,
      message: `${result.rows.length} alertas marcadas como leídas`,
      data: {
        marked_count: result.rows.length
      }
    });

  } catch (error) {
    console.error('Error al marcar alertas como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear alerta manual
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('titulo').trim().notEmpty().withMessage('El título es requerido'),
  body('tipo_alerta').isIn(['mantenimiento', 'kilometraje', 'fecha', 'costo', 'sistema']).withMessage('Tipo de alerta inválido'),
  body('prioridad').isIn(['baja', 'media', 'alta', 'urgente']).withMessage('Prioridad inválida'),
  body('fecha_alerta').isDate().withMessage('Fecha de alerta inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const {
      vehiculo_id, mantenimiento_id, titulo, descripcion, tipo_alerta,
      prioridad, fecha_alerta
    } = req.body;

    // Verificar que el vehículo existe si se proporciona
    if (vehiculo_id) {
      const vehicleCheck = await pool.query(
        'SELECT id FROM vehiculos WHERE id = $1',
        [vehiculo_id]
      );

      if (vehicleCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }
    }

    const result = await pool.query(`
      INSERT INTO alertas (
        vehiculo_id, mantenimiento_id, titulo, descripcion, tipo_alerta,
        prioridad, fecha_alerta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      vehiculo_id, mantenimiento_id, titulo, descripcion, tipo_alerta,
      prioridad, fecha_alerta
    ]);

    // Emitir alerta en tiempo real
    const io = req.app.get('io');
    io.emit('new_alert', {
      alert_id: result.rows[0].id,
      vehiculo_id: vehiculo_id,
      titulo: titulo,
      prioridad: prioridad,
      message: `Nueva alerta: ${titulo}`
    });

    res.status(201).json({
      success: true,
      message: 'Alerta creada exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar alerta
router.delete('/:id', [
  authenticateToken,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM alertas WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alerta no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Alerta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Generar alertas automáticas del sistema
router.post('/generate-automatic', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const client = await pool.connect();
    let alertsGenerated = 0;

    try {
      await client.query('BEGIN');

      // Alertas de mantenimiento por fecha
      const maintenanceDateAlerts = await client.query(`
        INSERT INTO alertas (vehiculo_id, mantenimiento_id, titulo, descripcion, tipo_alerta, prioridad, fecha_alerta)
        SELECT 
          m.vehiculo_id,
          m.id,
          'Mantenimiento próximo por fecha',
          CONCAT('El vehículo ', v.placa, ' tiene programado un mantenimiento para el ', TO_CHAR(m.fecha_programada, 'DD/MM/YYYY')),
          'fecha',
          CASE 
            WHEN m.fecha_programada - CURRENT_DATE <= 3 THEN 'urgente'
            WHEN m.fecha_programada - CURRENT_DATE <= 7 THEN 'alta'
            ELSE 'media'
          END,
          CURRENT_DATE
        FROM mantenimientos m
        LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
        WHERE m.estado IN ('pendiente', 'en_progreso')
          AND m.fecha_programada BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
          AND NOT EXISTS (
            SELECT 1 FROM alertas a 
            WHERE a.mantenimiento_id = m.id 
              AND a.tipo_alerta = 'fecha'
              AND a.fecha_alerta = CURRENT_DATE
          )
        RETURNING id
      `);

      alertsGenerated += maintenanceDateAlerts.rows.length;

      // Alertas de mantenimiento por kilometraje
      const maintenanceKmAlerts = await client.query(`
        INSERT INTO alertas (vehiculo_id, mantenimiento_id, titulo, descripcion, tipo_alerta, prioridad, fecha_alerta)
        SELECT 
          m.vehiculo_id,
          m.id,
          'Mantenimiento próximo por kilometraje',
          CONCAT('El vehículo ', v.placa, ' está cerca del kilometraje para mantenimiento (', v.kilometraje_actual, ' km)'),
          'kilometraje',
          CASE 
            WHEN (m.kilometraje - v.kilometraje_actual) <= 500 THEN 'urgente'
            WHEN (m.kilometraje - v.kilometraje_actual) <= 1000 THEN 'alta'
            ELSE 'media'
          END,
          CURRENT_DATE
        FROM mantenimientos m
        LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
        WHERE m.estado IN ('pendiente', 'en_progreso')
          AND m.kilometraje IS NOT NULL
          AND v.kilometraje_actual >= (m.kilometraje - 2000)
          AND v.kilometraje_actual < m.kilometraje
          AND NOT EXISTS (
            SELECT 1 FROM alertas a 
            WHERE a.mantenimiento_id = m.id 
              AND a.tipo_alerta = 'kilometraje'
              AND a.fecha_alerta = CURRENT_DATE
          )
        RETURNING id
      `);

      alertsGenerated += maintenanceKmAlerts.rows.length;

      // Alertas de vehículos sin mantenimiento reciente
      const noMaintenanceAlerts = await client.query(`
        INSERT INTO alertas (vehiculo_id, titulo, descripcion, tipo_alerta, prioridad, fecha_alerta)
        SELECT 
          v.id,
          'Vehículo sin mantenimiento reciente',
          CONCAT('El vehículo ', v.placa, ' no ha tenido mantenimiento en los últimos 90 días'),
          'mantenimiento',
          'media',
          CURRENT_DATE
        FROM vehiculos v
        WHERE v.estado = 'activo'
          AND (v.fecha_ultimo_mantenimiento IS NULL OR v.fecha_ultimo_mantenimiento < CURRENT_DATE - INTERVAL '90 days')
          AND NOT EXISTS (
            SELECT 1 FROM alertas a 
            WHERE a.vehiculo_id = v.id 
              AND a.tipo_alerta = 'mantenimiento'
              AND a.fecha_alerta = CURRENT_DATE
          )
        RETURNING id
      `);

      alertsGenerated += noMaintenanceAlerts.rows.length;

      await client.query('COMMIT');

      // Emitir alertas en tiempo real
      const io = req.app.get('io');
      if (alertsGenerated > 0) {
        io.emit('automatic_alerts_generated', {
          count: alertsGenerated,
          message: `Se generaron ${alertsGenerated} alertas automáticas`
        });
      }

      res.json({
        success: true,
        message: `Se generaron ${alertsGenerated} alertas automáticas`,
        data: {
          alerts_generated: alertsGenerated
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al generar alertas automáticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de alertas
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0]
    } = req.query;

    const [
      totalAlerts,
      unreadAlerts,
      alertsByType,
      alertsByPriority,
      alertsByMonth
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM alertas WHERE fecha_alerta BETWEEN $1 AND $2', [startDate, endDate]),
      pool.query('SELECT COUNT(*) as total FROM alertas WHERE leida = false AND fecha_alerta BETWEEN $1 AND $2', [startDate, endDate]),
      pool.query(`
        SELECT tipo_alerta, COUNT(*) as count
        FROM alertas
        WHERE fecha_alerta BETWEEN $1 AND $2
        GROUP BY tipo_alerta
        ORDER BY count DESC
      `, [startDate, endDate]),
      pool.query(`
        SELECT prioridad, COUNT(*) as count
        FROM alertas
        WHERE fecha_alerta BETWEEN $1 AND $2
        GROUP BY prioridad
        ORDER BY count DESC
      `, [startDate, endDate]),
      pool.query(`
        SELECT DATE_TRUNC('month', fecha_alerta) as month, COUNT(*) as count
        FROM alertas
        WHERE fecha_alerta BETWEEN $1 AND $2
        GROUP BY DATE_TRUNC('month', fecha_alerta)
        ORDER BY month
      `, [startDate, endDate])
    ]);

    res.json({
      success: true,
      data: {
        total_alertas: parseInt(totalAlerts.rows[0].total),
        alertas_no_leidas: parseInt(unreadAlerts.rows[0].total),
        por_tipo: alertsByType.rows,
        por_prioridad: alertsByPriority.rows,
        por_mes: alertsByMonth.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
