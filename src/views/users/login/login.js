class LoginApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/v1/user/auth';
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '../home/';
            } else {
                errorMessage.textContent = 'Credenciales inválidas';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.textContent = 'Error de conexión';
            errorMessage.classList.remove('hidden');
        }
    }
}

const app = new LoginApp();