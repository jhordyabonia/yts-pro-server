class PartnerSettingsApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/v1/partners';
        this.token = localStorage.getItem('partner_token');
        this.partnerData = JSON.parse(localStorage.getItem('partner_data') || '{}');
        
        if (!this.token) {
            //window.location.href = '../login/';
            //return;
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPartnerData();
    }

    setupEventListeners() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('partner_token');
            localStorage.removeItem('partner_data');
            window.location.href = '../login/';
        });

        document.getElementById('settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    loadPartnerData() {
        document.getElementById('channel-id').value = this.partnerData.channel_id || '';
        document.getElementById('email').value = this.partnerData.email || '';
    }

    async saveSettings() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const channelId = document.getElementById('channel-id').value;
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');

        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        if (newPassword && newPassword !== confirmPassword) {
            errorMessage.textContent = 'Las contraseñas no coinciden';
            errorMessage.classList.remove('hidden');
            return;
        }

        const updateData = {
            channel_id: channelId
        };

        if (newPassword) {
            updateData.password = newPassword;
        }

        try {
            const response = await fetch(`${this.apiUrl}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                successMessage.textContent = 'Configuración actualizada correctamente';
                successMessage.classList.remove('hidden');
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-password').value = '';
            } else {
                errorMessage.textContent = 'Error al actualizar la configuración';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.textContent = 'Error de conexión';
            errorMessage.classList.remove('hidden');
        }
    }
}

const app = new PartnerSettingsApp();