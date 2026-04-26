const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los mantenimientos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      estado, 
      vehiculo_id, 
      prioridad, 
      fecha_inicio, 
      fecha_fin 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, v.placa, v.marca, v.modelo, tm.nombre as tipo_mantenimiento,
             u.nombre as creado_por_nombre, ur.nombre as realizado_por_nombre
      FROM mantenimientos m
      LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
      LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
      LEFT JOIN usuarios u ON m.creado_por = u.id
      LEFT JOIN usuarios ur ON m.realizado_por = ur.id
      WHERE 1=1
    `;
    
    let countQuery = 'SELECT COUNT(*) FROM mantenimientos m WHERE 1=1';
    const params = [];
    const countParams = [];

    if (estado) {
      query += ' AND m.estado = $' + (params.length + 1);
      countQuery += ' AND estado = $' + (countParams.length + 1);
      params.push(estado);
      countParams.push(estado);
    }

    if (vehiculo_id) {
      query += ' AND m.vehiculo_id = $' + (params.length + 1);
      countQuery += ' AND vehiculo_id = $' + (countParams.length + 1);
      params.push(vehiculo_id);
      countParams.push(vehiculo_id);
    }

    if (prioridad) {
      query += ' AND m.prioridad = $' + (params.length + 1);
      countQuery += ' AND prioridad = $' + (countParams.length + 1);
      params.push(prioridad);
      countParams.push(prioridad);
    }

    if (fecha_inicio) {
      query += ' AND m.fecha_programada >= $' + (params.length + 1);
      countQuery += ' AND fecha_programada >= $' + (countParams.length + 1);
      params.push(fecha_inicio);
      countParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += ' AND m.fecha_programada <= $' + (params.length + 1);
      countQuery += ' AND fecha_programada <= $' + (countParams.length + 1);
      params.push(fecha_fin);
      countParams.push(fecha_fin);
    }

    query += ' ORDER BY m.fecha_programada ASC, m.prioridad DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [maintenanceResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({
      success: true,
      data: {
        maintenance: maintenanceResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener mantenimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener un mantenimiento por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT m.*, v.placa, v.marca, v.modelo, tm.nombre as tipo_mantenimiento,
             u.nombre as creado_por_nombre, ur.nombre as realizado_por_nombre
      FROM mantenimientos m
      LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
      LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
      LEFT JOIN usuarios u ON m.creado_por = u.id
      LEFT JOIN usuarios ur ON m.realizado_por = ur.id
      WHERE m.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mantenimiento no encontrado'
      });
    }

    // Obtener repuestos asociados
    const partsResult = await pool.query(`
      SELECT * FROM repuestos WHERE mantenimiento_id = $1
    `, [id]);

    const maintenance = result.rows[0];
    maintenance.repuestos = partsResult.rows;

    res.json({
      success: true,
      data: maintenance
    });

  } catch (error) {
    console.error('Error al obtener mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear un nuevo mantenimiento
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('vehiculo_id').notEmpty().withMessage('El vehículo es requerido'),
  body('descripcion').trim().notEmpty().withMessage('La descripción es requerida'),
  body('fecha_programada').isDate().withMessage('Fecha programada inválida'),
  body('prioridad').optional().isIn(['baja', 'media', 'alta', 'urgente']).withMessage('Prioridad inválida'),
  body('estado').optional().isIn(['pendiente', 'en_progreso', 'completado', 'cancelado']).withMessage('Estado inválido')
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
      vehiculo_id, tipo_mantenimiento_id, descripcion, fecha_programada,
      kilometraje, prioridad = 'media', tecnico, costo_mano_obra = 0,
      costo_repuestos = 0, observaciones, repuestos = []
    } = req.body;

    // Verificar que el vehículo existe
    const vehicleCheck = await pool.query(
      'SELECT id, kilometraje_actual FROM vehiculos WHERE id = $1',
      [vehiculo_id]
    );

    if (vehicleCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insertar mantenimiento
      const maintenanceResult = await client.query(`
        INSERT INTO mantenimientos (
          vehiculo_id, tipo_mantenimiento_id, descripcion, fecha_programada,
          kilometraje, prioridad, tecnico, costo_mano_obra, costo_repuestos,
          observaciones, creado_por
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        vehiculo_id, tipo_mantenimiento_id, descripcion, fecha_programada,
        kilometraje || vehicleCheck.rows[0].kilometraje_actual, prioridad,
        tecnico, costo_mano_obra, costo_repuestos, observaciones, req.user.id
      ]);

      const maintenance = maintenanceResult.rows[0];

      // Insertar repuestos si existen
      if (repuestos.length > 0) {
        const partsValues = repuestos.map(part => 
          `('${maintenance.id}', '${part.nombre}', '${part.codigo || ''}', ${part.cantidad || 1}, ${part.costo_unitario}, '${part.proveedor || ''}', '${part.fecha_compra || new Date().toISOString().split('T')[0]}', '${part.factura || ''}')`
        ).join(',');

        await client.query(`
          INSERT INTO repuestos (mantenimiento_id, nombre, codigo, cantidad, costo_unitario, proveedor, fecha_compra, factura)
          VALUES ${partsValues}
        `);
      }

      await client.query('COMMIT');

      // Emitir alerta en tiempo real
      const io = req.app.get('io');
      io.emit('new_maintenance', {
        maintenance_id: maintenance.id,
        vehiculo_id: vehiculo_id,
        message: `Nuevo mantenimiento programado: ${descripcion}`
      });

      res.status(201).json({
        success: true,
        message: 'Mantenimiento creado exitosamente',
        data: maintenance
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar un mantenimiento
router.put('/:id', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('descripcion').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía'),
  body('fecha_programada').optional().isDate().withMessage('Fecha programada inválida'),
  body('prioridad').optional().isIn(['baja', 'media', 'alta', 'urgente']).withMessage('Prioridad inválida'),
  body('estado').optional().isIn(['pendiente', 'en_progreso', 'completado', 'cancelado']).withMessage('Estado inválido')
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

    const { id } = req.params;
    const updateData = req.body;

    // Verificar si el mantenimiento existe
    const existingMaintenance = await pool.query(
      'SELECT id, estado, vehiculo_id FROM mantenimientos WHERE id = $1',
      [id]
    );

    if (existingMaintenance.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mantenimiento no encontrado'
      });
    }

    // Si se cambia a completado, actualizar fecha de realización
    if (updateData.estado === 'completado' && existingMaintenance.rows[0].estado !== 'completado') {
      updateData.fecha_realizacion = new Date().toISOString().split('T')[0];
      updateData.realizado_por = req.user.id;

      // Actualizar kilometraje del vehículo si se proporciona
      if (updateData.kilometraje) {
        await pool.query(
          'UPDATE vehiculos SET kilometraje_actual = $1, fecha_ultimo_mantenimiento = CURRENT_DATE WHERE id = $2',
          [updateData.kilometraje, existingMaintenance.rows[0].vehiculo_id]
        );
      }
    }

    // Construir consulta dinámica
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const result = await pool.query(`
      UPDATE mantenimientos 
      SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING *
    `, [...values, id]);

    // Emitir alerta en tiempo real
    const io = req.app.get('io');
    io.emit('maintenance_updated', {
      maintenance_id: id,
      vehiculo_id: existingMaintenance.rows[0].vehiculo_id,
      estado: updateData.estado,
      message: `Mantenimiento actualizado: ${updateData.descripcion || ''}`
    });

    res.json({
      success: true,
      message: 'Mantenimiento actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar un mantenimiento
router.delete('/:id', [
  authenticateToken,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el mantenimiento existe
    const existingMaintenance = await pool.query(
      'SELECT id, vehiculo_id FROM mantenimientos WHERE id = $1',
      [id]
    );

    if (existingMaintenance.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mantenimiento no encontrado'
      });
    }

    // Eliminar mantenimiento (se eliminarán en cascada los repuestos)
    await pool.query('DELETE FROM mantenimientos WHERE id = $1', [id]);

    // Emitir alerta en tiempo real
    const io = req.app.get('io');
    io.emit('maintenance_deleted', {
      maintenance_id: id,
      vehiculo_id: existingMaintenance.rows[0].vehiculo_id,
      message: 'Mantenimiento eliminado'
    });

    res.json({
      success: true,
      message: 'Mantenimiento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener tipos de mantenimiento
router.get('/types/list', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tipos_mantenimiento WHERE activo = true ORDER BY nombre'
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al obtener tipos de mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener mantenimientos pendientes/próximos
router.get('/pending/upcoming', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const result = await pool.query(`
      SELECT m.*, v.placa, v.marca, v.modelo, tm.nombre as tipo_mantenimiento,
             DATEDIFF(m.fecha_programada, CURRENT_DATE) as dias_restantes
      FROM mantenimientos m
      LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
      LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
      WHERE m.estado IN ('pendiente', 'en_progreso')
        AND m.fecha_programada BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
      ORDER BY m.fecha_programada ASC, m.prioridad DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al obtener mantenimientos pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de mantenimientos
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0]
    } = req.query;

    const [
      totalMaintenance,
      completedMaintenance,
      pendingMaintenance,
      inProgressMaintenance,
      totalCost,
      maintenanceByType,
      maintenanceByMonth
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM mantenimientos WHERE fecha_programada BETWEEN $1 AND $2', [startDate, endDate]),
      pool.query('SELECT COUNT(*) as total FROM mantenimientos WHERE estado = $1 AND fecha_programada BETWEEN $2 AND $3', ['completado', startDate, endDate]),
      pool.query('SELECT COUNT(*) as total FROM mantenimientos WHERE estado = $1 AND fecha_programada BETWEEN $2 AND $3', ['pendiente', startDate, endDate]),
      pool.query('SELECT COUNT(*) as total FROM mantenimientos WHERE estado = $1 AND fecha_programada BETWEEN $2 AND $3', ['en_progreso', startDate, endDate]),
      pool.query('SELECT SUM(costo_total) as total FROM mantenimientos WHERE estado = $1 AND fecha_programada BETWEEN $2 AND $3', ['completado', startDate, endDate]),
      pool.query(`
        SELECT tm.nombre, COUNT(*) as count, SUM(m.costo_total) as total_cost
        FROM mantenimientos m
        LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
        WHERE m.estado = 'completado' AND m.fecha_programada BETWEEN $1 AND $2
        GROUP BY tm.nombre
        ORDER BY count DESC
      `, [startDate, endDate]),
      pool.query(`
        SELECT DATE_TRUNC('month', fecha_realizacion) as month, COUNT(*) as count, SUM(costo_total) as total_cost
        FROM mantenimientos
        WHERE estado = 'completado' AND fecha_programada BETWEEN $1 AND $2
        GROUP BY DATE_TRUNC('month', fecha_realizacion)
        ORDER BY month
      `, [startDate, endDate])
    ]);

    res.json({
      success: true,
      data: {
        total_mantenimientos: parseInt(totalMaintenance.rows[0].total),
        mantenimientos_completados: parseInt(completedMaintenance.rows[0].total),
        mantenimientos_pendientes: parseInt(pendingMaintenance.rows[0].total),
        mantenimientos_en_progreso: parseInt(inProgressMaintenance.rows[0].total),
        costo_total: parseFloat(totalCost.rows[0].total) || 0,
        por_tipo: maintenanceByType.rows,
        por_mes: maintenanceByMonth.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de mantenimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
