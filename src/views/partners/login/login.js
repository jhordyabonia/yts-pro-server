class PartnerLoginApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/v1/partners/auth';
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    async handleLogin() {
        const code = document.getElementById('code').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('partner_token', data.token);
                localStorage.setItem('partner_data', JSON.stringify(data.partner));
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

const app = new PartnerLoginApp();