class HomeApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/v1/user/contracts';
        this.token = localStorage.getItem('token');
        if (!this.token) {
            //window.location.href = '../login/';
            //return;
        }
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadUserData();
    }

    setupEventListeners() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../login/';
        });
    }

    async loadUserData() {
        try {
            const response = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderContract(data.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    renderContract(contract) {
        const contractInfo = document.getElementById('contract-info');
        contractInfo.innerHTML = `
            <div class="space-y-2">
                <p><span class="font-medium">Usuario:</span> ${contract.user}</p>
                <p><span class="font-medium">Clave:</span> ${contract.key}</p>
                <p><span class="font-medium">Fecha de Pago:</span> 
                   ${new Date(contract.pay_date).toLocaleDateString()}</p>
                <p><span class="font-medium">Estado:</span> ${contract.status}</p>
            </div>
        `;
    }
}

const app = new HomeApp();