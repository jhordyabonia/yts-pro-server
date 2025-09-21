class TokenDashboardApp extends DashboardApp {
    constructor() {
        super('tokens');
    }

    setupEventListeners() {
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            const sidebar = document.querySelector('aside');
            sidebar.classList.toggle('hidden');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                //e.preventDefault();
                //this.showSection(e.target.closest('a').dataset.section);
            });
        });

        document.getElementById('new-token').addEventListener('click', () => {
            document.getElementById('token-id').value = '';
            this.showTokenModal();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeTokenModal();
        });

        document.getElementById('token-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveToken();
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
            this.tokens = data.data;
            this.renderTokensTable();
        } catch (error) {
            console.error('Error loading tokens:', error);
        }
    }

    renderTokensTable() {
        const tbody = document.getElementById('tokens-table-body');
        tbody.innerHTML = this.tokens.map(token => `
            <tr class="border-t border-gray-700">
                <td class="p-4">${token._id}</td>
                <td class="p-4">${token.api_key}</td>
                <td class="p-4">${token.used ? 'Usado' : 'Disponible'}</td>
                <td class="p-4">${new Date(token.created_date).toLocaleDateString()}</td>
                <td class="p-4">
                    <button onclick="app.editToken('${token._id}')" 
                            class="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded mr-2">
                        Editar
                    </button>
                    <button onclick="app.deleteToken('${token._id}')"
                            class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showTokenModal(token = null) {
        const modal = document.getElementById('token-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        if (token) {
            document.getElementById('token-id').value = token._id || '';
            document.getElementById('token-api-key').value = token.api_key || '';
            document.getElementById('token-used').checked = token.used || false;
        }
    }

    closeTokenModal() {
        const modal = document.getElementById('token-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('token-form').reset();
    }

    async deleteToken(id) {
        if (!confirm('¿Estás seguro de eliminar este token?')) return;

        try {
            await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                }
            });
            await this.load();
        } catch (error) {
            console.error('Error deleting token:', error);
        }
    }

    editToken(id) {
        const token = this.tokens.find(t => t._id === id);
        if (token) {
            this.showTokenModal(token);
        }
    }

    async saveToken() {
        const id = document.getElementById('token-id').value;
        const api_key = document.getElementById('token-api-key').value;
        const used = document.getElementById('token-used').checked;

        const tokenData = { api_key, used };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${this.apiUrl}/${id}` : this.apiUrl;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                },
                body: JSON.stringify(tokenData)
            });
            this.closeTokenModal();
            await this.load();
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }
}

// Initialize app
const app = new TokenDashboardApp();