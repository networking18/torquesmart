const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear base de datos SQLite en el directorio del proyecto
const dbPath = path.join(__dirname, '..', 'data', 'fleet_maintenance.db');

// Asegurar que el directorio existe
const fs = require('fs');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Crear tablas
  db.serialize(() => {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT DEFAULT 'operador',
      telefono TEXT,
      activo BOOLEAN DEFAULT 1,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      ultima_conexion DATETIME
    )`);

    // Tabla de vehículos
    db.run(`CREATE TABLE IF NOT EXISTS vehiculos (
      id TEXT PRIMARY KEY,
      placa TEXT UNIQUE NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      anio INTEGER NOT NULL,
      color TEXT,
      kilometraje_actual INTEGER DEFAULT 0,
      kilometraje_compra INTEGER DEFAULT 0,
      tipo_combustible TEXT DEFAULT 'gasolina',
      estado TEXT DEFAULT 'activo',
      fecha_compra TEXT,
      fecha_ultimo_mantenimiento TEXT,
      proximo_mantenimiento_km INTEGER,
      proximo_mantenimiento_fecha TEXT,
      imagen TEXT,
      notas TEXT,
      creado_por TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de tipos de mantenimiento
    db.run(`CREATE TABLE IF NOT EXISTS tipos_mantenimiento (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      periodicidad_km INTEGER,
      periodicidad_dias INTEGER,
      alerta_km_antes INTEGER DEFAULT 1000,
      alerta_dias_antes INTEGER DEFAULT 7,
      activo BOOLEAN DEFAULT 1
    )`);

    // Tabla de mantenimientos
    db.run(`CREATE TABLE IF NOT EXISTS mantenimientos (
      id TEXT PRIMARY KEY,
      vehiculo_id TEXT NOT NULL,
      tipo_mantenimiento_id TEXT,
      descripcion TEXT NOT NULL,
      fecha_programada TEXT NOT NULL,
      fecha_realizacion TEXT,
      kilometraje INTEGER,
      estado TEXT DEFAULT 'pendiente',
      prioridad TEXT DEFAULT 'media',
      tecnico TEXT,
      costo_mano_obra REAL DEFAULT 0,
      costo_repuestos REAL DEFAULT 0,
      costo_total REAL GENERATED ALWAYS AS (costo_mano_obra + costo_repuestos) STORED,
      observaciones TEXT,
      realizado_por TEXT,
      creado_por TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    )`);

    // Tabla de gastos
    db.run(`CREATE TABLE IF NOT EXISTS gastos (
      id TEXT PRIMARY KEY,
      vehiculo_id TEXT NOT NULL,
      tipo_gasto TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT NOT NULL,
      kilometraje INTEGER,
      litros REAL,
      precio_por_litro REAL,
      metodo_pago TEXT DEFAULT 'efectivo',
      factura TEXT,
      proveedor TEXT,
      notas TEXT,
      creado_por TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    )`);

    // Tabla de alertas
    db.run(`CREATE TABLE IF NOT EXISTS alertas (
      id TEXT PRIMARY KEY,
      vehiculo_id TEXT,
      mantenimiento_id TEXT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      tipo_alerta TEXT NOT NULL,
      prioridad TEXT DEFAULT 'media',
      leida BOOLEAN DEFAULT 0,
      fecha_alerta TEXT NOT NULL,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_resolucion DATETIME,
      resuelta_por TEXT,
      FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
      FOREIGN KEY (mantenimiento_id) REFERENCES mantenimientos(id)
    )`);

    // Insertar datos iniciales
    insertInitialData();
  });
}

function insertInitialData() {
  // Insertar tipos de mantenimiento
  const tiposMantenimiento = [
    ['1', 'Cambio de Aceite', 'Cambio de aceite y filtro', 5000, 90, 1000, 7, 1],
    ['2', 'Revisión General', 'Revisión completa del vehículo', 10000, 180, 1000, 7, 1],
    ['3', 'Rotación de Llantas', 'Rotación y balanceo de llantas', 8000, 120, 1000, 7, 1],
    ['4', 'Filtro de Aire', 'Cambio de filtro de aire', 10000, 365, 1000, 7, 1],
    ['5', 'Frenos', 'Inspección y servicio de frenos', 15000, 180, 1000, 7, 1]
  ];

  const stmt = db.prepare("INSERT OR IGNORE INTO tipos_mantenimiento (id, nombre, descripcion, periodicidad_km, periodicidad_dias, alerta_km_antes, alerta_dias_antes, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  
  tiposMantenimiento.forEach(tipo => {
    stmt.run(tipo);
  });
  
  stmt.finalize();

  // Insertar usuario administrador (password: admin123)
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  db.run("INSERT OR IGNORE INTO usuarios (id, nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)", 
    ['admin', 'Administrador', 'admin@fleet.com', hashedPassword, 'admin', '1234567890'],
    function(err) {
      if (err) {
        console.error('Error al insertar usuario admin:', err);
      } else {
        console.log('Usuario administrador creado exitosamente');
      }
    }
  );
}

module.exports = db;
