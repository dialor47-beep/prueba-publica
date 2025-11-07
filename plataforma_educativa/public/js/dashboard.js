// Variables globales
let currentUser = null;
let courses = [];
let certificates = [];
let events = [];
let activityLog = [];
let materials = [];

// Inicializar la aplicación
async function initializeApp() {
    try {
        // Cargar datos iniciales
        await loadUserData();
        await loadCourses();
        await loadCertificates();
        await loadEvents();
        await loadActivityLog();
        
        // Configurar navegación
        setupNavigation();
        
        // Cargar dashboard
        loadDashboard();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        authUtils.showMessage('Error', 'Error al cargar la aplicación', 'error');
    }
}

// Cargar datos del usuario
async function loadUserData() {
    currentUser = JSON.parse(localStorage.getItem('userData'));
    if (!currentUser) {
        throw new Error('No se encontraron datos del usuario');
    }
}

// Cargar cursos
async function loadCourses() {
    try {
        courses = await authUtils.apiRequest('/courses');
        console.log('📚 Cursos cargados:', courses.length);
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        courses = [];
    }
}

// Cargar certificados
async function loadCertificates() {
    try {
        certificates = await authUtils.apiRequest('/certificates');
        console.log('🏆 Certificados cargados:', certificates.length);
    } catch (error) {
        console.error('Error al cargar certificados:', error);
        certificates = [];
    }
}

// Cargar eventos
async function loadEvents() {
    try {
        events = await authUtils.apiRequest('/events');
        console.log('📅 Eventos cargados:', events.length);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        events = [];
    }
}

// Cargar actividad
async function loadActivityLog() {
    try {
        activityLog = await authUtils.apiRequest('/activity');
        console.log('📊 Actividad cargada:', activityLog.length);
    } catch (error) {
        console.error('Error al cargar actividad:', error);
        activityLog = [];
    }
}

// Configurar navegación
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Obtener sección
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Mostrar sección
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
    }
    
    // Actualizar título del header
    const titleMap = {
        'dashboard': 'Dashboard',
        'courses': 'Mis Cursos',
        'materials': 'Materiales',
        'quiz': 'Evaluaciones',
        'calendar': 'Calendario',
        'certificates': 'Certificados',
        'activity': 'Actividad',
        'settings': 'Configuración'
    };
    
    const headerTitle = document.querySelector('.header h1');
    if (headerTitle && titleMap[sectionName]) {
        headerTitle.textContent = titleMap[sectionName];
    }
    
    // Cargar datos específicos de la sección
    loadSectionData(sectionName);
}

// Cargar datos de sección específica
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'courses':
            loadCoursesSection();
            break;
        case 'materials':
            loadMaterialsSection();
            break;
        case 'quiz':
            loadQuizSection();
            break;
        case 'calendar':
            loadCalendarSection();
            break;
        case 'certificates':
            loadCertificatesSection();
            break;
        case 'activity':
            loadActivitySection();
            break;
    }
}

// Cargar dashboard
function loadDashboard() {
    // Actualizar estadísticas
    document.getElementById('total-courses').textContent = courses.length;
    document.getElementById('completed-courses').textContent = certificates.length;
    document.getElementById('certificates-count').textContent = certificates.length;
    
    // Calcular eventos próximos (próximos 7 días)
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= weekFromNow;
    });
    document.getElementById('upcoming-events').textContent = upcomingEvents.length;
    
    // Cargar cursos recientes
    loadRecentCourses();
    
    // Cargar eventos próximos
    loadUpcomingEvents();
}

// Cargar cursos recientes
function loadRecentCourses() {
    const container = document.getElementById('recent-courses');
    if (!container) return;
    
    if (courses.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay cursos disponibles</p>';
        return;
    }
    
    const recentCourses = courses.slice(0, 3);
    container.innerHTML = recentCourses.map(course => `
        <div class="card" style="margin-bottom: 1rem; padding: 1rem;">
            <h4 style="margin-bottom: 0.5rem; color: var(--neutral-900);">${course.title}</h4>
            <p style="color: var(--neutral-500); font-size: 0.875rem; margin-bottom: 0.5rem;">${course.description}</p>
            <div class="badge">${course.category}</div>
        </div>
    `).join('');
}

// Cargar eventos próximos
function loadUpcomingEvents() {
    const container = document.getElementById('upcoming-events-list');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay eventos programados</p>';
        return;
    }
    
    const now = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="card" style="margin-bottom: 1rem; padding: 1rem;">
            <h4 style="margin-bottom: 0.5rem; color: var(--neutral-900);">${event.title}</h4>
            <p style="color: var(--neutral-500); font-size: 0.875rem; margin-bottom: 0.5rem;">
                <i class="fas fa-calendar"></i> ${authUtils.formatDate(event.date)} - ${event.time}
            </p>
            <div class="badge badge-${event.type}">${event.type}</div>
        </div>
    `).join('');
}

// Cargar sección de cursos
function loadCoursesSection() {
    const container = document.getElementById('courses-grid');
    if (!container) return;
    
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <i class="fas fa-book" style="font-size: 3rem; color: var(--neutral-500); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--neutral-500);">No hay cursos disponibles</h3>
                <p style="color: var(--neutral-500);">Crea tu primer curso para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = courses.map(course => `
        <div class="card">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${course.title}</h3>
                    <p class="card-subtitle">${course.category}</p>
                </div>
                <div class="form-actions" style="flex-direction: column; gap: 0.5rem; width: auto;">
                    <button class="btn btn-primary" style="width: auto; height: auto; padding: 4px 8px; font-size: 0.75rem;" onclick="editCourse('${course.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" style="width: auto; height: auto; padding: 4px 8px; font-size: 0.75rem;" onclick="deleteCourse('${course.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <p>${course.description}</p>
                <div class="progress-bar" style="margin: 1rem 0;">
                    <div class="progress-fill" style="width: ${Math.random() * 100}%;"></div>
                </div>
            </div>
            <div class="card-footer">
                <span class="badge">${course.duration} horas</span>
                <button class="btn btn-primary" style="width: auto; height: auto; padding: 8px 16px;" onclick="startCourse('${course.id}')">
                    Iniciar Curso
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar sección de materiales
function loadMaterialsSection() {
    // Actualizar filtros
    updateMaterialFilters();
    
    // Cargar materiales (simulados por ahora)
    loadMaterialsGrid();
}

// Actualizar filtros de materiales
function updateMaterialFilters() {
    const courseFilter = document.getElementById('materialCourseFilter');
    if (!courseFilter) return;
    
    courseFilter.innerHTML = '<option value="">Todos los cursos</option>' + 
        courses.map(course => `<option value="${course.id}">${course.title}</option>`).join('');
}

// Cargar grid de materiales
function loadMaterialsGrid() {
    const container = document.getElementById('materials-grid');
    if (!container) return;
    
    // Materiales de ejemplo
    const exampleMaterials = [
        {
            id: '1',
            title: 'Manual de Inducción',
            type: 'document',
            course: courses[0]?.title || 'Curso',
            fileSize: '2.5 MB',
            uploadDate: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Video Introducción a MIPG',
            type: 'video',
            course: courses[1]?.title || 'Curso',
            fileSize: '150 MB',
            uploadDate: new Date().toISOString()
        }
    ];
    
    materials = exampleMaterials;
    
    if (materials.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <i class="fas fa-folder" style="font-size: 3rem; color: var(--neutral-500); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--neutral-500);">No hay materiales</h3>
                <p style="color: var(--neutral-500);">Sube tu primer material para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = materials.map(material => `
        <div class="card">
            <div class="card-header">
                <i class="fas ${getMaterialIcon(material.type)} text-primary" style="font-size: 1.5rem;"></i>
                <div class="form-actions" style="gap: 0.5rem; width: auto;">
                    <button class="btn btn-primary" style="width: auto; height: auto; padding: 4px 8px; font-size: 0.75rem;" onclick="downloadMaterial('${material.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-danger" style="width: auto; height: auto; padding: 4px 8px; font-size: 0.75rem;" onclick="deleteMaterial('${material.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h4 class="card-title">${material.title}</h4>
                <p class="text-muted">${material.course}</p>
                <p class="text-muted" style="font-size: 0.75rem;">${material.fileSize} • ${authUtils.formatDate(material.uploadDate)}</p>
            </div>
        </div>
    `).join('');
}

// Obtener icono de material
function getMaterialIcon(type) {
    const icons = {
        'document': 'fa-file-pdf',
        'video': 'fa-video',
        'link': 'fa-link',
        'presentation': 'fa-file-powerpoint'
    };
    return icons[type] || 'fa-file';
}

// Cargar sección de quiz
function loadQuizSection() {
    const container = document.getElementById('quiz-grid');
    if (!container) return;
    
    // Quiz de ejemplo
    const exampleQuizzes = courses.map(course => ({
        id: `quiz-${course.id}`,
        courseId: course.id,
        title: `Quiz: ${course.title}`,
        course: course.title,
        questions: Math.floor(Math.random() * 10) + 5,
        timeLimit: Math.floor(Math.random() * 60) + 30
    }));
    
    if (exampleQuizzes.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <i class="fas fa-question-circle" style="font-size: 3rem; color: var(--neutral-500); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--neutral-500);">No hay evaluaciones</h3>
                <p style="color: var(--neutral-500);">Crea tu primer quiz para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = exampleQuizzes.map(quiz => `
        <div class="card">
            <div class="card-header">
                <i class="fas fa-clipboard-list text-primary" style="font-size: 1.5rem;"></i>
            </div>
            <div class="card-content">
                <h4 class="card-title">${quiz.title}</h4>
                <p class="text-muted">${quiz.course}</p>
                <p class="text-muted" style="font-size: 0.875rem;">${quiz.questions} preguntas • ${quiz.timeLimit} minutos</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary" style="width: 100%;" onclick="takeQuiz('${quiz.id}')">
                    Tomar Quiz
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar sección de calendario
function loadCalendarSection() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    
    // Generar calendario actual
    generateCalendar();
}

// Generar calendario
function generateCalendar() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let calendarHTML = `
        <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3>${getMonthName(currentMonth)} ${currentYear}</h3>
            <div>
                <button class="btn btn-secondary" style="width: auto; height: auto; padding: 4px 8px;" onclick="changeMonth(-1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="btn btn-secondary" style="width: auto; height: auto; padding: 4px 8px; margin-left: 0.5rem;" onclick="changeMonth(1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
    
    calendarHTML += '<div class="calendar-grid">';
    // Días de la semana
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(day => {
        calendarHTML += `<div style="padding: 0.5rem; text-align: center; font-weight: 600; background: var(--neutral-100);">${day}</div>`;
    });
    
    // Días del mes
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = date.getMonth() === currentMonth;
        const isToday = date.toDateString() === now.toDateString();
        const dateEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
        
        let classes = 'calendar-day';
        if (!isCurrentMonth) classes += ' other-month';
        if (isToday) classes += ' today';
        
        calendarHTML += `
            <div class="${classes}">
                <div class="calendar-day-header">${date.getDate()}</div>
                ${dateEvents.map(event => `
                    <div class="calendar-event ${event.type}" onclick="showEventDetails('${event.id}')">
                        ${event.title}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    
    const container = document.getElementById('calendar-container');
    if (container) {
        container.innerHTML = calendarHTML;
    }
}

// Obtener nombre del mes
function getMonthName(monthIndex) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
}

// Cargar sección de certificados
function loadCertificatesSection() {
    const container = document.getElementById('certificates-grid');
    if (!container) return;
    
    if (certificates.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <i class="fas fa-certificate" style="font-size: 3rem; color: var(--neutral-500); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--neutral-500);">No hay certificados</h3>
                <p style="color: var(--neutral-500);">Completa los cursos para obtener certificados</p>
            </div>
        `;
        return;
    }
    
    // Encontrar nombres de cursos para los certificados
    const certificateCards = certificates.map(cert => {
        const course = courses.find(c => c.id === cert.courseId);
        return {
            ...cert,
            courseTitle: course?.title || 'Curso Desconocido'
        };
    });
    
    container.innerHTML = certificateCards.map(cert => `
        <div class="card">
            <div class="card-header">
                <i class="fas fa-award text-warning" style="font-size: 1.5rem;"></i>
            </div>
            <div class="card-content">
                <h4 class="card-title">${cert.courseTitle}</h4>
                <p class="text-muted">Certificado de Aprobación</p>
                <p class="text-muted" style="font-size: 0.875rem;">
                    Puntuación: ${cert.score}%<br>
                    Emitido: ${authUtils.formatDate(cert.issuedAt)}
                </p>
            </div>
            <div class="card-footer">
                <button class="btn btn-warning" style="width: 100%;" onclick="downloadCertificate('${cert.id}')">
                    <i class="fas fa-download"></i>
                    Descargar
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar sección de actividad
function loadActivitySection() {
    const container = document.getElementById('activity-log');
    if (!container) return;
    
    if (activityLog.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <i class="fas fa-history" style="font-size: 3rem; color: var(--neutral-500); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--neutral-500);">No hay actividad</h3>
                <p style="color: var(--neutral-500);">La actividad aparecerá aquí conforme uses la plataforma</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activityLog.map(activity => `
        <div class="flex-between" style="padding: 1rem; border-bottom: 1px solid var(--neutral-200);">
            <div>
                <h4 style="margin-bottom: 0.25rem;">${getActivityActionText(activity.action)}</h4>
                <p style="color: var(--neutral-500); font-size: 0.875rem;">${activity.details}</p>
            </div>
            <div class="text-muted" style="font-size: 0.75rem;">
                ${authUtils.formatDateTime(activity.timestamp)}
            </div>
        </div>
    `).join('');
}

// Obtener texto de acción de actividad
function getActivityActionText(action) {
    const actionMap = {
        'LOGIN': 'Inicio de sesión',
        'REGISTER': 'Registro de usuario',
        'CREATE_COURSE': 'Curso creado',
        'UPDATE_COURSE': 'Curso actualizado',
        'DELETE_COURSE': 'Curso eliminado',
        'UPLOAD_FILE': 'Archivo subido',
        'CREATE_QUIZ': 'Quiz creado',
        'SUBMIT_QUIZ': 'Quiz enviado',
        'CREATE_EVENT': 'Evento creado'
    };
    return actionMap[action] || action;
}

// Funciones para manejar modales
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Configurar event listeners para modales
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Configurar formularios de modales
    setupModalForms();
});

// Configurar formularios de modales
function setupModalForms() {
    // Formulario de curso
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', handleCourseSubmit);
    }
    
    // Formulario de material
    const materialForm = document.getElementById('materialForm');
    if (materialForm) {
        materialForm.addEventListener('submit', handleMaterialSubmit);
    }
    
    // Formulario de quiz
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', handleQuizSubmit);
    }
    
    // Formulario de evento
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    
    // Botones de modales
    const addCourseBtn = document.getElementById('addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => showModal('courseModal'));
    }
    
    const uploadMaterialBtn = document.getElementById('uploadMaterialBtn');
    if (uploadMaterialBtn) {
        uploadMaterialBtn.addEventListener('click', () => showModal('materialModal'));
    }
    
    const createQuizBtn = document.getElementById('createQuizBtn');
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', () => showModal('quizModal'));
    }
    
    const createEventBtn = document.getElementById('createEventBtn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', () => showModal('eventModal'));
    }
    
    // Configurar carga de archivos
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('materialFile');
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                fileUpload.querySelector('p').textContent = e.target.files[0].name;
            }
        });
        
        // Drag and drop
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
        
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });
        
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileUpload.querySelector('p').textContent = files[0].name;
            }
        });
    }
    
    // Cambiar entre archivo y URL
    const materialType = document.getElementById('materialType');
    if (materialType) {
        materialType.addEventListener('change', function() {
            const fileGroup = document.getElementById('fileUploadGroup');
            const urlGroup = document.getElementById('urlInputGroup');
            
            if (this.value === 'link') {
                fileGroup.style.display = 'none';
                urlGroup.style.display = 'block';
            } else {
                fileGroup.style.display = 'block';
                urlGroup.style.display = 'none';
            }
        });
    }
}

// Manejar envío de formulario de curso
async function handleCourseSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        category: document.getElementById('courseCategory').value,
        duration: document.getElementById('courseDuration').value
    };
    
    try {
        const response = await authUtils.apiRequest('/courses', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        courses.push(response.course);
        closeModal('courseModal');
        authUtils.showMessage('Éxito', 'Curso creado exitosamente', 'success');
        loadCoursesSection();
        document.getElementById('courseForm').reset();
        
    } catch (error) {
        authUtils.showMessage('Error', error.message, 'error');
    }
}

// Manejar envío de formulario de material
async function handleMaterialSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('courseId', document.getElementById('materialCourse').value);
    formData.append('fileType', document.getElementById('materialType').value);
    formData.append('description', document.getElementById('materialDescription').value);
    
    const fileInput = document.getElementById('materialFile');
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    } else {
        const url = document.getElementById('materialUrl').value;
        if (url) {
            formData.append('url', url);
        }
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al subir archivo');
        }
        
        closeModal('materialModal');
        authUtils.showMessage('Éxito', 'Material subido exitosamente', 'success');
        loadMaterialsSection();
        document.getElementById('materialForm').reset();
        
    } catch (error) {
        authUtils.showMessage('Error', error.message, 'error');
    }
}

// Manejar envío de formulario de quiz
async function handleQuizSubmit(e) {
    e.preventDefault();
    
    // Por ahora, crear un quiz simple
    const questions = [
        {
            question: "¿Cuál es la respuesta a la pregunta 1?",
            options: ["Opción A", "Opción B", "Opción C", "Opción D"],
            correct: 0
        }
    ];
    
    const formData = {
        courseId: document.getElementById('quizCourse').value,
        title: document.getElementById('quizTitle').value,
        questions: questions
    };
    
    try {
        const response = await authUtils.apiRequest('/quiz', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        closeModal('quizModal');
        authUtils.showMessage('Éxito', 'Quiz creado exitosamente', 'success');
        loadQuizSection();
        document.getElementById('quizForm').reset();
        
    } catch (error) {
        authUtils.showMessage('Error', error.message, 'error');
    }
}

// Manejar envío de formulario de evento
async function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        type: document.getElementById('eventType').value,
        meetLink: document.getElementById('eventMeetLink').value,
        youtubeLink: document.getElementById('eventYoutubeLink').value
    };
    
    try {
        const response = await authUtils.apiRequest('/events', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        events.push(response.event);
        closeModal('eventModal');
        authUtils.showMessage('Éxito', 'Evento creado exitosamente', 'success');
        if (document.getElementById('calendar-section').style.display !== 'none') {
            loadCalendarSection();
        }
        document.getElementById('eventForm').reset();
        
    } catch (error) {
        authUtils.showMessage('Error', error.message, 'error');
    }
}

// Funciones de acción
function editCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseDuration').value = course.duration;
        showModal('courseModal');
    }
}

async function deleteCourse(courseId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        return;
    }
    
    try {
        await authUtils.apiRequest(`/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        courses = courses.filter(c => c.id !== courseId);
        authUtils.showMessage('Éxito', 'Curso eliminado exitosamente', 'success');
        loadCoursesSection();
        
    } catch (error) {
        authUtils.showMessage('Error', error.message, 'error');
    }
}

function startCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        authUtils.showMessage('Curso', `Iniciando curso: ${course.title}`, 'info');
        // Aquí se implementaría la lógica para iniciar el curso
    }
}

function downloadMaterial(materialId) {
    authUtils.showMessage('Descarga', 'Iniciando descarga del material...', 'info');
}

function deleteMaterial(materialId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este material?')) {
        return;
    }
    
    materials = materials.filter(m => m.id !== materialId);
    authUtils.showMessage('Éxito', 'Material eliminado exitosamente', 'success');
    loadMaterialsSection();
}

function takeQuiz(quizId) {
    authUtils.showMessage('Quiz', 'Iniciando evaluación...', 'info');
    // Aquí se implementaría la lógica para tomar el quiz
}

function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        let message = `${event.title}\n\n`;
        message += `Fecha: ${authUtils.formatDate(event.date)}\n`;
        message += `Hora: ${event.time}\n`;
        message += `Tipo: ${event.type}\n`;
        if (event.description) {
            message += `\nDescripción: ${event.description}`;
        }
        
        authUtils.showMessage('Detalles del Evento', message, 'info');
    }
}

function downloadCertificate(certificateId) {
    const certificate = certificates.find(c => c.id === certificateId);
    if (certificate) {
        authUtils.showMessage('Certificado', 'Generando certificado en PDF...', 'info');
        // Aquí se implementaría la lógica para descargar el certificado
    }
}

function changeMonth(direction) {
    // Lógica para cambiar el mes en el calendario
    generateCalendar();
}

// Agregar pregunta al quiz
function addQuestion() {
    const container = document.getElementById('questions-container');
    const questionIndex = container.children.length;
    
    const questionHTML = `
        <div class="card" style="margin-bottom: 1rem; padding: 1rem;">
            <div class="form-group">
                <label>Pregunta ${questionIndex + 1}</label>
                <input type="text" class="quiz-question" placeholder="Escribe tu pregunta" required>
            </div>
            <div class="form-group">
                <label>Opciones</label>
                <div class="quiz-options">
                    <input type="text" class="quiz-option" placeholder="Opción 1" required>
                    <input type="text" class="quiz-option" placeholder="Opción 2" required>
                    <input type="text" class="quiz-option" placeholder="Opción 3" required>
                    <input type="text" class="quiz-option" placeholder="Opción 4" required>
                </div>
            </div>
            <div class="form-group">
                <label>Respuesta Correcta</label>
                <select class="quiz-correct" required>
                    <option value="">Seleccionar</option>
                    <option value="0">Opción 1</option>
                    <option value="1">Opción 2</option>
                    <option value="2">Opción 3</option>
                    <option value="3">Opción 4</option>
                </select>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHTML);
}