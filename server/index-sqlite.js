const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection (SQLite)
const db = require('./config/database-sqlite');

// Socket.IO for real-time alerts
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Usuario ${socket.id} se unió a la sala ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Helper function to promisify db operations
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Routes
const authRoutes = express.Router();

// Login endpoint
authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await dbQuery('SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Simple password check (for demo)
    if (password !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generate simple token (for demo)
    const token = Buffer.from(`${user.id}:${user.email}:${user.rol}`).toString('base64');

    // Update last connection
    await dbRun('UPDATE usuarios SET ultima_conexion = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Get profile endpoint
authRoutes.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token requerido'
      });
    }

    // Simple token decode (for demo)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    const users = await dbQuery('SELECT id, nombre, email, rol, telefono, activo, fecha_creacion, ultima_conexion FROM usuarios WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Dashboard stats endpoint
const dashboardRoutes = express.Router();

dashboardRoutes.get('/fleet/overview', async (req, res) => {
  try {
    const fleetStats = await dbQuery(`
      SELECT 
        COUNT(*) as total_vehiculos,
        COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
        COUNT(CASE WHEN estado = 'mantenimiento' THEN 1 END) en_mantenimiento,
        COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) inactivos,
        AVG(kilometraje_actual) as km_promedio,
        SUM(kilometraje_actual) as km_total
      FROM vehiculos 
      WHERE estado != 'baja'
    `);

    const maintenanceStats = await dbQuery(`
      SELECT 
        COUNT(*) as total_mantenimientos,
        COUNT(CASE WHEN estado = 'completado' THEN 1 END) as completados,
        COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
        COUNT(CASE WHEN estado = 'en_progreso' THEN 1 END) en_progreso,
        SUM(CASE WHEN estado = 'completado' THEN costo_total ELSE 0 END) as costo_total_mantenimientos
      FROM mantenimientos 
      WHERE fecha_programada BETWEEN date('now', '-1 year') AND date('now')
    `);

    const expenseStats = await dbQuery(`
      SELECT 
        COUNT(*) as total_gastos,
        SUM(monto) as monto_total,
        AVG(monto) as monto_promedio,
        COUNT(CASE WHEN tipo_gasto = 'combustible' THEN 1 END) as gastos_combustible,
        SUM(CASE WHEN tipo_gasto = 'combustible' THEN monto ELSE 0 END) as monto_combustible
      FROM gastos 
      WHERE fecha BETWEEN date('now', '-1 year') AND date('now')
    `);

    const recentActivity = await dbQuery(`
      SELECT 'mantenimiento' as tipo, descripcion, fecha_programada as fecha, 
             (SELECT placa FROM vehiculos WHERE id = m.vehiculo_id) as placa,
             estado
      FROM mantenimientos m
      WHERE fecha_programada >= date('now', '-7 days')
      ORDER BY fecha_programada DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        periodo: { 
          startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        estadisticas_flota: fleetStats[0] || {},
        estadisticas_mantenimientos: maintenanceStats[0] || {},
        estadisticas_gastos: expenseStats[0] || {},
        actividad_reciente: recentActivity
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

// Vehicle stats endpoint
const vehicleRoutes = express.Router();

vehicleRoutes.get('/stats/overview', async (req, res) => {
  try {
    const totalVehicles = await dbQuery('SELECT COUNT(*) as total FROM vehiculos WHERE estado != ?', ['baja']);
    const activeVehicles = await dbQuery('SELECT COUNT(*) as total FROM vehiculos WHERE estado = ?', ['activo']);
    const maintenanceVehicles = await dbQuery('SELECT COUNT(*) as total FROM vehiculos WHERE estado = ?', ['mantenimiento']);
    const inactiveVehicles = await dbQuery('SELECT COUNT(*) as total FROM vehiculos WHERE estado = ?', ['inactivo']);
    const avgKilometers = await dbQuery('SELECT AVG(kilometraje_actual) as avg_km FROM vehiculos WHERE estado != ?', ['baja']);

    res.json({
      success: true,
      data: {
        total_vehiculos: totalVehicles[0]?.total || 0,
        vehiculos_activos: activeVehicles[0]?.total || 0,
        vehiculos_mantenimiento: maintenanceVehicles[0]?.total || 0,
        vehiculos_inactivos: inactiveVehicles[0]?.total || 0,
        kilometraje_promedio: Math.round(parseFloat(avgKilometers[0]?.avg_km) || 0),
        por_tipo_combustible: [],
        por_anio: []
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

// Maintenance stats endpoint
const maintenanceRoutes = express.Router();

maintenanceRoutes.get('/stats/overview', async (req, res) => {
  try {
    const totalMaintenance = await dbQuery('SELECT COUNT(*) as total FROM mantenimientos WHERE fecha_programada BETWEEN date("now", "-1 year") AND date("now")');
    const completedMaintenance = await dbQuery('SELECT COUNT(*) as total FROM mantenimientos WHERE estado = ? AND fecha_programada BETWEEN date("now", "-1 year") AND date("now")', ['completado']);
    const pendingMaintenance = await dbQuery('SELECT COUNT(*) as total FROM mantenimientos WHERE estado = ? AND fecha_programada BETWEEN date("now", "-1 year") AND date("now")', ['pendiente']);
    const inProgressMaintenance = await dbQuery('SELECT COUNT(*) as total FROM mantenimientos WHERE estado = ? AND fecha_programada BETWEEN date("now", "-1 year") AND date("now")', ['en_progreso']);
    const totalCost = await dbQuery('SELECT SUM(costo_total) as total FROM mantenimientos WHERE estado = ? AND fecha_programada BETWEEN date("now", "-1 year") AND date("now")', ['completado']);

    res.json({
      success: true,
      data: {
        total_mantenimientos: totalMaintenance[0]?.total || 0,
        mantenimientos_completados: completedMaintenance[0]?.total || 0,
        mantenimientos_pendientes: pendingMaintenance[0]?.total || 0,
        mantenimientos_en_progreso: inProgressMaintenance[0]?.total || 0,
        costo_total: parseFloat(totalCost[0]?.total) || 0,
        por_tipo: [],
        por_mes: []
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

// Expense stats endpoint
const expenseRoutes = express.Router();

expenseRoutes.get('/stats/overview', async (req, res) => {
  try {
    const totalExpenses = await dbQuery('SELECT SUM(monto) as total, COUNT(*) as count FROM gastos WHERE fecha BETWEEN date("now", "-1 year") AND date("now")');
    
    res.json({
      success: true,
      data: {
        total_gastado: parseFloat(totalExpenses[0]?.total) || 0,
        total_transacciones: totalExpenses[0]?.count || 0,
        por_tipo: [],
        por_mes: [],
        estadisticas_combustible: {},
        vehiculos_mas_costosos: []
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

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

const PORT = 5001;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Usuario: admin@fleet.com`);
  console.log(`Contraseña: admin123`);
});

// Make io accessible to routes
app.set('io', io);

module.exports = app;
