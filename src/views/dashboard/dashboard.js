class DashboardApp {
    constructor(uri) {
        this.apiUrl = `http://localhost:3000/v1/${uri}`;
        this.contracts = [];
        this.token = 'eyJhbGciOiJIUzI1NiJ9.e30.2xb_5Hx5tGCMCnnvcjMTIjeb8Mzau9kAvrI4vPESx3I'//localStorage.getItem('token'); 
        this.init();
    }

    async init() {       
        this.setupEventListeners();
        await this.load();
        this.setupCharts();
    }

    setupEventListeners() {}

    async load() {}

    setupCharts() {}
   
}
