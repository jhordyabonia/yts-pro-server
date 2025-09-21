class SettingsApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/v1/user/settings';
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
        
        if (!this.token || !this.user) {
           // window.location.href = '../login/';
           // return;
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../login/';
        });

        document.getElementById('settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    loadUserData() {
        document.getElementById('email').value = this.user.email;
    }

    async saveSettings() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');

        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        if (newPassword !== confirmPassword) {
            errorMessage.textContent = 'Las contraseñas no coinciden';
            errorMessage.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (response.ok) {
                successMessage.textContent = 'Contraseña actualizada correctamente';
                successMessage.classList.remove('hidden');
                document.getElementById('settings-form').reset();
            } else {
                errorMessage.textContent = 'Error al actualizar la contraseña';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.textContent = 'Error de conexión';
            errorMessage.classList.remove('hidden');
        }
    }
}

const app = new SettingsApp();