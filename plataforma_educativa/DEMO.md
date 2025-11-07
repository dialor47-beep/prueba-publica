# 🎓 DEMOSTRACIÓN DE LA PLATAFORMA EDUCATIVA

## 🚀 Instrucciones de Inicio Rápido

### **Opción 1: Script Automático**
```bash
cd plataforma_educativa
chmod +x start.sh
./start.sh
```

### **Opción 2: Inicio Manual**
```bash
cd plataforma_educativa
node server.js
```

### **Opción 3: Con npm**
```bash
cd plataforma_educativa
npm install
npm start
```

## 🔑 Credenciales de Acceso

**Usuario Predeterminado:**
- **Username**: `admin`
- **Password**: `admin123`

**Para crear nuevas cuentas:**
1. Ir a "Regístrate aquí"
2. Completar el formulario
3. Los datos se guardarán automáticamente

## 📋 Guía de Demostración

### **1. Página de Inicio**
- ✅ Diseño moderno y responsivo
- ✅ Formulario de login/registro
- ✅ Validación de campos
- ✅ Mensajes de error y éxito

### **2. Dashboard Principal**
- 📊 **Estadísticas**:
  - Cursos disponibles: 6
  - Cursos completados: Variable
  - Certificados: Variable
  - Eventos próximos: Variable

- 📚 **Cursos Recientes**: Vista previa de los 3 primeros cursos
- 📅 **Eventos Próximos**: Próximos 3 eventos programados

### **3. Navegación del Dashboard**
Barra lateral con las siguientes secciones:

#### **🏠 Dashboard**
- Vista general de la actividad
- Estadísticas en tiempo real
- Accesos rápidos

#### **📚 Cursos**
- **6 cursos predefinidos**:
  - Inducción y Reinducción
  - Gobierno Digital
  - Seguridad y Salud en el Trabajo
  - Gestión de Calidad
  - Atención al Usuario
  - Modelo Integrado de Planeación y Gestión MIPG

- **Funcionalidades**:
  - Crear nuevo curso
  - Editar curso existente
  - Eliminar curso
  - Ver progreso de cada curso

#### **📁 Materiales**
- **Subida de archivos**:
  - Documentos: PDF, Word, Excel, PowerPoint
  - Videos: MP4, AVI, MOV
  - Enlaces web
  - Presentaciones

- **Organización**:
  - Filtrar por curso
  - Filtrar por tipo
  - Descarga de archivos
  - Eliminación de material

#### **📝 Evaluaciones**
- **Crear quiz personalizados**
- **Tipos de preguntas**: Múltiple opción
- **Configuración**: Tiempo límite, número de preguntas
- **Calificación**: Automática
- **Certificados**: Generación al aprobar

#### **📅 Calendario**
- **Vista mensual interactiva**
- **Tipos de eventos**:
  - Clases
  - Reuniones
  - Webinars
- **Integración**:
  - Google Meet
  - YouTube
- **Navegación**: Cambiar entre meses

#### **🏆 Certificados**
- **Generación automática** al aprobar cursos
- **Información incluida**:
  - Nombre del curso
  - Puntuación obtenida
  - Fecha de emisión
  - Validez del certificado
- **Descarga**: Formato PDF

#### **📊 Actividad**
- **Historial completo** de acciones:
  - Logins y registros
  - Creación/edición de cursos
  - Subida de archivos
  - Creación de evaluaciones
  - Participación en eventos
- **Timestamps**: Fecha y hora de cada acción

#### **⚙️ Configuración**
- **Información personal**: Vista de datos del usuario
- **Preferencias**: Configuraciones futuras

## 🎯 Características Técnicas

### **Frontend**
- **Diseño responsivo**: Funciona en móviles, tablets y desktop
- **Interfaz moderna**: CSS Grid, Flexbox, variables CSS
- **Interactividad**: JavaScript vanilla sin frameworks
- **Validación**: Formularios con validación en tiempo real
- **Animaciones**: Transiciones suaves y feedback visual

### **Backend**
- **Node.js puro**: Sin dependencias externas
- **API REST**: Endpoints para todas las funcionalidades
- **Almacenamiento**: En memoria (fácil de migrar a BD)
- **Seguridad básica**: CORS configurado
- **Manejo de archivos**: Multer para subida de archivos

### **Funcionalidades Avanzadas**
- **Autenticación**: Sistema de login/registro
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Validación de datos**: Client-side y server-side
- **Manejo de errores**: Mensajes informativos
- **Logging**: Registro de actividad del usuario

## 🧪 Escenarios de Demostración

### **Escenario 1: Nuevo Usuario**
1. Registrarse con datos propios
2. Explorar el dashboard
3. Ver cursos disponibles
4. Intentar subir un material

### **Escenario 2: Administrador**
1. Usar credenciales admin
2. Crear un nuevo curso
3. Programar un evento
4. Ver el historial de actividad

### **Escenario 3: Estudiante**
1. Explorar cursos disponibles
2. Ver materiales de cada curso
3. Tomar una evaluación
4. Descargar certificado (si aprueba)

### **Escenario 4: Gestión de Contenido**
1. Subir varios tipos de archivos
2. Crear un quiz personalizado
3. Programar reunión virtual
4. Ver estadísticas actualizadas

## 🔧 Personalización

### **Cambiar Colores**
Editar variables en `public/css/style.css`:
```css
:root {
    --primary-500: #0066FF;    /* Color principal */
    --success: #28a745;        /* Color de éxito */
    --warning: #ffc107;        /* Color de advertencia */
    --error: #dc3545;          /* Color de error */
}
```

### **Agregar Cursos**
Editar array en `server.js`:
```javascript
let courses = [
    {
        id: 'nuevo-id',
        title: 'Nombre del Curso',
        description: 'Descripción',
        category: 'Categoría',
        duration: 'X horas'
    }
];
```

### **Modificar UI**
- HTML: `public/index.html` y `public/dashboard.html`
- CSS: `public/css/style.css`
- JavaScript: `public/js/auth.js` y `public/js/dashboard.js`

## 🚀 Próximos Pasos

### **Para Producción**
1. **Base de datos**: Migrar a PostgreSQL/MySQL
2. **Autenticación**: Implementar JWT real
3. **Almacenamiento**: S3 o similar para archivos
4. **Seguridad**: HTTPS, rate limiting, sanitización
5. **Escalabilidad**: Load balancer, cache, CDN

### **Nuevas Funcionalidades**
- Notificaciones push
- Chat en tiempo real
- Reportes avanzados
- Integración con LMS externos
- Multi-idioma
- Aplicación móvil

## 📞 Soporte

**Desarrollado por**: MiniMax Agent  
**Versión**: 1.0.0  
**Licencia**: MIT  

Para reportar problemas o sugerir mejoras, documentar en el código fuente o crear una nueva versión con las modificaciones deseadas.

---

¡Disfruta explorando la plataforma! 🎉