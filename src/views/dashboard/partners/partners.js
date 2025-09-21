class PartnerDashboardApp extends DashboardApp {
    constructor() {
        super('partners');
    }

    setupEventListeners() {
        // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            const sidebar = document.querySelector('aside');
            sidebar.classList.toggle('hidden');
        });

        // Navigation
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                //e.preventDefault();
                //this.showSection(e.target.closest('a').dataset.section);
            });
        });

        // New partner button
        document.getElementById('new-partner').addEventListener('click', () => {
            document.getElementById('partner-id').value = '';
            this.showPartnerModal();
        });

        // Close modal button
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closePartnerModal();
        });

        // Form submission
        document.getElementById('partner-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePartner();
        });
    }

    async load() {
        try {
            const response = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                }
            });
            const data = await response.json();
            this.partners = data.data;
            this.renderPartnersTable();
        } catch (error) {
            console.error('Error loading partners:', error);
        }
    }

    renderPartnersTable() {
        const tbody = document.getElementById('partners-table-body');
        tbody.innerHTML = this.partners.map(partner => `
            <tr class="border-t border-gray-700">
                <td class="p-4">${partner._id}</td>
                <td class="p-4">${partner.nombre}</td>
                <td class="p-4">${partner.email}</td>
                <td class="p-4">${partner.channel_id}</td>
                <td class="p-4">${partner.code}</td>
                <td class="p-4">
                    <button onclick="app.editPartner('${partner._id}')" 
                            class="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded mr-2">
                        Editar
                    </button>
                    <button onclick="app.deletePartner('${partner._id}')"
                            class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showPartnerModal(partner = null) {
        const modal = document.getElementById('partner-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        if (partner) {
            document.getElementById('partner-id').value = partner._id || '';
            document.getElementById('partner-nombre').value = partner.nombre || '';
            document.getElementById('partner-email').value = partner.email || '';
            document.getElementById('partner-channel').value = partner.channel_id || '';
        }
    }

    closePartnerModal() {
        const modal = document.getElementById('partner-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('partner-form').reset();
    }

    async deletePartner(id) {
        if (!confirm('¿Estás seguro de eliminar este partner?')) return;

        try {
            await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                }
            });
            await this.load();
        } catch (error) {
            console.error('Error deleting partner:', error);
        }
    }

    editPartner(id) {
        const partner = this.partners.find(p => p._id === id);
        if (partner) {
            this.showPartnerModal(partner);
        }
    }

    async savePartner() {
        const id = document.getElementById('partner-id').value;
        const nombre = document.getElementById('partner-nombre').value;
        const email = document.getElementById('partner-email').value;
        const channel_id = document.getElementById('partner-channel').value;

        const partnerData = { nombre, email, channel_id };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${this.apiUrl}/${id}` : this.apiUrl;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                },
                body: JSON.stringify(partnerData)
            });
            this.closePartnerModal();
            await this.load();
        } catch (error) {
            console.error('Error saving partner:', error);
        }
    }
}

// Initialize app
const app = new PartnerDashboardApp();