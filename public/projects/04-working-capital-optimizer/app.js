/**
 * Working Capital Optimizer Application Controller
 */

const WCApp = {
    currentScenario: {
        dso: 45,
        dio: 60,
        dpo: 30
    },
    
    init() {
        this.setupSliders();
        this.calculateMetrics();
        this.updateDisplay();
        this.generateRecommendations();
        console.log('Working Capital Optimizer initialized');
    },
    
    setupSliders() {
        const dsoSlider = document.getElementById('dsoSlider');
        const dioSlider = document.getElementById('dioSlider');
        const dpoSlider = document.getElementById('dpoSlider');
        
        if (dsoSlider) {
            dsoSlider.addEventListener('input', (e) => {
                this.currentScenario.dso = parseInt(e.target.value);
                document.getElementById('dsoValue').textContent = e.target.value;
                this.calculateMetrics();
                this.updateDisplay();
            });
        }
        
        if (dioSlider) {
            dioSlider.addEventListener('input', (e) => {
                this.currentScenario.dio = parseInt(e.target.value);
                document.getElementById('dioValue').textContent = e.target.value;
                this.calculateMetrics();
                this.updateDisplay();
            });
        }
        
        if (dpoSlider) {
            dpoSlider.addEventListener('input', (e) => {
                this.currentScenario.dpo = parseInt(e.target.value);
                document.getElementById('dpoValue').textContent = e.target.value;
                this.calculateMetrics();
                this.updateDisplay();
            });
        }
    },
    
    calculateMetrics() {
        const data = workingCapitalData.current;
        
        // Calculate current CCC
        const currentCCC = data.dso + data.dio - data.dpo;
        
        // Calculate optimized CCC
        const optimizedCCC = this.currentScenario.dso + this.currentScenario.dio - this.currentScenario.dpo;
        
        // Calculate cash impacts
        const dailyRevenue = data.revenue / 365;
        const dailyCOGS = data.cogs / 365;
        
        const dsoCashImpact = (data.dso - this.currentScenario.dso) * dailyRevenue;
        const dioCashImpact = (data.dio - this.currentScenario.dio) * dailyCOGS;
        const dpoCashImpact = (this.currentScenario.dpo - data.dpo) * dailyCOGS;
        
        const totalCashImpact = dsoCashImpact + dioCashImpact + dpoCashImpact;
        
        this.metrics = {
            currentCCC,
            optimizedCCC,
            cccImprovement: currentCCC - optimizedCCC,
            dsoCashImpact,
            dioCashImpact,
            dpoCashImpact,
            totalCashImpact
        };
    },
    
    updateDisplay() {
        // Update CCC metrics
        document.getElementById('currentCCC').textContent = `${this.metrics.currentCCC} days`;
        document.getElementById('optimizedCCC').textContent = `${this.metrics.optimizedCCC} days`;
        document.getElementById('cccImprovement').textContent = `${this.metrics.cccImprovement} days`;
        
        // Update cash impacts
        document.getElementById('dsoCashImpact').textContent = this.formatCurrency(this.metrics.dsoCashImpact);
        document.getElementById('dioCashImpact').textContent = this.formatCurrency(this.metrics.dioCashImpact);
        document.getElementById('dpoCashImpact').textContent = this.formatCurrency(this.metrics.dpoCashImpact);
        document.getElementById('cashRelease').textContent = this.formatCurrency(this.metrics.totalCashImpact);
        
        // Update color coding
        this.updateColorCoding();
    },
    
    updateColorCoding() {
        const elements = [
            { id: 'dsoCashImpact', value: this.metrics.dsoCashImpact },
            { id: 'dioCashImpact', value: this.metrics.dioCashImpact },
            { id: 'dpoCashImpact', value: this.metrics.dpoCashImpact },
            { id: 'cashRelease', value: this.metrics.totalCashImpact }
        ];
        
        elements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.className = value >= 0 ? 'font-semibold text-emerald-400' : 'font-semibold text-red-400';
            }
        });
    },
    
    generateRecommendations() {
        const recommendations = document.getElementById('recommendations');
        if (!recommendations) return;
        
        recommendations.innerHTML = '';
        
        const recs = [
            {
                title: 'Accelerate Collections',
                description: 'Implement automated invoicing and follow-up processes',
                impact: this.metrics.dsoCashImpact > 0 ? 'High' : 'Medium'
            },
            {
                title: 'Optimize Inventory',
                description: 'Implement just-in-time inventory management',
                impact: this.metrics.dioCashImpact > 0 ? 'High' : 'Medium'
            },
            {
                title: 'Extend Payment Terms',
                description: 'Negotiate longer payment terms with suppliers',
                impact: this.metrics.dpoCashImpact > 0 ? 'High' : 'Low'
            }
        ];
        
        recs.forEach(rec => {
            const div = document.createElement('div');
            div.className = 'optimization-item p-3 border border-gray-600 rounded-lg';
            div.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-gray-200">${rec.title}</h4>
                        <p class="text-sm text-gray-400 mt-1">${rec.description}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded ${rec.impact === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}">
                        ${rec.impact}
                    </span>
                </div>
            `;
            recommendations.appendChild(div);
        });
    },
    
    resetScenario() {
        const data = workingCapitalData.current;
        this.currentScenario = {
            dso: data.dso,
            dio: data.dio,
            dpo: data.dpo
        };
        
        // Reset sliders
        document.getElementById('dsoSlider').value = data.dso;
        document.getElementById('dioSlider').value = data.dio;
        document.getElementById('dpoSlider').value = data.dpo;
        
        document.getElementById('dsoValue').textContent = data.dso;
        document.getElementById('dioValue').textContent = data.dio;
        document.getElementById('dpoValue').textContent = data.dpo;
        
        this.calculateMetrics();
        this.updateDisplay();
        this.generateRecommendations();
    },
    
    formatCurrency(value) {
        if (Math.abs(value) < 1000) return `$${value.toFixed(0)}`;
        if (Math.abs(value) < 1000000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${(value / 1000000).toFixed(1)}M`;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    WCApp.init();
});
