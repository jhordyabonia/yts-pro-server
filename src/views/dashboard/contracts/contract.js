class ContractDashboardApp extends DashboardApp {
    constructor() {
        super('contracts');
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
                e.preventDefault();
                this.showSection(e.target.closest('a').dataset.section);
            });
        });

        // New contract button
        document.getElementById('new-contract').addEventListener('click', () => {
            document.getElementById('contract-id').value = '';
            this.showContractModal();
        });

        // Close modal button
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeContractModal();
        });
        // Form submission
        document.getElementById('contract-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContract();
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
            this.contracts = data.data;
            this.renderContractsTable();
        } catch (error) {
            console.error('Error loading contracts:', error);
        }
    }

    renderContractsTable() {
        const tbody = document.getElementById('contracts-table-body');
        tbody.innerHTML = this.contracts.map(contract => `
            <tr class="border-t border-gray-700">
                <td class="p-4">${contract._id}</td>
                <td class="p-4">${contract.user}</td>
                <td class="p-4">${contract.pay_date?new Date(contract.pay_date).toLocaleDateString():'--/--/--'}</td>
                <td class="p-4">${contract.key}</td>
                <td class="p-4">${contract.status}</td>
                <td class="p-4">
                    <button onclick="app.editContract('${contract._id}')" 
                            class="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded mr-2">
                        Editar
                    </button>
                    <button onclick="app.deleteContract('${contract._id}')"
                            class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    setupCharts() {
        // Gráfico de estados
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['Activo', 'Inactivo', 'Pendiente'],
                datasets: [{
                    data: [12, 19, 3],
                    backgroundColor: ['#10B981', '#EF4444', '#F59E0B']
                }]
            }
        });

        // Gráfico mensual
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Contratos por mes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: '#6366F1'
                }]
            }
        });
    }

    showSection(sectionId) {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`${sectionId}-section`).classList.remove('hidden');
    }

    async deleteContract(id) {
        if (!confirm('¿Estás seguro de eliminar este contrato?')) return;

        try {
            await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                }
            });
            await this.load();
        } catch (error) {
            console.error('Error deleting contract:', error);
        }
    }

    showContractModal(contract = null) {
        const modal = document.getElementById('contract-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Populate form if editing
        if (contract) {
            document.getElementById('contract-id').value = contract._id || '';
            document.getElementById('contract-user').value = contract.user || '';
            document.getElementById('contract-pay-date').value = contract.pay_date ? new Date(contract.pay_date).toISOString().slice(0, 10) : '';
            document.getElementById('contract-key').value = contract.key || '';
            document.getElementById('contract-status').value = contract.status || '';
        }
    }
    editContract(id) {
        const contract = this.contracts.find(c => c._id === id);
        if (contract) {
            this.showContractModal(contract);
        }
    }   
    closeContractModal() {
        const modal = document.getElementById('contract-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('contract-form').reset();
    }

    async saveContract() {
        const id = document.getElementById('contract-id').value;
        const user = document.getElementById('contract-user').value;
        const pay_date = document.getElementById('contract-pay-date').value;
        const key = document.getElementById('contract-key').value;
        const status = document.getElementById('contract-status').value;

        const contractData = { user, pay_date, key, status };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${this.apiUrl}/${id}` : this.apiUrl;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                },
                body: JSON.stringify(contractData)
            });
            this.closeContractModal();
            await this.load();
        } catch (error) {
            console.error('Error saving contract:', error);
        }
    }
}

// Initialize app
const app = new ContractDashboardApp();