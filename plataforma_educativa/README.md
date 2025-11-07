# Plataforma Educativa

Una plataforma educativa completa desarrollada por MiniMax Agent que permite la gestión de cursos, materiales, evaluaciones y certificaciones.

## 🚀 Características Principales

### **Autenticación y Usuarios**
- ✅ Sistema de registro y login seguro
- ✅ Gestión de perfiles de usuario
- ✅ Autenticación con JWT
- ✅ Control de sesiones

### **Gestión de Cursos**
- ✅ Crear, editar y eliminar cursos
- ✅ Categorización de cursos
- ✅ Duración personalizada
- ✅ Cursos predefinidos:
  - Inducción y Reinducción
  - Gobierno Digital
  - Seguridad y Salud en el Trabajo
  - Gestión de Calidad
  - Atención al Usuario
  - Modelo Integrado de Planeación y Gestión MIPG

### **Gestión de Materiales**
- ✅ Subida de documentos (PDF, Word, Excel, PowerPoint)
- ✅ Carga de videos
- ✅ Gestión de enlaces web
- ✅ Organización por curso
- ✅ Filtrado y búsqueda

### **Sistema de Evaluaciones**
- ✅ Creación de quizzes personalizados
- ✅ Múltiples tipos de preguntas
- ✅ Calificación automática
- ✅ Reintentos de evaluación
- ✅ Generación de certificados

### **Calendario y Eventos**
- ✅ Calendario interactivo
- ✅ Programación de clases
- ✅ Gestión de reuniones virtuales
- ✅ Integración con Google Meet
- ✅ Enlaces a YouTube
- ✅ Notificaciones de eventos

### **Certificaciones**
- ✅ Generación automática de certificados
- ✅ Certificados de aprobación
- ✅ Validación de certificaciones
- ✅ Descarga de certificados en PDF
- ✅ Historial de certificaciones

### **Historial de Actividad**
- ✅ Registro completo de acciones
- ✅ Log de cambios en la plataforma
- ✅ Seguimiento de actividad por usuario
- ✅ Auditoría de modificaciones

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo y moderno
- **JavaScript**: Interactividad sin frameworks
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía profesional

### **Backend**
- **Node.js**: Servidor de aplicaciones
- **Express.js**: Framework web
- **CORS**: Configuración de políticas de origen
- **Multer**: Subida de archivos
- **bcrypt**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **UUID**: Generación de identificadores

## 📁 Estructura del Proyecto

```
plataforma_educativa/
├── public/                    # Frontend
│   ├── css/
│   │   └── style.css         # Estilos principales
│   ├── js/
│   │   ├── auth.js           # Gestión de autenticación
│   │   └── dashboard.js      # Lógica del dashboard
│   ├── images/               # Imágenes
│   ├── uploads/              # Archivos subidos
│   ├── index.html            # Página de login
│   └── dashboard.html        # Dashboard principal
├── backend/
│   └── server.js            # Servidor principal
├── data/                     # Base de datos simulada
└── package.json              # Dependencias
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js (versión 14 o superior)
- npm o yarn

### **Paso 1: Instalar Dependencias**
```bash
cd plataforma_educativa
npm install
```

### **Paso 2: Iniciar el Servidor**
```bash
npm start
```
El servidor se iniciará en: `http://localhost:4000`

### **Paso 3: Acceder a la Aplicación**
1. Abrir navegador web
2. Ir a: `http://localhost:4000`
3. Usar credenciales predeterminadas:
   - **Usuario**: admin
   - **Contraseña**: admin123

## 📋 Uso de la Plataforma

### **1. Registro y Login**
- Crear nueva cuenta o usar credenciales predeterminadas
- El sistema manejará automáticamente la autenticación

### **2. Dashboard Principal**
- Ver estadísticas de cursos y progreso
- Acceso rápido a todas las funciones
- Vista de eventos próximos

### **3. Gestión de Cursos**
- **Crear Curso**: Formulario con título, descripción, categoría y duración
- **Editar Curso**: Modificar información existente
- **Eliminar Curso**: Confirmación requerida

### **4. Materiales de Curso**
- **Subir Material**: Drag & drop o selector de archivos
- **Tipos Soportados**: PDF, DOC, XLS, PPT, MP4, AVI, MOV
- **Organización**: Por curso y tipo de material
- **Filtros**: Por curso y tipo

### **5. Evaluaciones**
- **Crear Quiz**: Formulario dinámico para preguntas
- **Tomar Quiz**: Interfaz de evaluación
- **Calificación**: Automática con certificados

### **6. Calendario**
- **Vista Mensual**: Navegación entre meses
- **Eventos**: Clases, reuniones, webinars
- **Enlaces**: Google Meet y YouTube integrados
- **Creación**: Formulario completo de evento

### **7. Certificados**
- **Generación Automática**: Al aprobar cursos
- **Descarga**: En formato PDF
- **Validación**: Fechas de emisión y validez

### **8. Configuración**
- **Perfil**: Información personal
- **Preferencias**: Configuraciones de usuario

## 🔧 Configuración Avanzada

### **Variables de Entorno**
El servidor utiliza variables de entorno para configuración:

```javascript
const JWT_SECRET = 'educacion_plataforma_secret_2025'; // Cambiar en producción
const PORT = 3000; // Puerto del servidor
```

### **Base de Datos**
Actualmente utiliza almacenamiento en memoria (JSON). Para producción:
- Migrar a PostgreSQL, MySQL o MongoDB
- Implementar sistema de respaldos
- Configurar usuarios de base de datos

### **Almacenamiento de Archivos**
- **Ubicación**: `public/uploads/`
- **Límite**: 100MB por archivo
- **Tipos**: Acepta todos los formatos de documentos y videos

## 🌐 Integraciones

### **Google Meet**
- Enlaces automáticos en eventos
- Configuración de reuniones virtuales
- Integración con calendario

### **YouTube**
- Enlaces a videos educativos
- Reproductor embebido
- Gestión de contenido multimedia

## 📊 Funcionalidades del Sistema

### **Seguridad**
- Hash de contraseñas con bcrypt
- Autenticación JWT
- CORS configurado
- Validación de entrada
- Sanitización de datos

### **Rendimiento**
- Carga lazy de componentes
- Optimización de imágenes
- Minificación de assets
- Cache de navegador

### **Accesibilidad**
- Diseño responsivo
- Contraste de colores WCAG AA
- Navegación por teclado
- Etiquetas semánticas

## 🚀 Desarrollo y Extensibilidad

### **Agregar Nuevas Funciones**
1. **Backend**: Agregar rutas en `server.js`
2. **Frontend**: Nuevas secciones en `dashboard.js`
3. **UI**: Componentes en `style.css`

### **Personalización**
- **Colores**: Modificar variables CSS en `:root`
- **Tipografía**: Cambiar fuente en `style.css`
- **Layout**: Ajustar grid y espaciado

### **Escalabilidad**
- **Micro-servicios**: Separar funcionalidades
- **Load Balancing**: Múltiples instancias
- **CDN**: Para archivos estáticos
- **Cache**: Redis para sesiones

## 📝 API Endpoints

### **Autenticación**
- `POST /api/register` - Registro de usuario
- `POST /api/login` - Inicio de sesión

### **Cursos**
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso
- `PUT /api/courses/:id` - Actualizar curso
- `DELETE /api/courses/:id` - Eliminar curso

### **Materiales**
- `POST /api/upload` - Subir archivo
- `GET /api/materials` - Listar materiales

### **Evaluaciones**
- `POST /api/quiz` - Crear quiz
- `POST /api/submit-quiz` - Enviar respuestas

### **Eventos**
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento

### **Certificados**
- `GET /api/certificates` - Listar certificados
- `POST /api/certificates` - Generar certificado

## 🤝 Soporte y Contribución

### **Reportar Problemas**
- Crear issue en el repositorio
- Describir pasos para reproducir
- Incluir información del navegador

### **Contribuciones**
- Fork del repositorio
- Crear branch de feature
- Commit y push de cambios
- Pull request con descripción

## 📄 Licencia

Este proyecto está desarrollado por **MiniMax Agent** y está disponible bajo la licencia MIT.

## 🎯 Futuras Mejoras

- [ ] **Base de datos real** (PostgreSQL/MySQL)
- [ ] **Notificaciones push**
- [ ] **Chat en vivo**
- [ ] **Analytics avanzados**
- [ ] **Exportación de datos**
- [ ] **API REST completa**
- [ ] **Aplicación móvil**
- [ ] **Integración con LMS externos**
- [ ] **Gamificación**
- [ ] **Multi-idioma**

---

**Desarrollado con ❤️ por MiniMax Agent**  
*Plataforma Educativa Completa - Versión 1.0*