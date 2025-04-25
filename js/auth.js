document.addEventListener('DOMContentLoaded', function() {
    // Manejar formulario de login
    document.getElementById('loginUserForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if(email && password) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '../dashboard.html';
        }
    });

    // Manejo del formulario de registro
    document.getElementById('registerUserForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('registerConfirmPassword')?.value;

        // Validacion de que coincidan las contras
        if(password !== confirmPassword) {
            document.getElementById('registerConfirmPassword')?.classList.add('is-invalid');
            return;
        } else {
            document.getElementById('registerConfirmPassword')?.classList.remove('is-invalid');
        }

        if(form.checkValidity()) {
            const user = {
                firstName: document.getElementById('registerFirstName')?.value || '',
                lastName: document.getElementById('registerLastName')?.value || '',
                idType: document.getElementById('registerIdType')?.value || '',
                idNumber: document.getElementById('registerIdNumber')?.value || '',
                email: document.getElementById('registerEmail')?.value || '',
                phone: document.getElementById('registerPhone')?.value || '',
                password: password,
                createdAt: new Date().toISOString()
            };

            // Validar campos requeridos
            if(!user.email || !user.password || !user.firstName) {
                form.classList.add('was-validated');
                return;
            }

            const users = JSON.parse(localStorage.getItem('bankUsers') || []);
            users.push(user);
            localStorage.setItem('bankUsers', JSON.stringify(users));
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                name: `${user.firstName} ${user.lastName}`
            }));
            
            window.location.href = '../dashboard.html';
        } else {
            form.classList.add('was-validated');
        }
    });

    // Visibilidad de la contra
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

    // Validacio confirmacion de contraseña
    document.getElementById('registerConfirmPassword')?.addEventListener('input', function() {
        const password = document.getElementById('registerPassword')?.value;
        if (this.value !== password) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
});