const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los gastos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo_gasto, 
      vehiculo_id, 
      fecha_inicio, 
      fecha_fin,
      metodo_pago
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT g.*, v.placa, v.marca, v.modelo, u.nombre as creado_por_nombre
      FROM gastos g
      LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
      LEFT JOIN usuarios u ON g.creado_por = u.id
      WHERE 1=1
    `;
    
    let countQuery = 'SELECT COUNT(*) FROM gastos WHERE 1=1';
    const params = [];
    const countParams = [];

    if (tipo_gasto) {
      query += ' AND g.tipo_gasto = $' + (params.length + 1);
      countQuery += ' AND tipo_gasto = $' + (countParams.length + 1);
      params.push(tipo_gasto);
      countParams.push(tipo_gasto);
    }

    if (vehiculo_id) {
      query += ' AND g.vehiculo_id = $' + (params.length + 1);
      countQuery += ' AND vehiculo_id = $' + (countParams.length + 1);
      params.push(vehiculo_id);
      countParams.push(vehiculo_id);
    }

    if (fecha_inicio) {
      query += ' AND g.fecha >= $' + (params.length + 1);
      countQuery += ' AND fecha >= $' + (countParams.length + 1);
      params.push(fecha_inicio);
      countParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += ' AND g.fecha <= $' + (params.length + 1);
      countQuery += ' AND fecha <= $' + (countParams.length + 1);
      params.push(fecha_fin);
      countParams.push(fecha_fin);
    }

    if (metodo_pago) {
      query += ' AND g.metodo_pago = $' + (params.length + 1);
      countQuery += ' AND metodo_pago = $' + (countParams.length + 1);
      params.push(metodo_pago);
      countParams.push(metodo_pago);
    }

    query += ' ORDER BY g.fecha DESC, g.fecha_creacion DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [expensesResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({
      success: true,
      data: {
        expenses: expensesResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener gastos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener un gasto por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT g.*, v.placa, v.marca, v.modelo, u.nombre as creado_por_nombre
      FROM gastos g
      LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
      LEFT JOIN usuarios u ON g.creado_por = u.id
      WHERE g.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear un nuevo gasto
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('vehiculo_id').notEmpty().withMessage('El vehículo es requerido'),
  body('tipo_gasto').isIn(['combustible', 'mantenimiento', 'repuestos', 'seguro', 'impuestos', 'peajes', 'otros']).withMessage('Tipo de gasto inválido'),
  body('descripcion').trim().notEmpty().withMessage('La descripción es requerida'),
  body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser mayor o igual a 0'),
  body('fecha').isDate().withMessage('Fecha inválida'),
  body('metodo_pago').optional().isIn(['efectivo', 'tarjeta', 'transferencia', 'otro']).withMessage('Método de pago inválido')
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
      vehiculo_id, tipo_gasto, descripcion, monto, fecha, kilometraje,
      litros, precio_por_litro, metodo_pago = 'efectivo', factura,
      proveedor, notas
    } = req.body;

    // Verificar que el vehículo existe
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

    // Validaciones específicas para combustible
    if (tipo_gasto === 'combustible') {
      if (!litros || !precio_por_litro) {
        return res.status(400).json({
          success: false,
          message: 'Para gastos de combustible se requieren litros y precio por litro'
        });
      }
      
      // Calcular precio por litro si no se proporciona
      const calculatedPrecio = litros > 0 ? (monto / litros).toFixed(2) : 0;
      if (!precio_por_litro || precio_por_litro <= 0) {
        req.body.precio_por_litro = calculatedPrecio;
      }
    }

    const result = await pool.query(`
      INSERT INTO gastos (
        vehiculo_id, tipo_gasto, descripcion, monto, fecha, kilometraje,
        litros, precio_por_litro, metodo_pago, factura, proveedor, notas, creado_por
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      vehiculo_id, tipo_gasto, descripcion, monto, fecha, kilometraje,
      litros, precio_por_litro, metodo_pago, factura, proveedor, notas, req.user.id
    ]);

    // Emitir alerta en tiempo real para gastos significativos
    const io = req.app.get('io');
    if (monto > 1000) { // Umbral configurable
      io.emit('high_expense', {
        expense_id: result.rows[0].id,
        vehiculo_id: vehiculo_id,
        monto: monto,
        message: `Gasto significativo registrado: $${monto} - ${descripcion}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Gasto creado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar un gasto
router.put('/:id', [
  authenticateToken,
  requireRole(['admin', 'operador']),
  body('descripcion').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía'),
  body('monto').optional().isFloat({ min: 0 }).withMessage('El monto debe ser mayor o igual a 0'),
  body('fecha').optional().isDate().withMessage('Fecha inválida'),
  body('metodo_pago').optional().isIn(['efectivo', 'tarjeta', 'transferencia', 'otro']).withMessage('Método de pago inválido')
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

    // Verificar si el gasto existe
    const existingExpense = await pool.query(
      'SELECT id FROM gastos WHERE id = $1',
      [id]
    );

    if (existingExpense.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
    }

    // Validaciones específicas para combustible
    if (updateData.tipo_gasto === 'combustible') {
      if (updateData.litros && updateData.monto) {
        updateData.precio_por_litro = updateData.litros > 0 ? 
          (updateData.monto / updateData.litros).toFixed(2) : 0;
      }
    }

    // Construir consulta dinámica
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const result = await pool.query(`
      UPDATE gastos 
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `, [...values, id]);

    res.json({
      success: true,
      message: 'Gasto actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar un gasto
router.delete('/:id', [
  authenticateToken,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el gasto existe
    const existingExpense = await pool.query(
      'SELECT id FROM gastos WHERE id = $1',
      [id]
    );

    if (existingExpense.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
    }

    await pool.query('DELETE FROM gastos WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Gasto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de gastos
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0],
      vehiculo_id
    } = req.query;

    let vehicleFilter = '';
    const params = [startDate, endDate];
    
    if (vehiculo_id) {
      vehicleFilter = ' AND vehiculo_id = $3';
      params.push(vehiculo_id);
    }

    const [
      totalExpenses,
      expensesByType,
      expensesByMonth,
      expensesByPayment,
      fuelStats,
      topVehiclesByExpense
    ] = await Promise.all([
      pool.query(`SELECT SUM(monto) as total, COUNT(*) as count FROM gastos WHERE fecha BETWEEN $1 AND $2${vehicleFilter}`, params),
      pool.query(`
        SELECT tipo_gasto, SUM(monto) as total, COUNT(*) as count
        FROM gastos 
        WHERE fecha BETWEEN $1 AND $2${vehicleFilter}
        GROUP BY tipo_gasto
        ORDER BY total DESC
      `, params),
      pool.query(`
        SELECT DATE_TRUNC('month', fecha) as month, SUM(monto) as total, COUNT(*) as count
        FROM gastos 
        WHERE fecha BETWEEN $1 AND $2${vehicleFilter}
        GROUP BY DATE_TRUNC('month', fecha)
        ORDER BY month
      `, params),
      pool.query(`
        SELECT metodo_pago, SUM(monto) as total, COUNT(*) as count
        FROM gastos 
        WHERE fecha BETWEEN $1 AND $2${vehicleFilter}
        GROUP BY metodo_pago
        ORDER BY total DESC
      `, params),
      pool.query(`
        SELECT 
          SUM(litros) as total_litros,
          SUM(monto) as total_combustible,
          AVG(precio_por_litro) as precio_promedio,
          COUNT(*) as cargas
        FROM gastos 
        WHERE tipo_gasto = 'combustible' AND fecha BETWEEN $1 AND $2${vehicleFilter}
      `, params),
      pool.query(`
        SELECT 
          v.placa, v.marca, v.modelo,
          SUM(g.monto) as total_gastos,
          COUNT(*) as count_gastos
        FROM gastos g
        LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
        WHERE g.fecha BETWEEN $1 AND $2${vehicleFilter}
        GROUP BY v.id, v.placa, v.marca, v.modelo
        ORDER BY total_gastos DESC
        LIMIT 10
      `, params)
    ]);

    res.json({
      success: true,
      data: {
        total_gastado: parseFloat(totalExpenses.rows[0].total) || 0,
        total_transacciones: parseInt(totalExpenses.rows[0].count),
        por_tipo: expensesByType.rows,
        por_mes: expensesByMonth.rows,
        por_metodo_pago: expensesByPayment.rows,
        estadisticas_combustible: fuelStats.rows[0],
        vehiculos_mas_costosos: topVehiclesByExpense.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de gastos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener análisis de consumo de combustible
router.get('/fuel/analysis', authenticateToken, async (req, res) => {
  try {
    const { 
      vehiculo_id,
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0]
    } = req.query;

    let vehicleFilter = '';
    const params = [startDate, endDate];
    
    if (vehiculo_id) {
      vehicleFilter = ' AND g.vehiculo_id = $3';
      params.push(vehiculo_id);
    }

    const result = await pool.query(`
      SELECT 
        g.fecha,
        g.litros,
        g.monto,
        g.precio_por_litro,
        g.kilometraje,
        v.placa,
        v.marca,
        v.modelo,
        LAG(g.kilometraje) OVER (PARTITION BY g.vehiculo_id ORDER BY g.fecha) as km_anterior,
        LAG(g.litros) OVER (PARTITION BY g.vehiculo_id ORDER BY g.fecha) as litros_anterior
      FROM gastos g
      LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
      WHERE g.tipo_gasto = 'combustible' 
        AND g.fecha BETWEEN $1 AND $2
        AND g.kilometraje IS NOT NULL
        AND g.litros > 0${vehicleFilter}
      ORDER BY g.vehiculo_id, g.fecha
    `, params);

    // Calcular rendimiento por cada tanqueada
    const processedData = result.rows.map(row => {
      if (row.km_anterior && row.litros_anterior) {
        const kmRecorridos = row.kilometraje - row.km_anterior;
        const litrosUsados = row.litros_anterior;
        const rendimiento = kmRecorridos / litrosUsados;
        
        return {
          ...row,
          km_recorridos: kmRecorridos,
          rendimiento_km_por_litro: Math.round(rendimiento * 100) / 100,
          rendimiento_litros_por_100km: Math.round((100 / rendimiento) * 100) / 100
        };
      }
      return { ...row, km_recorridos: null, rendimiento_km_por_litro: null, rendimiento_litros_por_100km: null };
    }).filter(row => row.rendimiento_km_por_litro !== null);

    res.json({
      success: true,
      data: processedData
    });

  } catch (error) {
    console.error('Error al obtener análisis de combustible:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
