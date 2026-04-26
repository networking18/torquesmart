# Sistema de Mantenimiento de Flota Vehicular

Un sistema integral para el control y la logística del mantenimiento de vehículos de manera eficiente, organizada y en tiempo real.

## Características Principales

### 🚗 Gestión de Flota
- Registro completo de vehículos con placa, modelo, año, kilometraje y estado
- Control de estado actual de cada unidad (activo, inactivo, mantenimiento, baja)
- Seguimiento de kilometraje y fechas importantes

### 🔧 Mantenimiento Programado
- Programación y registro de actividades de mantenimiento
- Tipos predefinidos de mantenimiento con periodicidades configurables
- Control de costos de mano de obra y repuestos
- Historial completo de mantenimientos por vehículo

### ⚠️ Sistema de Alertas
- Alertas automáticas basadas en fechas o kilometraje
- Notificaciones en tiempo real vía WebSocket
- Priorización de alertas (baja, media, alta, urgente)
- Sistema de notificaciones no leídas

### 💰 Control de Gastos
- Registro detallado de todos los gastos asociados
- Categorización: combustible, mantenimiento, repuestos, seguros, impuestos, peajes
- Análisis de consumo de combustible y rendimiento
- Control de métodos de pago y proveedores

### 📊 Reportes Dinámicos
- Dashboard intuitivo con estadísticas en tiempo real
- Reportes de costos por vehículo y por período
- Análisis de rendimiento de combustible
- Estadísticas de mantenimientos y fallas
- Exportación a CSV

### 👥 Sistema de Usuarios
- Roles de usuario (Administrador y Operador)
- Autenticación segura con JWT
- Control de acceso basado en permisos

### 📱 Accesibilidad
- Interfaz web responsive
- Compatible con dispositivos móviles
- Diseño moderno con Material-UI

## Arquitectura del Sistema

### Backend (Node.js + Express)
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **Comunicación en Tiempo Real**: Socket.IO
- **Validación**: Express Validator
- **Seguridad**: Helmet, CORS

### Frontend (React + TypeScript)
- **Framework**: React 18 con TypeScript
- **UI Library**: Material-UI (MUI)
- **Gráficos**: Recharts
- **Estado**: Context API
- **Formularios**: React Hook Form
- **Notificaciones**: React Hot Toast

## Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd fleet-maintenance-system
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb fleet_maintenance

# Importar el esquema
psql -d fleet_maintenance -f database/schema.sql
```

### 3. Configurar Variables de Entorno
Copiar y configurar el archivo `.env`:
```bash
cp .env.example .env
```

Editar las siguientes variables:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleet_maintenance
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT Configuration
JWT_SECRET=tu_jwt_secreto_aqui
JWT_EXPIRES_IN=24h

# Email Configuration (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Instalar Dependencias
```bash
# Instalar dependencias del servidor
npm install

# Instalar dependencias del cliente
cd client
npm install
cd ..
```

### 5. Iniciar la Aplicación
```bash
# Modo desarrollo (inicia servidor y cliente simultáneamente)
npm run dev

# O iniciar por separado:
npm run server  # Servidor backend en puerto 5000
npm run client  # Cliente React en puerto 3000
```

### 6. Acceso a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Usuario por Defecto
- **Email**: admin@fleet.com
- **Contraseña**: admin123

## Estructura del Proyecto

```
fleet-maintenance-system/
├── server/                 # Backend Node.js
│   ├── config/            # Configuración de base de datos
│   ├── middleware/        # Middleware de autenticación
│   ├── routes/           # Rutas API
│   └── index.js          # Servidor principal
├── client/               # Frontend React
│   ├── public/          # Archivos estáticos
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── contexts/    # Contextos de estado
│   │   ├── pages/       # Páginas principales
│   │   └── services/    # Servicios API
│   └── package.json
├── database/            # Esquema de base de datos
│   └── schema.sql
├── package.json         # Dependencias raíz
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Vehículos
- `GET /api/vehicles` - Listar vehículos
- `POST /api/vehicles` - Crear vehículo
- `GET /api/vehicles/:id` - Obtener vehículo
- `PUT /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo

### Mantenimientos
- `GET /api/maintenance` - Listar mantenimientos
- `POST /api/maintenance` - Crear mantenimiento
- `GET /api/maintenance/:id` - Obtener mantenimiento
- `PUT /api/maintenance/:id` - Actualizar mantenimiento
- `DELETE /api/maintenance/:id` - Eliminar mantenimiento

### Gastos
- `GET /api/expenses` - Listar gastos
- `POST /api/expenses` - Crear gasto
- `GET /api/expenses/:id` - Obtener gasto
- `PUT /api/expenses/:id` - Actualizar gasto
- `DELETE /api/expenses/:id` - Eliminar gasto

### Alertas
- `GET /api/alerts` - Listar alertas
- `POST /api/alerts` - Crear alerta
- `PUT /api/alerts/:id/read` - Marcar como leída
- `POST /api/alerts/generate-automatic` - Generar alertas automáticas

### Reportes
- `GET /api/reports/fleet/overview` - Reporte general de flota
- `GET /api/reports/costs/by-vehicle` - Costos por vehículo
- `GET /api/reports/fuel/performance` - Rendimiento combustible
- `GET /api/reports/export/csv` - Exportar a CSV

## Características Técnicas

### Seguridad
- Autenticación JWT con tokens expirables
- Encriptación de contraseñas con bcrypt
- Validación de datos de entrada
- Protección contra ataques CSRF y XSS
- Headers de seguridad con Helmet

### Base de Datos
- Diseño relacional con PostgreSQL
- Índices optimizados para rendimiento
- Triggers para actualización automática de timestamps
- Transacciones ACID para integridad de datos

### Frontend
- TypeScript para seguridad de tipos
- Componentes reutilizables
- Estado global con Context API
- Navegación con React Router
- Gráficos interactivos con Recharts

### Backend
- Arquitectura modular y escalable
- Middleware para autenticación y validación
- Manejo de errores centralizado
- Logging y monitoreo
- API RESTful

## Desarrollo Futuro

### Funcionalidades Planificadas
- [ ] Módulo de inventario de repuestos
- [ ] Sistema de recordatorios por email/SMS
- [ ] Aplicación móvil nativa
- [ ] Integración con GPS para seguimiento
- [ ] Reportes personalizados
- [ ] Múltiples idiomas
- [ ] Sistema de aprobaciones
- [ ] Integración con sistemas de facturación

### Mejoras Técnicas
- [ ] Testing automatizado
- [ ] Docker containerización
- [ ] CI/CD pipeline
- [ ] Microservicios
- [ ] Caching con Redis
- [ ] Balanceo de carga

## Licencia

MIT License - Ver archivo LICENSE para detalles.

## Soporte

Para soporte técnico o preguntas, contactar a:
- Email: support@fleetmanager.com
- Documentación: https://docs.fleetmanager.com
- Issues: GitHub Issues

---

**Nota**: Este sistema está diseñado para ser escalable y adaptable a diferentes necesidades de gestión de flotas vehiculares.
