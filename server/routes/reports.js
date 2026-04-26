const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Reporte general de la flota
router.get('/fleet/overview', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0]
    } = req.query;

    const [
      fleetStats,
      maintenanceStats,
      expenseStats,
      topVehicles,
      recentActivity
    ] = await Promise.all([
      // Estadísticas de la flota
      pool.query(`
        SELECT 
          COUNT(*) as total_vehiculos,
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
          COUNT(CASE WHEN estado = 'mantenimiento' THEN 1 END) en_mantenimiento,
          COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) inactivos,
          AVG(kilometraje_actual) as km_promedio,
          SUM(kilometraje_actual) as km_total
        FROM vehiculos 
        WHERE estado != 'baja'
      `),
      
      // Estadísticas de mantenimientos
      pool.query(`
        SELECT 
          COUNT(*) as total_mantenimientos,
          COUNT(CASE WHEN estado = 'completado' THEN 1 END) as completados,
          COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
          COUNT(CASE WHEN estado = 'en_progreso' THEN 1 END) en_progreso,
          SUM(CASE WHEN estado = 'completado' THEN costo_total ELSE 0 END) as costo_total_mantenimientos
        FROM mantenimientos 
        WHERE fecha_programada BETWEEN $1 AND $2
      `, [startDate, endDate]),
      
      // Estadísticas de gastos
      pool.query(`
        SELECT 
          COUNT(*) as total_gastos,
          SUM(monto) as monto_total,
          AVG(monto) as monto_promedio,
          COUNT(CASE WHEN tipo_gasto = 'combustible' THEN 1 END) as gastos_combustible,
          SUM(CASE WHEN tipo_gasto = 'combustible' THEN monto ELSE 0 END) as monto_combustible
        FROM gastos 
        WHERE fecha BETWEEN $1 AND $2
      `, [startDate, endDate]),
      
      // Vehículos con más actividad
      pool.query(`
        SELECT 
          v.id, v.placa, v.marca, v.modelo, v.kilometraje_actual,
          COUNT(DISTINCT m.id) as mantenimientos_count,
          COALESCE(SUM(CASE WHEN m.estado = 'completado' THEN m.costo_total ELSE 0 END), 0) as mantenimiento_costo,
          COALESCE(SUM(g.monto), 0) as gastos_totales
        FROM vehiculos v
        LEFT JOIN mantenimientos m ON v.id = m.vehiculo_id AND m.fecha_programada BETWEEN $1 AND $2
        LEFT JOIN gastos g ON v.id = g.vehiculo_id AND g.fecha BETWEEN $1 AND $2
        WHERE v.estado != 'baja'
        GROUP BY v.id, v.placa, v.marca, v.modelo, v.kilometraje_actual
        ORDER BY (mantenimientos_count + COUNT(DISTINCT g.id)) DESC
        LIMIT 10
      `, [startDate, endDate]),
      
      // Actividad reciente
      pool.query(`
        (SELECT 'mantenimiento' as tipo, m.descripcion, m.fecha_programada as fecha, v.placa, 
                CASE WHEN m.estado = 'completado' THEN 'Completado' ELSE m.estado END as estado
         FROM mantenimientos m
         LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
         WHERE m.fecha_programada >= CURRENT_DATE - INTERVAL '7 days'
         ORDER BY m.fecha_programada DESC LIMIT 5)
        UNION ALL
        (SELECT 'gasto' as tipo, g.descripcion, g.fecha, v.placa, g.tipo_gasto as estado
         FROM gastos g
         LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
         WHERE g.fecha >= CURRENT_DATE - INTERVAL '7 days'
         ORDER BY g.fecha DESC LIMIT 5)
        ORDER BY fecha DESC
        LIMIT 10
      `)
    ]);

    res.json({
      success: true,
      data: {
        periodo: { startDate, endDate },
        estadisticas_flota: fleetStats.rows[0],
        estadisticas_mantenimientos: maintenanceStats.rows[0],
        estadisticas_gastos: expenseStats.rows[0],
        vehiculos_mas_activos: topVehicles.rows,
        actividad_reciente: recentActivity.rows
      }
    });

  } catch (error) {
    console.error('Error al generar reporte general:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Reporte de costos por vehículo
router.get('/costs/by-vehicle', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0],
      vehiculo_id
    } = req.query;

    let vehicleFilter = '';
    const params = [startDate, endDate];
    
    if (vehiculo_id) {
      vehicleFilter = ' AND v.id = $3';
      params.push(vehiculo_id);
    }

    const result = await pool.query(`
      SELECT 
        v.id, v.placa, v.marca, v.modelo, v.anio, v.tipo_combustible,
        v.kilometraje_actual, v.fecha_compra,
        COALESCE(mant.total_mantenimientos, 0) as total_mantenimientos,
        COALESCE(mant.costo_mantenimientos, 0) as costo_mantenimientos,
        COALESCE(gast.total_gastos, 0) as total_gastos,
        COALESCE(gast.costo_gastos, 0) as costo_gastos,
        COALESCE(gast.costo_combustible, 0) as costo_combustible,
        COALESCE(mant.costo_mantenimientos, 0) + COALESCE(gast.costo_gastos, 0) as costo_total_operacion,
        CASE 
          WHEN v.kilometraje_actual > 0 AND v.fecha_compra IS NOT NULL
          THEN (COALESCE(mant.costo_mantenimientos, 0) + COALESCE(gast.costo_gastos, 0)) / v.kilometraje_actual
          ELSE 0
        END as costo_por_km
      FROM vehiculos v
      LEFT JOIN (
        SELECT 
          vehiculo_id,
          COUNT(*) as total_mantenimientos,
          SUM(CASE WHEN estado = 'completado' THEN costo_total ELSE 0 END) as costo_mantenimientos
        FROM mantenimientos 
        WHERE fecha_programada BETWEEN $1 AND $2
        GROUP BY vehiculo_id
      ) mant ON v.id = mant.vehiculo_id
      LEFT JOIN (
        SELECT 
          vehiculo_id,
          COUNT(*) as total_gastos,
          SUM(monto) as costo_gastos,
          SUM(CASE WHEN tipo_gasto = 'combustible' THEN monto ELSE 0 END) as costo_combustible
        FROM gastos 
        WHERE fecha BETWEEN $1 AND $2
        GROUP BY vehiculo_id
      ) gast ON v.id = gast.vehiculo_id
      WHERE v.estado != 'baja'${vehicleFilter}
      ORDER BY costo_total_operacion DESC
    `, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al generar reporte de costos por vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Reporte de rendimiento de combustible
router.get('/fuel/performance', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0],
      vehiculo_id
    } = req.query;

    let vehicleFilter = '';
    const params = [startDate, endDate];
    
    if (vehiculo_id) {
      vehicleFilter = ' AND g.vehiculo_id = $3';
      params.push(vehiculo_id);
    }

    const result = await pool.query(`
      WITH fuel_consumption AS (
        SELECT 
          g.vehiculo_id,
          g.fecha,
          g.litros,
          g.monto,
          g.precio_por_litro,
          g.kilometraje,
          LAG(g.kilometraje) OVER (PARTITION BY g.vehiculo_id ORDER BY g.fecha) as km_anterior,
          v.placa,
          v.marca,
          v.modelo
        FROM gastos g
        LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
        WHERE g.tipo_gasto = 'combustible' 
          AND g.fecha BETWEEN $1 AND $2
          AND g.kilometraje IS NOT NULL
          AND g.litros > 0${vehicleFilter}
      )
      SELECT 
        vehiculo_id,
        placa,
        marca,
        modelo,
        COUNT(*) as total_cargas,
        SUM(litros) as total_litros,
        SUM(monto) as total_monto,
        AVG(precio_por_litro) as precio_promedio,
        MAX(kilometraje) - MIN(kilometraje) as km_recorridos,
        CASE 
          WHEN SUM(litros) > 0 AND (MAX(kilometraje) - MIN(kilometraje)) > 0
          THEN (MAX(kilometraje) - MIN(kilometraje)) / SUM(litros)
          ELSE 0
        END as rendimiento_km_por_litro,
        CASE 
          WHEN SUM(litros) > 0 AND (MAX(kilometraje) - MIN(kilometraje)) > 0
          THEN 100 / ((MAX(kilometraje) - MIN(kilometraje)) / SUM(litros))
          ELSE 0
        END as consumo_litros_por_100km
      FROM fuel_consumption
      GROUP BY vehiculo_id, placa, marca, modelo
      HAVING COUNT(*) > 1 AND (MAX(kilometraje) - MIN(kilometraje)) > 0
      ORDER BY rendimiento_km_por_litro DESC
    `, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al generar reporte de rendimiento de combustible:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Reporte de mantenimientos programados
router.get('/maintenance/schedule', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date().toISOString().split('T')[0],
      endDate = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
    } = req.query;

    const result = await pool.query(`
      SELECT 
        m.id,
        m.descripcion,
        m.fecha_programada,
        m.estado,
        m.prioridad,
        m.kilometraje,
        m.costo_total,
        v.placa,
        v.marca,
        v.modelo,
        v.kilometraje_actual,
        tm.nombre as tipo_mantenimiento,
        CASE 
          WHEN m.fecha_programada < CURRENT_DATE THEN 'Vencido'
          WHEN m.fecha_programada = CURRENT_DATE THEN 'Hoy'
          WHEN m.fecha_programada <= CURRENT_DATE + INTERVAL '7 days' THEN 'Esta semana'
          WHEN m.fecha_programada <= CURRENT_DATE + INTERVAL '30 days' THEN 'Este mes'
          ELSE 'Futuro'
        END as categoria_fecha,
        CASE 
          WHEN m.kilometraje IS NOT NULL AND v.kilometraje_actual >= m.kilometraje THEN 'Vencido por km'
          WHEN m.kilometraje IS NOT NULL AND v.kilometraje_actual >= (m.kilometraje - 500) THEN 'Próximo por km'
          ELSE 'En fecha'
        END as categoria_km,
        DATEDIFF(m.fecha_programada, CURRENT_DATE) as dias_restantes
      FROM mantenimientos m
      LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
      LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
      WHERE m.fecha_programada BETWEEN $1 AND $2
        AND m.estado IN ('pendiente', 'en_progreso')
      ORDER BY m.fecha_programada ASC, m.prioridad DESC
    `, [startDate, endDate]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al generar reporte de mantenimientos programados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Reporte de análisis de fallas
router.get('/maintenance/failure-analysis', authenticateToken, async (req, res) => {
  try {
    const { 
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0]
    } = req.query;

    const [
      failureTypes,
      vehiclesByFailures,
      monthlyFailures,
      maintenanceFrequency
    ] = await Promise.all([
      // Tipos de fallas más comunes
      pool.query(`
        SELECT 
          tm.nombre as tipo_mantenimiento,
          COUNT(*) as frecuencia,
          AVG(m.costo_total) as costo_promedio,
          SUM(m.costo_total) as costo_total
        FROM mantenimientos m
        LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
        WHERE m.estado = 'completado'
          AND m.fecha_programada BETWEEN $1 AND $2
          AND (m.descripcion ILIKE '%falla%' OR m.descripcion ILIKE '%averia%' OR m.descripcion ILIKE '%problema%')
        GROUP BY tm.nombre
        ORDER BY frecuencia DESC
      `, [startDate, endDate]),
      
      // Vehículos con más fallas
      pool.query(`
        SELECT 
          v.placa, v.marca, v.modelo,
          COUNT(*) as total_fallas,
          AVG(m.costo_total) as costo_promedio_falla,
          SUM(m.costo_total) as costo_total_fallas
        FROM mantenimientos m
        LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
        WHERE m.estado = 'completado'
          AND m.fecha_programada BETWEEN $1 AND $2
          AND (m.descripcion ILIKE '%falla%' OR m.descripcion ILIKE '%averia%' OR m.descripcion ILIKE '%problema%')
        GROUP BY v.id, v.placa, v.marca, v.modelo
        HAVING COUNT(*) > 0
        ORDER BY total_fallas DESC
        LIMIT 10
      `, [startDate, endDate]),
      
      // Fallas por mes
      pool.query(`
        SELECT 
          DATE_TRUNC('month', m.fecha_realizacion) as mes,
          COUNT(*) as total_fallas,
          SUM(m.costo_total) as costo_total
        FROM mantenimientos m
        WHERE m.estado = 'completado'
          AND m.fecha_programada BETWEEN $1 AND $2
          AND (m.descripcion ILIKE '%falla%' OR m.descripcion ILIKE '%averia%' OR m.descripcion ILIKE '%problema%')
        GROUP BY DATE_TRUNC('month', m.fecha_realizacion)
        ORDER BY mes
      `, [startDate, endDate]),
      
      // Frecuencia de mantenimientos por vehículo
      pool.query(`
        SELECT 
          v.placa, v.marca, v.modelo,
          COUNT(*) as total_mantenimientos,
          COUNT(CASE WHEN m.descripcion ILIKE '%falla%' OR m.descripcion ILIKE '%averia%' OR m.descripcion ILIKE '%problema%' THEN 1 END) as fallas,
          ROUND(COUNT(CASE WHEN m.descripcion ILIKE '%falla%' OR m.descripcion ILIKE '%averia%' OR m.descripcion ILIKE '%problema%' THEN 1 END) * 100.0 / COUNT(*), 2) as porcentaje_fallas,
          AVG(m.costo_total) as costo_promedio_mantenimiento
        FROM mantenimientos m
        LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
        WHERE m.estado = 'completado'
          AND m.fecha_programada BETWEEN $1 AND $2
        GROUP BY v.id, v.placa, v.marca, v.modelo
        HAVING COUNT(*) > 0
        ORDER BY porcentaje_fallas DESC
      `, [startDate, endDate])
    ]);

    res.json({
      success: true,
      data: {
        tipos_fallas: failureTypes.rows,
        vehiculos_mas_fallas: vehiclesByFailures.rows,
        fallas_por_mes: monthlyFailures.rows,
        frecuencia_mantenimientos: maintenanceFrequency.rows
      }
    });

  } catch (error) {
    console.error('Error al generar análisis de fallas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Exportar reporte a CSV
router.get('/export/csv', authenticateToken, async (req, res) => {
  try {
    const { 
      reportType = 'fleet',
      startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate = new Date().toISOString().split('T')[0]
    } = req.query;

    let query = '';
    let filename = '';

    switch (reportType) {
      case 'fleet':
        query = `
          SELECT 
            v.placa, v.marca, v.modelo, v.anio, v.estado, v.kilometraje_actual,
            COUNT(DISTINCT m.id) as mantenimientos_count,
            COALESCE(SUM(CASE WHEN m.estado = 'completado' THEN m.costo_total ELSE 0 END), 0) as costo_mantenimientos,
            COALESCE(SUM(g.monto), 0) as costo_gastos
          FROM vehiculos v
          LEFT JOIN mantenimientos m ON v.id = m.vehiculo_id AND m.fecha_programada BETWEEN $1 AND $2
          LEFT JOIN gastos g ON v.id = g.vehiculo_id AND g.fecha BETWEEN $1 AND $2
          WHERE v.estado != 'baja'
          GROUP BY v.id, v.placa, v.marca, v.modelo, v.anio, v.estado, v.kilometraje_actual
          ORDER BY v.placa
        `;
        filename = `fleet_report_${startDate}_${endDate}.csv`;
        break;
        
      case 'maintenance':
        query = `
          SELECT 
            v.placa, v.marca, v.modelo,
            m.descripcion, m.fecha_programada, m.fecha_realizacion, m.estado, m.prioridad,
            m.costo_mano_obra, m.costo_repuestos, m.costo_total,
            tm.nombre as tipo_mantenimiento
          FROM mantenimientos m
          LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
          LEFT JOIN tipos_mantenimiento tm ON m.tipo_mantenimiento_id = tm.id
          WHERE m.fecha_programada BETWEEN $1 AND $2
          ORDER BY m.fecha_programada, v.placa
        `;
        filename = `maintenance_report_${startDate}_${endDate}.csv`;
        break;
        
      case 'expenses':
        query = `
          SELECT 
            v.placa, v.marca, v.modelo,
            g.tipo_gasto, g.descripcion, g.monto, g.fecha, g.metodo_pago,
            g.litros, g.precio_por_litro, g.proveedor
          FROM gastos g
          LEFT JOIN vehiculos v ON g.vehiculo_id = v.id
          WHERE g.fecha BETWEEN $1 AND $2
          ORDER BY g.fecha, v.placa
        `;
        filename = `expenses_report_${startDate}_${endDate}.csv`;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de reporte inválido'
        });
    }

    const result = await pool.query(query, [startDate, endDate]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay datos para exportar'
      });
    }

    // Convertir a CSV
    const headers = Object.keys(result.rows[0]);
    const csvData = [
      headers.join(','),
      ...result.rows.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar comas y comillas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);

  } catch (error) {
    console.error('Error al exportar reporte CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
