class PartnerHomeApp {
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

    async init() {
        this.setupEventListeners();
        await Promise.all([
            this.loadPartnerData(),
            this.loadReferrals()
        ]);
    }

    setupEventListeners() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('partner_token');
            localStorage.removeItem('partner_data');
            window.location.href = '../login/';
        });

        document.getElementById('copy-link').addEventListener('click', () => {
            const link = document.getElementById('referral-link');
            navigator.clipboard.writeText(link.value);
            alert('Link copiado al portapapeles');
        });
    }

    async loadPartnerData() {
        try {
            const response = await fetch(`${this.apiUrl}/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderPartnerInfo(data.data);
            }
        } catch (error) {
            console.error('Error loading partner data:', error);
        }
    }

    async loadReferrals() {
        try {
            const response = await fetch(`${this.apiUrl}/referrals`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderReferrals(data.data);
            }
        } catch (error) {
            console.error('Error loading referrals:', error);
        }
    }

    renderPartnerInfo(partner) {
        document.getElementById('partner-name').textContent = partner.nombre;
        const partnerInfo = document.getElementById('partner-info');
        partnerInfo.innerHTML = `
            <div class="space-y-4">
                <div class="space-y-2">
                    <p><span class="font-medium">Nombre:</span> ${partner.nombre}</p>
                    <p><span class="font-medium">Email:</span> ${partner.email}</p>
                    <p><span class="font-medium">Canal:</span> ${partner.channel_id}</p>
                    <p><span class="font-medium">Código:</span> ${partner.code}</p>
                </div>
                <div class="mt-4">
                    <p class="font-medium mb-2">Tu Link de Referido:</p>
                    <div class="flex gap-2">
                        <input type="text" id="referral-link"
                               value="https://yts-pro.com/register?ref=${partner.code}"
                               class="flex-1 bg-gray-700 rounded p-2" readonly>
                        <button id="copy-link"
                                class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderReferrals(referrals) {
        const referralsList = document.getElementById('referrals-list');
        const activeCount = referrals.filter(r => r.status === 'active').length;
        
        document.getElementById('total-refs').textContent = referrals.length;
        document.getElementById('active-refs').textContent = activeCount;

        referralsList.innerHTML = referrals.map(ref => `
            <tr class="border-t border-gray-700">
                <td class="py-3 px-4">${ref.user}</td>
                <td class="py-3 px-4">${new Date(ref.created_date).toLocaleDateString()}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded ${
                        ref.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                    }">
                        ${ref.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }
}

const app = new PartnerHomeApp();