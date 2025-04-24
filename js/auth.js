// Manejo del formulario de login
document.getElementById('loginUserForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validación básica
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if(email && password) {
        // Guardar en localStorage (simulación)
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirigir al dashboard
        window.location.href = '../dashboard.html';
    }
});

// Manejo del formulario de registro
document.getElementById('registerUserForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    
    // Validar contraseñas coincidan
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        document.getElementById('registerConfirmPassword').classList.add('is-invalid');
        return;
    } else {
        document.getElementById('registerConfirmPassword').classList.remove('is-invalid');
    }
    
    // Verificar si el formulario es válido
    if (form.checkValidity()) {
        // Crear objeto usuario
        const user = {
            firstName: document.getElementById('registerFirstName').value,
            lastName: document.getElementById('registerLastName').value,
            idType: document.getElementById('registerIdType').value,
            idNumber: document.getElementById('registerIdNumber').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            password: password, // En una app real, esto debería estar hasheado
            createdAt: new Date().toISOString()
        };
        
        // Guardar usuario en localStorage (simulación de base de datos)
        let users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
        users.push(user);
        localStorage.setItem('bankUsers', JSON.stringify(users));
        
        // Guardar estado de login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        }));
        
        // Redirigir al dashboard
        window.location.href = '../dashboard.html';
    } else {
        e.stopPropagation();
        form.classList.add('was-validated');
    }
});

// Toggle para mostrar/ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentNode.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// Validación en tiempo real de confirmación de contraseña
document.getElementById('registerConfirmPassword')?.addEventListener('input', function() {
    const password = document.getElementById('registerPassword').value;
    if (this.value !== password) {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
});