/**
 * Budget Variance Analysis Application Controller
 */

const BVApp = {
    currentView: 'summary',
    currentThreshold: 10,
    currentPeriod: 'quarter',
    currentDepartment: 'all',
    
    init() {
        this.calculateVariances();
        this.updateSummaryCards();
        this.renderVarianceTable();
        this.generateAlerts();
        this.generateActions();
        this.updateCharts();
        this.setupEventListeners();
        console.log('Budget Variance Analysis initialized');
    },
    
    setupEventListeners() {
        const periodSelect = document.getElementById('periodSelect');
        const departmentSelect = document.getElementById('departmentSelect');
        const thresholdSelect = document.getElementById('thresholdSelect');
        
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                this.currentPeriod = e.target.value;
                this.refresh();
            });
        }
        
        if (departmentSelect) {
            departmentSelect.addEventListener('change', (e) => {
                this.currentDepartment = e.target.value;
                this.refresh();
            });
        }
        
        if (thresholdSelect) {
            thresholdSelect.addEventListener('change', (e) => {
                this.currentThreshold = parseInt(e.target.value);
                this.generateAlerts();
            });
        }
    },
    
    calculateVariances() {
        this.variances = {};
        
        Object.entries(budgetData.categories).forEach(([key, category]) => {
            const variance = category.actual - category.budget;
            const variancePercent = (variance / category.budget) * 100;
            
            this.variances[key] = {
                name: category.name,
                budget: category.budget,
                actual: category.actual,
                variance: variance,
                variancePercent: variancePercent,
                status: this.getVarianceStatus(variancePercent, key),
                subcategories: {}
            };
            
            // Calculate subcategory variances
            if (category.subcategories) {
                Object.entries(category.subcategories).forEach(([subKey, subCategory]) => {
                    const subVariance = subCategory.actual - subCategory.budget;
                    const subVariancePercent = (subVariance / subCategory.budget) * 100;
                    
                    this.variances[key].subcategories[subKey] = {
                        name: subCategory.name,
                        budget: subCategory.budget,
                        actual: subCategory.actual,
                        variance: subVariance,
                        variancePercent: subVariancePercent,
                        status: this.getVarianceStatus(subVariancePercent, key)
                    };
                });
            }
        });
    },
    
    getVarianceStatus(variancePercent, category) {
        const threshold = this.currentThreshold;
        
        // Revenue variances: positive is good, negative is bad
        if (category === 'revenue') {
            if (variancePercent >= threshold) return 'favorable';
            if (variancePercent <= -threshold) return 'unfavorable';
            return 'on-track';
        }
        
        // Expense variances: negative is good (under budget), positive is bad (over budget)
        if (variancePercent <= -threshold) return 'favorable';
        if (variancePercent >= threshold) return 'unfavorable';
        return 'on-track';
    },
    
    updateSummaryCards() {
        let totalBudget = 0;
        let totalActual = 0;
        
        Object.values(this.variances).forEach(variance => {
            totalBudget += variance.budget;
            totalActual += variance.actual;
        });
        
        const totalVariance = totalActual - totalBudget;
        const totalVariancePercent = (totalVariance / totalBudget) * 100;
        
        document.getElementById('totalBudget').textContent = this.formatCurrency(totalBudget);
        document.getElementById('totalActual').textContent = this.formatCurrency(totalActual);
        document.getElementById('totalVariance').textContent = this.formatCurrency(totalVariance, true);
        document.getElementById('totalVariancePercent').textContent = `${totalVariancePercent.toFixed(1)}%`;
        
        // Color coding
        const varianceElement = document.getElementById('totalVariance');
        const percentElement = document.getElementById('totalVariancePercent');
        
        const colorClass = totalVariance >= 0 ? 'text-emerald-400' : 'text-red-400';
        varianceElement.className = `text-xl font-bold ${colorClass}`;
        percentElement.className = `text-xl font-bold ${colorClass}`;
        
        // YTD Performance
        const ytdPerformance = document.getElementById('ytdPerformance');
        if (ytdPerformance) {
            ytdPerformance.textContent = `${totalVariancePercent >= 0 ? '+' : ''}${totalVariancePercent.toFixed(1)}%`;
            ytdPerformance.className = `text-2xl font-bold ${colorClass}`;
        }
    },
    
    renderVarianceTable() {
        const tbody = document.getElementById('varianceTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        Object.entries(this.variances).forEach(([key, variance]) => {
            const row = document.createElement('tr');
            row.className = 'drill-down hover:bg-slate-800/50';
            
            const statusIcon = this.getStatusIcon(variance.status);
            const statusClass = this.getStatusClass(variance.status);
            
            row.innerHTML = `
                <td class="py-3 px-2 font-medium">${variance.name}</td>
                <td class="py-3 px-2 text-right">${this.formatCurrency(variance.budget)}</td>
                <td class="py-3 px-2 text-right">${this.formatCurrency(variance.actual)}</td>
                <td class="py-3 px-2 text-right ${variance.variance >= 0 ? 'favorable' : 'unfavorable'}">
                    ${this.formatCurrency(variance.variance, true)}
                </td>
                <td class="py-3 px-2 text-right ${variance.variance >= 0 ? 'favorable' : 'unfavorable'}">
                    ${variance.variancePercent.toFixed(1)}%
                </td>
                <td class="py-3 px-2 text-center">
                    <span class="${statusClass}">${statusIcon}</span>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    },
    
    generateAlerts() {
        const alertsContainer = document.getElementById('thresholdAlerts');
        if (!alertsContainer) return;
        
        alertsContainer.innerHTML = '';
        
        const alerts = [];
        
        Object.entries(this.variances).forEach(([key, variance]) => {
            if (variance.status === 'unfavorable') {
                alerts.push({
                    category: variance.name,
                    variance: variance.variancePercent,
                    severity: Math.abs(variance.variancePercent) > 20 ? 'critical' : 'warning'
                });
            }
        });
        
        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="text-sm text-gray-400">No threshold alerts</div>';
            return;
        }
        
        alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `p-3 rounded-lg border ${alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`;
            
            div.innerHTML = `
                <div class="flex items-start gap-2">
                    <span class="text-lg">${alert.severity === 'critical' ? '🚨' : '⚠️'}</span>
                    <div>
                        <div class="font-semibold text-sm ${alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}">
                            ${alert.category}
                        </div>
                        <div class="text-xs text-gray-400">
                            ${Math.abs(alert.variance).toFixed(1)}% over threshold
                        </div>
                    </div>
                </div>
            `;
            
            alertsContainer.appendChild(div);
        });
    },
    
    generateActions() {
        const actionsContainer = document.getElementById('requiredActions');
        if (!actionsContainer) return;
        
        const actions = [
            { title: 'Review Sales & Marketing Spend', priority: 'High', category: 'sales' },
            { title: 'Optimize COGS Structure', priority: 'Medium', category: 'cogs' },
            { title: 'Accelerate Revenue Recognition', priority: 'High', category: 'revenue' }
        ];
        
        actionsContainer.innerHTML = '';
        
        actions.forEach(action => {
            const div = document.createElement('div');
            div.className = 'p-3 border border-gray-600 rounded-lg';
            
            div.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-semibold text-sm text-gray-200">${action.title}</div>
                        <div class="text-xs text-gray-400 mt-1">Category: ${action.category}</div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded ${action.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">
                        ${action.priority}
                    </span>
                </div>
            `;
            
            actionsContainer.appendChild(div);
        });
    },
    
    setView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('bg-slate-700', 'text-gray-300');
        });
        
        const activeBtn = document.querySelector(`button[onclick="BVApp.setView('${view}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-700', 'text-gray-300');
            activeBtn.classList.add('bg-indigo-600', 'text-white');
        }
        
        // Implement view switching logic
        console.log(`Switched to ${view} view`);
    },
    
    updateCharts() {
        // Implementation for variance charts
        console.log('Charts updated');
    },
    
    exportReport() {
        alert('Export functionality would generate PDF/Excel report with variance analysis');
    },
    
    refresh() {
        this.calculateVariances();
        this.updateSummaryCards();
        this.renderVarianceTable();
        this.generateAlerts();
        this.generateActions();
        this.updateCharts();
    },
    
    getStatusIcon(status) {
        switch (status) {
            case 'favorable': return '✅';
            case 'unfavorable': return '❌';
            default: return '➖';
        }
    },
    
    getStatusClass(status) {
        switch (status) {
            case 'favorable': return 'favorable';
            case 'unfavorable': return 'unfavorable';
            default: return 'on-track';
        }
    },
    
    formatCurrency(value, showSign = false) {
        if (value === null || value === undefined || isNaN(value)) return '$0';
        
        const formatted = (Math.abs(value) / 1000000).toFixed(1);
        const sign = showSign && value !== 0 ? (value > 0 ? '+' : '-') : (value < 0 ? '-' : '');
        
        return `${sign}$${formatted}M`;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    BVApp.init();
});
