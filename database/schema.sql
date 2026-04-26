-- Sistema de Mantenimiento de Flota Vehicular
-- Base de Datos PostgreSQL

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'operador' CHECK (rol IN ('admin', 'operador')),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion TIMESTAMP
);

-- Tabla de Vehículos
CREATE TABLE vehiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL,
    color VARCHAR(30),
    kilometraje_actual INTEGER DEFAULT 0,
    kilometraje_compra INTEGER DEFAULT 0,
    tipo_combustible VARCHAR(20) DEFAULT 'gasolina' CHECK (tipo_combustible IN ('gasolina', 'diesel', 'electrico', 'hibrido')),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'mantenimiento', 'baja')),
    fecha_compra DATE,
    fecha_ultimo_mantenimiento DATE,
    proximo_mantenimiento_km INTEGER,
    proximo_mantenimiento_fecha DATE,
    imagen VARCHAR(255),
    notas TEXT,
    creado_por UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Mantenimiento
CREATE TABLE tipos_mantenimiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    periodicidad_km INTEGER,
    periodicidad_dias INTEGER,
    alerta_km_antes INTEGER DEFAULT 1000,
    alerta_dias_antes INTEGER DEFAULT 7,
    activo BOOLEAN DEFAULT true
);

-- Tabla de Mantenimientos
CREATE TABLE mantenimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehiculo_id UUID NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
    tipo_mantenimiento_id UUID REFERENCES tipos_mantenimiento(id),
    descripcion VARCHAR(255) NOT NULL,
    fecha_programada DATE NOT NULL,
    fecha_realizacion DATE,
    kilometraje INTEGER,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
    prioridad VARCHAR(10) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    tecnico VARCHAR(100),
    costo_mano_obra DECIMAL(10,2) DEFAULT 0,
    costo_repuestos DECIMAL(10,2) DEFAULT 0,
    costo_total DECIMAL(10,2) GENERATED ALWAYS AS (costo_mano_obra + costo_repuestos) STORED,
    observaciones TEXT,
    realizado_por UUID REFERENCES usuarios(id),
    creado_por UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Repuestos/Partes
CREATE TABLE repuestos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mantenimiento_id UUID REFERENCES mantenimientos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50),
    cantidad INTEGER DEFAULT 1,
    costo_unitario DECIMAL(10,2) NOT NULL,
    costo_total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * costo_unitario) STORED,
    proveedor VARCHAR(100),
    fecha_compra DATE,
    factura VARCHAR(50)
);

-- Tabla de Gastos
CREATE TABLE gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehiculo_id UUID NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
    tipo_gasto VARCHAR(30) NOT NULL CHECK (tipo_gasto IN ('combustible', 'mantenimiento', 'repuestos', 'seguro', 'impuestos', 'peajes', 'otros')),
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    kilometraje INTEGER,
    litros DECIMAL(8,2), -- Para combustible
    precio_por_litro DECIMAL(8,2), -- Para combustible
    metodo_pago VARCHAR(20) DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'otro')),
    factura VARCHAR(50),
    proveedor VARCHAR(100),
    notas TEXT,
    creado_por UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Alertas
CREATE TABLE alertas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehiculo_id UUID REFERENCES vehiculos(id) ON DELETE CASCADE,
    mantenimiento_id UUID REFERENCES mantenimientos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_alerta VARCHAR(20) NOT NULL CHECK (tipo_alerta IN ('mantenimiento', 'kilometraje', 'fecha', 'costo', 'sistema')),
    prioridad VARCHAR(10) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    leida BOOLEAN DEFAULT false,
    fecha_alerta DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    resuelta_por UUID REFERENCES usuarios(id)
);

-- Tabla de Configuración del Sistema
CREATE TABLE configuracion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(20) DEFAULT 'texto' CHECK (tipo IN ('texto', 'numero', 'booleano', 'fecha')),
    actualizado_por UUID REFERENCES usuarios(id),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_mantenimientos_vehiculo ON mantenimientos(vehiculo_id);
CREATE INDEX idx_mantenimientos_estado ON mantenimientos(estado);
CREATE INDEX idx_mantenimientos_fecha ON mantenimientos(fecha_programada);
CREATE INDEX idx_gastos_vehiculo ON gastos(vehiculo_id);
CREATE INDEX idx_gastos_fecha ON gastos(fecha);
CREATE INDEX idx_gastos_tipo ON gastos(tipo_gasto);
CREATE INDEX idx_alertas_vehiculo ON alertas(vehiculo_id);
CREATE INDEX idx_alertas_leida ON alertas(leida);
CREATE INDEX idx_alertas_fecha ON alertas(fecha_alerta);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vehiculos_actualizar
    BEFORE UPDATE ON vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_mantenimientos_actualizar
    BEFORE UPDATE ON mantenimientos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Insertar datos iniciales
INSERT INTO tipos_mantenimiento (nombre, descripcion, periodicidad_km, periodicidad_dias) VALUES
('Cambio de Aceite', 'Cambio de aceite y filtro', 5000, 90),
('Revisión General', 'Revisión completa del vehículo', 10000, 180),
('Rotación de Llantas', 'Rotación y balanceo de llantas', 8000, 120),
('Filtro de Aire', 'Cambio de filtro de aire', 10000, 365),
('Filtro de Combustible', 'Cambio de filtro de combustible', 20000, 365),
('Frenos', 'Inspección y servicio de frenos', 15000, 180),
('Batería', 'Inspección de batería y terminales', 8000, 90),
('Sistema de Enfriamiento', 'Revisión del sistema de enfriamiento', 20000, 365);

INSERT INTO configuracion (clave, valor, descripcion, tipo) VALUES
('alerta_km_antes', '1000', 'Kilómetros antes para alerta de mantenimiento', 'numero'),
('alerta_dias_antes', '7', 'Días antes para alerta de mantenimiento', 'numero'),
('costo_hora_mano_obra', '50', 'Costo por hora de mano de obra', 'numero'),
('moneda', 'USD', 'Moneda del sistema', 'texto'),
('timezone', 'America/Mexico_City', 'Zona horaria del sistema', 'texto');

-- Crear usuario administrador por defecto (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES
('Administrador', 'admin@fleet.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '1234567890');
