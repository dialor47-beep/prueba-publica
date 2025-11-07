// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Utilidades para mostrar mensajes
function showMessage(title, message, type = 'info', callback = null) {
    const modal = document.getElementById('messageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalButton = document.getElementById('modalButton');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Configurar botón según el tipo
    modalButton.className = 'btn btn-primary';
    if (type === 'success') {
        modalButton.style.background = 'var(--success)';
    } else if (type === 'error') {
        modalButton.style.background = 'var(--error)';
    } else if (type === 'warning') {
        modalButton.style.background = 'var(--warning)';
    }
    
    modal.style.display = 'block';
    
    // Manejar cierre del modal
    const closeModal = () => {
        modal.style.display = 'none';
        modalButton.removeEventListener('click', closeModal);
        document.querySelector('.close').removeEventListener('click', closeModal);
        if (callback) callback();
    };
    
    modalButton.addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Cerrar con ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Función para hacer peticiones a la API
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en la solicitud');
        }
        
        return data;
    } catch (error) {
        console.error('Error en la API:', error);
        throw error;
    }
}

// Función para mostrar/ocultar formularios
function showForm(formId) {
    // Ocultar todos los formularios
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Mostrar el formulario solicitado
    document.getElementById(formId).classList.add('active');
}

// Validación de formularios
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name && formData.name !== undefined) {
        errors.push('El nombre es obligatorio');
    }
    
    if (!formData.email && formData.email !== undefined) {
        errors.push('El email es obligatorio');
    } else if (formData.email && !isValidEmail(formData.email)) {
        errors.push('El email no es válido');
    }
    
    if (!formData.username) {
        errors.push('El usuario es obligatorio');
    }
    
    if (!formData.password) {
        errors.push('La contraseña es obligatoria');
    } else if (formData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.push('Las contraseñas no coinciden');
    }
    
    return errors;
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar errores en el formulario
function showFormErrors(form, errors) {
    // Limpiar errores anteriores
    const existingErrors = form.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Mostrar nuevos errores
    if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: var(--error);
            font-size: 0.875rem;
            margin-top: var(--space-xs);
            padding: var(--space-sm);
            background: rgba(220, 53, 69, 0.1);
            border-radius: var(--border-radius-sm);
            border: 1px solid rgba(220, 53, 69, 0.2);
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${errors.join('<br>')}
        `;
        form.appendChild(errorDiv);
        
        // Marcar campos con error
        if (errors.some(e => e.includes('nombre'))) {
            document.getElementById('registerName').classList.add('error');
        }
        if (errors.some(e => e.includes('email'))) {
            document.getElementById('registerEmail').classList.add('error');
        }
        if (errors.some(e => e.includes('usuario'))) {
            const usernameField = document.getElementById(form.id === 'loginForm' ? 'loginUsername' : 'registerUsername');
            usernameField.classList.add('error');
        }
        if (errors.some(e => e.includes('contraseña'))) {
            const passwordField = document.getElementById(form.id === 'loginForm' ? 'loginPassword' : 'registerPassword');
            passwordField.classList.add('error');
        }
        if (errors.some(e => e.includes('coinciden'))) {
            document.getElementById('registerConfirmPassword').classList.add('error');
        }
    }
}

// Limpiar errores del formulario
function clearFormErrors(form) {
    const errorMessage = form.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Limpiar estilos de error en inputs
    form.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
    });
}

// Manejo del inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Toggle entre formularios
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        showForm('registerForm');
        clearFormErrors(loginForm);
    });
    
    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        showForm('loginForm');
        clearFormErrors(registerForm);
    });
    
    // Manejo del formulario de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('loginUsername').value.trim(),
            password: document.getElementById('loginPassword').value
        };
        
        clearFormErrors(this);
        
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showFormErrors(this, errors);
            return;
        }
        
        // Mostrar loading
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<div class="loading"></div> Procesando...';
        submitButton.disabled = true;
        
        try {
            const response = await apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            // Guardar token y datos del usuario
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            showMessage('¡Bienvenido!', 'Inicio de sesión exitoso. Redirigiendo...', 'success', () => {
                window.location.href = 'dashboard.html';
            });
            
        } catch (error) {
            showMessage('Error de inicio de sesión', error.message, 'error');
        } finally {
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Manejo del formulario de registro
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('registerName').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            username: document.getElementById('registerUsername').value.trim(),
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('registerConfirmPassword').value
        };
        
        clearFormErrors(this);
        
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showFormErrors(this, errors);
            return;
        }
        
        // Mostrar loading
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<div class="loading"></div> Creando cuenta...';
        submitButton.disabled = true;
        
        try {
            const response = await apiRequest('/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            // Guardar token y datos del usuario
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            showMessage('¡Cuenta creada!', 'Registro exitoso. Redirigiendo al dashboard...', 'success', () => {
                window.location.href = 'dashboard.html';
            });
            
        } catch (error) {
            showMessage('Error de registro', error.message, 'error');
        } finally {
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
});

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

// Verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData;
    } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
        return null;
    }
}

// Función para actualizar datos del usuario en la UI
function updateUserUI() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    
    // Actualizar nombre en el header
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = userData.name;
    });
    
    // Actualizar avatar
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    userAvatarElements.forEach(element => {
        const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
        element.textContent = initials;
    });
    
    // Actualizar datos de usuario en formularios
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    if (nameInput) nameInput.value = userData.name;
    if (emailInput) emailInput.value = userData.email;
}

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para formatear fecha y hora
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Exportar funciones para uso global
window.authUtils = {
    showMessage,
    apiRequest,
    showForm,
    validateForm,
    clearFormErrors,
    logout,
    checkAuth,
    updateUserUI,
    formatDate,
    formatDateTime,
    formatFileSize
};