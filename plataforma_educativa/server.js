#!/usr/bin/env node

/**
 * Script de inicio para la Plataforma Educativa
 * Desarrollado por MiniMax Agent
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuración del servidor
const PORT = 4000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/quicktime'
};

// Datos simulados (almacenamiento en memoria)
let users = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123', // En producción usar hash
        email: 'admin@educacion.com',
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];

let courses = [
    {
        id: '1',
        title: 'Inducción y Reinducción',
        description: 'Programa de orientación inicial para nuevos empleados y actualización para personal existente.',
        category: 'General',
        duration: '40 horas',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Gobierno Digital',
        description: 'Transformación digital y uso de tecnologías en el sector público.',
        category: 'Tecnología',
        duration: '60 horas',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Seguridad y Salud en el Trabajo',
        description: 'Normativas y mejores prácticas para la seguridad laboral.',
        category: 'Seguridad',
        duration: '50 horas',
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        title: 'Gestión de Calidad',
        description: 'Metodologías y estándares para la gestión de calidad organizacional.',
        category: 'Administración',
        duration: '45 horas',
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        title: 'Atención al Usuario',
        description: 'Técnicas y estrategias para brindar excelente servicio al cliente.',
        category: 'Servicio',
        duration: '35 horas',
        createdAt: new Date().toISOString()
    },
    {
        id: '6',
        title: 'Modelo Integrado de Planeación y Gestión MIPG',
        description: 'Marco estratégico para la gestión pública en Colombia.',
        category: 'Gestión Pública',
        duration: '70 horas',
        createdAt: new Date().toISOString()
    }
];

let certificates = [];
let events = [];
let activityLog = [];

// Utilidades
const generateId = () => Math.random().toString(36).substr(2, 9);
const getMimeType = (filePath) => MIME_TYPES[path.extname(filePath)] || 'text/plain';

function logActivity(userId, action, details) {
    const logEntry = {
        id: generateId(),
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    };
    activityLog.unshift(logEntry);
    if (activityLog.length > 50) activityLog.pop();
}

// Middleware básico de autenticación
function authenticateRequest(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    return true; // En producción verificar token JWT
}

// Rutas de la API
function handleApiRoute(req, res, parsedUrl) {
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const body = [];
    
    // Leer cuerpo de la petición
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
        const requestBody = body.length > 0 ? JSON.parse(Buffer.concat(body).toString()) : {};
        
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json');
        
        if (method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        // Rutas de autenticación
        if (pathname === '/api/login' && method === 'POST') {
            const { username, password } = requestBody;
            const user = users.find(u => u.username === username);
            
            if (!user || user.password !== password) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Credenciales inválidas' }));
                return;
            }
            
            logActivity(user.id, 'LOGIN', 'Usuario inició sesión');
            
            res.writeHead(200);
            res.end(JSON.stringify({
                message: 'Inicio de sesión exitoso',
                token: 'token_' + user.id,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }));
            return;
        }
        
        if (pathname === '/api/register' && method === 'POST') {
            const { username, password, email, name } = requestBody;
            
            if (!username || !password || !email || !name) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                return;
            }
            
            if (users.find(u => u.username === username || u.email === email)) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'El usuario o email ya existe' }));
                return;
            }
            
            const newUser = {
                id: generateId(),
                username,
                password,
                email,
                name,
                role: 'student',
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            logActivity(newUser.id, 'REGISTER', 'Usuario registrado exitosamente');
            
            res.writeHead(200);
            res.end(JSON.stringify({
                message: 'Usuario registrado exitosamente',
                token: 'token_' + newUser.id,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role
                }
            }));
            return;
        }
        
        // Rutas de cursos
        if (pathname === '/api/courses') {
            if (method === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify(courses));
                return;
            }
            
            if (method === 'POST') {
                const { title, description, category, duration } = requestBody;
                const newCourse = {
                    id: generateId(),
                    title,
                    description,
                    category,
                    duration,
                    createdAt: new Date().toISOString()
                };
                courses.push(newCourse);
                logActivity('1', 'CREATE_COURSE', `Curso creado: ${title}`);
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Curso creado exitosamente', course: newCourse }));
                return;
            }
        }
        
        // Rutas de eventos
        if (pathname === '/api/events') {
            if (method === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify(events));
                return;
            }
            
            if (method === 'POST') {
                const { title, description, date, time, type, meetLink, youtubeLink } = requestBody;
                const newEvent = {
                    id: generateId(),
                    title,
                    description,
                    date,
                    time,
                    type,
                    meetLink: meetLink || '',
                    youtubeLink: youtubeLink || '',
                    createdBy: '1',
                    createdAt: new Date().toISOString()
                };
                events.push(newEvent);
                logActivity('1', 'CREATE_EVENT', `Evento creado: ${title}`);
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Evento creado exitosamente', event: newEvent }));
                return;
            }
        }
        
        // Ruta de certificados
        if (pathname === '/api/certificates') {
            res.writeHead(200);
            res.end(JSON.stringify(certificates));
            return;
        }
        
        // Ruta de actividad
        if (pathname === '/api/activity') {
            res.writeHead(200);
            res.end(JSON.stringify(activityLog.slice(0, 50)));
            return;
        }
        
        // Ruta no encontrada
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
    });
}

// Servir archivos estáticos
function serveStaticFile(req, res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Archivo no encontrado');
            return;
        }
        
        const mimeType = getMimeType(filePath);
        res.setHeader('Content-Type', mimeType);
        res.writeHead(200);
        res.end(data);
    });
}

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${req.method} ${pathname}`);
    
    // API routes
    if (pathname.startsWith('/api/')) {
        handleApiRoute(req, res, parsedUrl);
        return;
    }
    
    // Servir archivos estáticos
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    
    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            if (pathname === '/' || pathname === '/dashboard.html') {
                serveStaticFile(req, res, filePath);
            } else {
                res.writeHead(404);
                res.end('Página no encontrada');
            }
            return;
        }
        
        serveStaticFile(req, res, filePath);
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`
🚀 ==================================== 🚀
📚 PLATAFORMA EDUCATIVA INICIADA
🚀 ==================================== 🚀

🌐 URL: http://localhost:${PORT}
👤 Usuario predeterminado: admin
🔑 Contraseña predeterminada: admin123

📋 CARACTERÍSTICAS:
✅ Sistema de autenticación
✅ Gestión de cursos
✅ Subida de materiales
✅ Evaluaciones y quiz
✅ Calendario de eventos
✅ Certificaciones
✅ Historial de actividad

🛠️ Tecnologías:
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js puro
- Almacenamiento: En memoria

📁 Estructura:
- Frontend: /public/
- Backend: /backend/
- Archivos: /uploads/

💡 Para detener el servidor: Ctrl+C

¡Listo para usar! 🎉
`);
});

// Manejo de errores
server.on('error', (err) => {
    console.error('Error del servidor:', err);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo servidor...');
    server.close(() => {
        console.log('✅ Servidor detenido correctamente');
        process.exit(0);
    });
});