const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'educacion_plataforma_secret_2025';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/', express.static(path.join(__dirname, '../public')));

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Datos simulados (en producción sería una base de datos)
let users = [
    {
        id: '1',
        username: 'admin',
        password: '$2b$10$8K1p/aRN0SS4JJEP.PPOO.tSiY6Sw1b7Fg0f5F8C2D4E5F6G7H8I9', // 'admin123'
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

let userProgress = [];
let certificates = [];
let events = [];
let activityLog = [];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Función para registrar actividad
const logActivity = (userId, action, details) => {
    const logEntry = {
        id: uuidv4(),
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    };
    activityLog.unshift(logEntry);
    if (activityLog.length > 100) activityLog.pop();
};

// Rutas de autenticación
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email, name } = req.body;
        
        if (!username || !password || !email || !name) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el usuario ya existe
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario o email ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            email,
            name,
            role: 'student',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        logActivity(newUser.id, 'REGISTER', 'Usuario registrado exitosamente');

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);
        res.json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        logActivity(user.id, 'LOGIN', 'Usuario inició sesión');

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Rutas de cursos
app.get('/api/courses', authenticateToken, (req, res) => {
    res.json(courses);
});

app.post('/api/courses', authenticateToken, (req, res) => {
    const { title, description, category, duration } = req.body;
    
    const newCourse = {
        id: uuidv4(),
        title,
        description,
        category,
        duration,
        createdAt: new Date().toISOString()
    };

    courses.push(newCourse);
    logActivity(req.user.id, 'CREATE_COURSE', `Curso creado: ${title}`);

    res.json({ message: 'Curso creado exitosamente', course: newCourse });
});

app.put('/api/courses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, category, duration } = req.body;
    
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Curso no encontrado' });
    }

    courses[courseIndex] = { ...courses[courseIndex], title, description, category, duration };
    logActivity(req.user.id, 'UPDATE_COURSE', `Curso actualizado: ${title}`);

    res.json({ message: 'Curso actualizado exitosamente', course: courses[courseIndex] });
});

app.delete('/api/courses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const courseIndex = courses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const courseName = courses[courseIndex].title;
    courses.splice(courseIndex, 1);
    logActivity(req.user.id, 'DELETE_COURSE', `Curso eliminado: ${courseName}`);

    res.json({ message: 'Curso eliminado exitosamente' });
});

// Rutas de archivos
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    try {
        const { courseId, fileType, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }

        const fileData = {
            id: uuidv4(),
            courseId,
            originalName: file.originalname,
            fileName: file.filename,
            filePath: `/uploads/${file.filename}`,
            fileType,
            fileSize: file.size,
            description: description || '',
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.user.id
        };

        logActivity(req.user.id, 'UPLOAD_FILE', `Archivo subido: ${file.originalname}`);

        res.json({ message: 'Archivo subido exitosamente', file: fileData });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir el archivo' });
    }
});

// Rutas de quiz
app.post('/api/quiz', authenticateToken, (req, res) => {
    const { courseId, questions, title } = req.body;
    
    const quiz = {
        id: uuidv4(),
        courseId,
        title: title || 'Quiz del Curso',
        questions,
        createdAt: new Date().toISOString()
    };

    logActivity(req.user.id, 'CREATE_QUIZ', `Quiz creado para curso: ${courseId}`);

    res.json({ message: 'Quiz creado exitosamente', quiz });
});

app.post('/api/submit-quiz', authenticateToken, (req, res) => {
    const { quizId, answers } = req.body;
    
    // Simulación de calificación
    const score = Math.floor(Math.random() * 100) + 1;
    const passed = score >= 60;

    const submission = {
        id: uuidv4(),
        userId: req.user.id,
        quizId,
        answers,
        score,
        passed,
        submittedAt: new Date().toISOString()
    };

    // Si pasó, generar certificado
    if (passed) {
        const certificate = {
            id: uuidv4(),
            userId: req.user.id,
            courseId: req.body.courseId,
            score,
            issuedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 año
        };
        certificates.push(certificate);
    }

    logActivity(req.user.id, 'SUBMIT_QUIZ', `Quiz enviado. Puntuación: ${score}`);

    res.json({ 
        message: passed ? '¡Felicidades! Has aprobado el curso' : 'Necesitas una puntuación mayor para aprobar',
        result: submission,
        certificate: passed ? certificates[certificates.length - 1] : null
    });
});

// Rutas de eventos/calendario
app.get('/api/events', authenticateToken, (req, res) => {
    res.json(events);
});

app.post('/api/events', authenticateToken, (req, res) => {
    const { title, description, date, time, type, meetLink, youtubeLink } = req.body;
    
    const newEvent = {
        id: uuidv4(),
        title,
        description,
        date,
        time,
        type, // 'class', 'meeting', 'webinar'
        meetLink: meetLink || '',
        youtubeLink: youtubeLink || '',
        createdBy: req.user.id,
        createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    logActivity(req.user.id, 'CREATE_EVENT', `Evento creado: ${title}`);

    res.json({ message: 'Evento creado exitosamente', event: newEvent });
});

// Rutas de progreso
app.get('/api/progress/:userId', authenticateToken, (req, res) => {
    const userProgressData = userProgress.filter(p => p.userId === req.params.userId);
    res.json(userProgressData);
});

// Rutas de certificados
app.get('/api/certificates', authenticateToken, (req, res) => {
    const userCertificates = certificates.filter(c => c.userId === req.user.id);
    res.json(userCertificates);
});

// Rutas de actividad
app.get('/api/activity', authenticateToken, (req, res) => {
    res.json(activityLog.slice(0, 50)); // Últimas 50 actividades
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor de la Plataforma Educativa ejecutándose en http://localhost:${PORT}`);
    console.log('📚 Plataforma lista para usar');
    console.log('🔐 Usuario por defecto: admin / admin123');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada:', err);
});