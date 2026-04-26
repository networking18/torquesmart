const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los vehículos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT v.*, u.nombre as creado_por_nombre
      FROM vehiculos v
      LEFT JOIN usuarios u ON v.creado_por = u.id
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) FROM vehiculos WHERE 1=1';
    const params = [];
    const countParams = [];

    if (estado) {
      query += ' AND v.estado = $' + (params.length + 1);
      countQuery += ' AND estado = $' + (countParams.length + 1);
      params.push(estado);
      countParams.push(estado);
    }

    if (search) {
      query += ' AND (v.placa ILIKE $' + (params.length + 1) + ' OR v.marca ILIKE $' + (params.length + 1) + ' OR v.modelo ILIKE $' + (params.length + 1) + ')';
      countQuery += ' AND (placa ILIKE $' + (countParams.length + 1) + ' OR marca ILIKE $' + (countParams.length + 1) + ' OR modelo ILIKE $' + (countParams.length + 1) + ')';
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    query += ' ORDER BY v.fecha_creacion DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [vehiclesResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({
      success: true,
      data: {
        vehicles: vehiclesResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener un vehículo por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT v.*, u.nombre as creado_por_nombre
      FROM vehiculos v
      LEFT JOIN usuarios u ON v.creado_por = u.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Obtener mantenimientos recientes
    const recentMaintenance = await pool.query(`
      SELECT id, descripcion, fecha_realizacion, estado, costo_total
      FROM mantenimientos
      WHERE vehiculo_id = $1 AND estado = 'completado'
      ORDER BY fecha_realizacion DESC
      LIMIT 5
    `, [id]);

    // Obtener gastos recientes
    const recentExpenses = await pool.query(`
      SELECT id, tipo_gasto, descripcion, monto, fecha
      FROM gastos
      WHERE vehiculo_id = $1
      ORDER BY fecha DESC
      LIMIT 5
    `, [id]);

    const vehicle = result.rows[0];
    vehicle.mantenimientos_recientes = recentMaintenance.rows;
    vehicle.gastos_recientes = recentExpenses.rows;

    res.json({
      success: true,
      data: vehicle
    });

  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear un nuevo vehículo
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('placa').trim().notEmpty().withMessage('La placa es requerida'),
  body('marca').trim().notEmpty().withMessage('La marca es requerida'),
  body('modelo').trim().notEmpty().withMessage('El modelo es requerido'),
  body('anio').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Año inválido'),
  body('kilometraje_actual').optional().isInt({ min: 0 }).withMessage('Kilometraje inválido'),
  body('tipo_combustible').optional().isIn(['gasolina', 'diesel', 'electrico', 'hibrido']).withMessage('Tipo de combustible inválido'),
  body('estado').optional().isIn(['activo', 'inactivo', 'mantenimiento', 'baja']).withMessage('Estado inválido')
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
      placa, marca, modelo, anio, color, kilometraje_actual = 0,
      kilometraje_compra = 0, tipo_combustible = 'gasolina',
      estado = 'activo', fecha_compra, notas
    } = req.body;

    // Verificar si la placa ya existe
    const existingVehicle = await pool.query(
      'SELECT id FROM vehiculos WHERE placa = $1',
      [placa.toUpperCase()]
    );

    if (existingVehicle.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La placa ya está registrada'
      });
    }

    const result = await pool.query(`
      INSERT INTO vehiculos (
        placa, marca, modelo, anio, color, kilometraje_actual,
        kilometraje_compra, tipo_combustible, estado, fecha_compra,
        notas, creado_por
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      placa.toUpperCase(), marca, modelo, anio, color, kilometraje_actual,
      kilometraje_compra, tipo_combustible, estado, fecha_compra,
      notas, req.user.id
    ]);

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar un vehículo
router.put('/:id', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('marca').optional().trim().notEmpty().withMessage('La marca no puede estar vacía'),
  body('modelo').optional().trim().notEmpty().withMessage('El modelo no puede estar vacío'),
  body('anio').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Año inválido'),
  body('kilometraje_actual').optional().isInt({ min: 0 }).withMessage('Kilometraje inválido'),
  body('tipo_combustible').optional().isIn(['gasolina', 'diesel', 'electrico', 'hibrido']).withMessage('Tipo de combustible inválido'),
  body('estado').optional().isIn(['activo', 'inactivo', 'mantenimiento', 'baja']).withMessage('Estado inválido')
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

    // Verificar si el vehículo existe
    const existingVehicle = await pool.query(
      'SELECT id FROM vehiculos WHERE id = $1',
      [id]
    );

    if (existingVehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Si se actualiza la placa, verificar que no exista
    if (updateData.placa) {
      const plateCheck = await pool.query(
        'SELECT id FROM vehiculos WHERE placa = $1 AND id != $2',
        [updateData.placa.toUpperCase(), id]
      );

      if (plateCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'La placa ya está registrada en otro vehículo'
        });
      }
      updateData.placa = updateData.placa.toUpperCase();
    }

    // Construir consulta dinámica
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const result = await pool.query(`
      UPDATE vehiculos 
      SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING *
    `, [...values, id]);

    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar un vehículo (baja lógica)
router.delete('/:id', [
  authenticateToken,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el vehículo existe
    const existingVehicle = await pool.query(
      'SELECT id, estado FROM vehiculos WHERE id = $1',
      [id]
    );

    if (existingVehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Marcar como baja en lugar de eliminar
    await pool.query(
      'UPDATE vehiculos SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2',
      ['baja', id]
    );

    res.json({
      success: true,
      message: 'Vehículo dado de baja exitosamente'
    });

  } catch (error) {
    console.error('Error al dar de baja vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de la flota
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      inactiveVehicles,
      avgKilometers,
      vehiclesByFuel,
      vehiclesByYear
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM vehiculos WHERE estado != $1', ['baja']),
      pool.query('SELECT COUNT(*) as total FROM vehiculos WHERE estado = $1', ['activo']),
      pool.query('SELECT COUNT(*) as total FROM vehiculos WHERE estado = $1', ['mantenimiento']),
      pool.query('SELECT COUNT(*) as total FROM vehiculos WHERE estado = $1', ['inactivo']),
      pool.query('SELECT AVG(kilometraje_actual) as avg_km FROM vehiculos WHERE estado != $1', ['baja']),
      pool.query('SELECT tipo_combustible, COUNT(*) as count FROM vehiculos WHERE estado != $1 GROUP BY tipo_combustible', ['baja']),
      pool.query('SELECT anio, COUNT(*) as count FROM vehiculos WHERE estado != $1 GROUP BY anio ORDER BY anio DESC LIMIT 10', ['baja'])
    ]);

    res.json({
      success: true,
      data: {
        total_vehiculos: parseInt(totalVehicles.rows[0].total),
        vehiculos_activos: parseInt(activeVehicles.rows[0].total),
        vehiculos_mantenimiento: parseInt(maintenanceVehicles.rows[0].total),
        vehiculos_inactivos: parseInt(inactiveVehicles.rows[0].total),
        kilometraje_promedio: Math.round(parseFloat(avgKilometers.rows[0].avg_km) || 0),
        por_tipo_combustible: vehiclesByFuel.rows,
        por_anio: vehiclesByYear.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
