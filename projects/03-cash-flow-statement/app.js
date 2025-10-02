/**
 * Cash Flow Statement Application Controller
 */

const CFApp = {
    currentMethod: 'indirect',
    currentView: 'detailed',
    currentPeriod: 'q3',
    
    init() {
        this.renderCashFlowStatement();
        this.updateMetrics();
        this.updateReconciliation();
        this.updateCharts();
        this.setupEventListeners();
        console.log('Cash Flow Statement application initialized');
    },
    
    setupEventListeners() {
        const periodSelect = document.getElementById('periodSelect');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                this.currentPeriod = e.target.value;
                this.renderCashFlowStatement();
                this.updateMetrics();
                this.updateReconciliation();
            });
        }
    },
    
    renderCashFlowStatement() {
        const tbody = document.getElementById('cashFlowBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (this.currentMethod === 'indirect') {
            this.renderIndirectMethod(tbody);
        } else {
            this.renderDirectMethod(tbody);
        }
    },
    
    renderIndirectMethod(tbody) {
        // Operating Activities
        this.renderSectionHeader(tbody, 'OPERATING ACTIVITIES');
        
        const operating = cashFlowData.operating.indirect;
        Object.entries(operating).forEach(([key, values]) => {
            this.renderLineItem(tbody, lineItemLabels[key], values, key);
        });
        
        const operatingTotal = this.calculateOperatingCashFlow();
        this.renderTotalRow(tbody, 'Net Cash from Operating Activities', operatingTotal);
        
        // Investing Activities
        this.renderSectionHeader(tbody, 'INVESTING ACTIVITIES');
        
        const investing = cashFlowData.investing;
        Object.entries(investing).forEach(([key, values]) => {
            this.renderLineItem(tbody, lineItemLabels[key], values, key);
        });
        
        const investingTotal = this.calculateInvestingCashFlow();
        this.renderTotalRow(tbody, 'Net Cash from Investing Activities', investingTotal);
        
        // Financing Activities
        this.renderSectionHeader(tbody, 'FINANCING ACTIVITIES');
        
        const financing = cashFlowData.financing;
        Object.entries(financing).forEach(([key, values]) => {
            this.renderLineItem(tbody, lineItemLabels[key], values, key);
        });
        
        const financingTotal = this.calculateFinancingCashFlow();
        this.renderTotalRow(tbody, 'Net Cash from Financing Activities', financingTotal);
        
        // Net Change in Cash
        const netChange = operatingTotal[this.currentPeriod] + investingTotal[this.currentPeriod] + financingTotal[this.currentPeriod];
        this.renderTotalRow(tbody, 'Net Change in Cash', { [this.currentPeriod]: netChange });
    },
    
    renderDirectMethod(tbody) {
        // Operating Activities - Direct Method
        this.renderSectionHeader(tbody, 'OPERATING ACTIVITIES (Direct Method)');
        
        const direct = cashFlowData.operating.direct;
        Object.entries(direct).forEach(([key, values]) => {
            this.renderLineItem(tbody, lineItemLabels[key], values, key);
        });
        
        const operatingTotal = this.calculateDirectOperatingCashFlow();
        this.renderTotalRow(tbody, 'Net Cash from Operating Activities', operatingTotal);
        
        // Investing and Financing remain the same
        this.renderSectionHeader(tbody, 'INVESTING ACTIVITIES');
        
        const investing = cashFlowData.investing;
        Object.entries(investing).forEach(([key, values]) => {
            this.renderLineItem(tbody, lineItemLabels[key], values, key);
        });
        
        const investingTotal = this.calculateInvestingCashFlow();
        this.renderTotalRow(tbody, 'Net Cash from Investing Activities', investingTotal);
        
        this.renderSectionHeader(tbody, 'FINANCING ACTIVITIES');
        
        const financing = cashFlowData.financing;
        Object.entries(financing).forEach(([key, values]) => {
            this.renderLineItem(tbody, lineItemLabels[key], values, key);
        });
        
        const financingTotal = this.calculateFinancingCashFlow();
        this.renderTotalRow(tbody, 'Net Cash from Financing Activities', financingTotal);
    },
    
    renderSectionHeader(tbody, title) {
        const row = document.createElement('tr');
        row.className = 'section-header';
        row.innerHTML = `
            <td colspan="4" class="py-3 px-2 font-bold text-lg text-white bg-slate-800">${title}</td>
        `;
        tbody.appendChild(row);
    },
    
    renderLineItem(tbody, label, values, key) {
        const row = document.createElement('tr');
        row.className = 'account-row hover:bg-slate-800/50';
        
        const currentValue = values[this.currentPeriod] || 0;
        const priorValue = values[this.getPriorPeriod()] || 0;
        const change = currentValue - priorValue;
        
        row.innerHTML = `
            <td class="py-2 px-2 pl-6">${label}</td>
            <td class="py-2 px-2 text-right ${currentValue >= 0 ? 'cash-inflow' : 'cash-outflow'}">
                ${this.formatCurrency(currentValue)}
            </td>
            <td class="py-2 px-2 text-right ${priorValue >= 0 ? 'cash-inflow' : 'cash-outflow'}">
                ${this.formatCurrency(priorValue)}
            </td>
            <td class="py-2 px-2 text-right ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                ${this.formatCurrency(change, true)}
            </td>
        `;
        tbody.appendChild(row);
    },
    
    renderTotalRow(tbody, label, values) {
        const row = document.createElement('tr');
        row.className = 'total-row font-bold text-white bg-slate-700 border-t border-gray-600';
        
        const currentValue = values[this.currentPeriod] || 0;
        const priorValue = values[this.getPriorPeriod()] || 0;
        const change = currentValue - priorValue;
        
        row.innerHTML = `
            <td class="py-3 px-2">${label}</td>
            <td class="py-3 px-2 text-right ${currentValue >= 0 ? 'cash-inflow' : 'cash-outflow'}">
                ${this.formatCurrency(currentValue)}
            </td>
            <td class="py-3 px-2 text-right ${priorValue >= 0 ? 'cash-inflow' : 'cash-outflow'}">
                ${this.formatCurrency(priorValue)}
            </td>
            <td class="py-3 px-2 text-right ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                ${this.formatCurrency(change, true)}
            </td>
        `;
        tbody.appendChild(row);
    },
    
    calculateOperatingCashFlow() {
        const operating = cashFlowData.operating.indirect;
        const result = {};
        
        ['q1', 'q2', 'q3'].forEach(period => {
            result[period] = Object.values(operating).reduce((sum, item) => {
                return sum + (item[period] || 0);
            }, 0);
        });
        
        return result;
    },
    
    calculateDirectOperatingCashFlow() {
        const direct = cashFlowData.operating.direct;
        const result = {};
        
        ['q1', 'q2', 'q3'].forEach(period => {
            result[period] = Object.values(direct).reduce((sum, item) => {
                return sum + (item[period] || 0);
            }, 0);
        });
        
        return result;
    },
    
    calculateInvestingCashFlow() {
        const investing = cashFlowData.investing;
        const result = {};
        
        ['q1', 'q2', 'q3'].forEach(period => {
            result[period] = Object.values(investing).reduce((sum, item) => {
                return sum + (item[period] || 0);
            }, 0);
        });
        
        return result;
    },
    
    calculateFinancingCashFlow() {
        const financing = cashFlowData.financing;
        const result = {};
        
        ['q1', 'q2', 'q3'].forEach(period => {
            result[period] = Object.values(financing).reduce((sum, item) => {
                return sum + (item[period] || 0);
            }, 0);
        });
        
        return result;
    },
    
    updateMetrics() {
        const operating = this.calculateOperatingCashFlow();
        const investing = this.calculateInvestingCashFlow();
        const financing = this.calculateFinancingCashFlow();
        
        const operatingCF = operating[this.currentPeriod];
        const investingCF = investing[this.currentPeriod];
        const financingCF = financing[this.currentPeriod];
        const netChange = operatingCF + investingCF + financingCF;
        
        // Calculate Free Cash Flow (Operating CF - CapEx)
        const capex = Math.abs(cashFlowData.investing.capex[this.currentPeriod] || 0);
        const freeCashFlow = operatingCF - capex;
        
        document.getElementById('operatingCF').textContent = this.formatCurrency(operatingCF);
        document.getElementById('investingCF').textContent = this.formatCurrency(investingCF);
        document.getElementById('financingCF').textContent = this.formatCurrency(financingCF);
        document.getElementById('netChange').textContent = this.formatCurrency(netChange);
        document.getElementById('fcf').textContent = this.formatCurrency(freeCashFlow);
    },
    
    updateReconciliation() {
        const beginningCash = cashFlowData.cash.beginning[this.currentPeriod] || 0;
        const endingCash = cashFlowData.cash.ending[this.currentPeriod] || 0;
        const netCashFlow = endingCash - beginningCash;
        
        document.getElementById('beginningCash').textContent = this.formatCurrency(beginningCash);
        document.getElementById('netCashFlow').textContent = this.formatCurrency(netCashFlow);
        document.getElementById('endingCash').textContent = this.formatCurrency(endingCash);
    },
    
    setMethod(method) {
        this.currentMethod = method;
        
        // Update button states
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.classList.remove('bg-purple-600', 'text-white');
            btn.classList.add('bg-slate-700', 'text-gray-300');
        });
        
        const activeBtn = document.querySelector(`button[onclick="CFApp.setMethod('${method}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-700', 'text-gray-300');
            activeBtn.classList.add('bg-purple-600', 'text-white');
        }
        
        this.renderCashFlowStatement();
    },
    
    setView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('bg-purple-600', 'text-white');
            btn.classList.add('bg-slate-700', 'text-gray-300');
        });
        
        const activeBtn = document.querySelector(`button[onclick="CFApp.setView('${view}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-700', 'text-gray-300');
            activeBtn.classList.add('bg-purple-600', 'text-white');
        }
        
        this.renderCashFlowStatement();
    },
    
    toggleWaterfall() {
        // Implementation for waterfall chart toggle
        console.log('Waterfall chart toggle');
    },
    
    updateCharts() {
        // Implementation for chart updates
        console.log('Charts updated');
    },
    
    getPriorPeriod() {
        const periods = { q3: 'q2', q2: 'q1', q1: 'q1' };
        return periods[this.currentPeriod] || 'q2';
    },
    
    formatCurrency(value, showSign = false) {
        if (value === null || value === undefined || isNaN(value)) return '$0';
        
        const formatted = (Math.abs(value) / 1000).toFixed(0);
        const sign = showSign && value !== 0 ? (value > 0 ? '+' : '-') : (value < 0 ? '-' : '');
        
        return `${sign}$${formatted}K`;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CFApp.init();
});
