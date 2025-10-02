/**
 * Balance Sheet Application Controller
 */

const BSApp = {
    currentView: 'standard',
    
    init() {
        this.renderBalanceSheet();
        this.updateRatios();
        this.updateBalanceCheck();
        this.updateAllCharts();
        this.setupEventListeners();
        console.log('Balance Sheet application initialized');
    },
    
    setupEventListeners() {
        const dateSelect = document.getElementById('dateSelect');
        const formatSelect = document.getElementById('formatSelect');
        
        if (dateSelect) {
            dateSelect.addEventListener('change', () => {
                this.renderBalanceSheet();
                this.updateRatios();
            });
        }
        
        if (formatSelect) {
            formatSelect.addEventListener('change', () => {
                this.renderBalanceSheet();
                this.updateRatios();
            });
        }
    },
    
    renderBalanceSheet() {
        const tbody = document.getElementById('balanceSheetBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Render Assets
        this.renderSection(tbody, 'ASSETS', 'assets');
        this.renderSubSection(tbody, balanceSheetAccounts.assets.current, 'current-assets');
        this.renderSubSection(tbody, balanceSheetAccounts.assets.nonCurrent, 'non-current-assets');
        this.renderTotalRow(tbody, 'Total Assets', calculateTotalAssets(), 'total-assets');
        
        // Spacer
        this.renderSpacerRow(tbody);
        
        // Render Liabilities
        this.renderSection(tbody, 'LIABILITIES', 'liabilities');
        this.renderSubSection(tbody, balanceSheetAccounts.liabilities.current, 'current-liabilities');
        this.renderSubSection(tbody, balanceSheetAccounts.liabilities.nonCurrent, 'non-current-liabilities');
        this.renderTotalRow(tbody, 'Total Liabilities', calculateTotalLiabilities(), 'total-liabilities');
        
        // Spacer
        this.renderSpacerRow(tbody);
        
        // Render Equity
        this.renderSection(tbody, 'SHAREHOLDERS\' EQUITY', 'equity');
        this.renderSubSection(tbody, balanceSheetAccounts.equity, 'equity-accounts');
        this.renderTotalRow(tbody, 'Total Shareholders\' Equity', calculateTotalEquity(), 'total-equity');
        
        // Spacer
        this.renderSpacerRow(tbody);
        
        // Total Liabilities + Equity
        const totalLiabEquity = calculateTotalLiabilities() + calculateTotalEquity();
        this.renderTotalRow(tbody, 'Total Liabilities + Equity', totalLiabEquity, 'total-liab-equity');
    },
    
    renderSection(tbody, title, sectionId) {
        const row = document.createElement('tr');
        row.className = 'section-header';
        row.innerHTML = `
            <td colspan="5" class="py-3 px-2 font-bold text-lg text-white bg-slate-800">${title}</td>
        `;
        tbody.appendChild(row);
    },
    
    renderSubSection(tbody, section, sectionId) {
        Object.entries(section.accounts).forEach(([key, account]) => {
            const row = document.createElement('tr');
            row.className = 'account-row hover:bg-slate-800/50';
            
            const change = account.current - account.prior;
            const changePercent = account.prior !== 0 ? (change / account.prior) * 100 : 0;
            
            row.innerHTML = `
                <td class="py-2 px-2 pl-6">${account.name}</td>
                <td class="py-2 px-2 text-right">${this.formatCurrency(account.current)}</td>
                <td class="py-2 px-2 text-right">${this.formatCurrency(account.prior)}</td>
                <td class="py-2 px-2 text-right ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                    ${this.formatCurrency(change, true)}
                </td>
                <td class="py-2 px-2 text-right ${changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                    ${changePercent.toFixed(1)}%
                </td>
            `;
            tbody.appendChild(row);
        });
    },
    
    renderTotalRow(tbody, label, amount, rowId) {
        const row = document.createElement('tr');
        row.className = 'total-row font-bold text-white bg-slate-700 border-t border-gray-600';
        row.id = rowId;
        
        row.innerHTML = `
            <td class="py-3 px-2">${label}</td>
            <td class="py-3 px-2 text-right">${this.formatCurrency(amount)}</td>
            <td class="py-3 px-2 text-right">--</td>
            <td class="py-3 px-2 text-right">--</td>
            <td class="py-3 px-2 text-right">--</td>
        `;
        tbody.appendChild(row);
    },
    
    renderSpacerRow(tbody) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="py-2"></td>';
        tbody.appendChild(row);
    },
    
    updateRatios() {
        const ratios = calculateAllRatios();
        
        // Update ratio displays
        document.getElementById('currentRatio').textContent = formatRatio(ratios.currentRatio);
        document.getElementById('quickRatio').textContent = formatRatio(ratios.quickRatio);
        document.getElementById('cashRatio').textContent = formatRatio(ratios.cashRatio);
        document.getElementById('debtToEquity').textContent = formatRatio(ratios.debtToEquity);
        document.getElementById('debtToAssets').textContent = formatRatio(ratios.debtToAssets, 'percentage');
        document.getElementById('equityRatio').textContent = formatRatio(ratios.equityRatio, 'percentage');
        document.getElementById('assetTurnover').textContent = formatRatio(ratios.assetTurnover);
        document.getElementById('workingCapital').textContent = formatRatio(ratios.workingCapital, 'currency');
        document.getElementById('bookValuePerShare').textContent = '$' + formatRatio(ratios.bookValuePerShare);
        
        // Update balance check section
        document.getElementById('totalAssets').textContent = formatRatio(ratios.totalAssets, 'currency');
        document.getElementById('totalLiabEquity').textContent = formatRatio(ratios.totalLiabilities + ratios.totalEquity, 'currency');
        
        const difference = ratios.totalAssets - (ratios.totalLiabilities + ratios.totalEquity);
        document.getElementById('balanceDifference').textContent = formatRatio(difference, 'currency_k');
    },
    
    updateBalanceCheck() {
        const validation = validateBalanceSheet();
        const status = getValidationStatus();
        
        const balanceCheckElement = document.getElementById('balanceCheck');
        if (balanceCheckElement) {
            balanceCheckElement.textContent = validation.isBalanced ? '✓ Balanced' : '✗ Unbalanced';
            balanceCheckElement.className = `text-lg font-bold ${status.class}`;
        }
    },
    
    setView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-slate-700', 'text-gray-300');
        });
        
        const activeBtn = document.querySelector(`button[onclick="BSApp.setView('${view}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-700', 'text-gray-300');
            activeBtn.classList.add('bg-blue-600', 'text-white');
        }
        
        // Implement view switching logic
        switch (view) {
            case 'standard':
                this.renderBalanceSheet();
                break;
            case 'common-size':
                this.renderCommonSizeView();
                break;
            case 'trend':
                this.renderTrendView();
                break;
        }
    },
    
    renderCommonSizeView() {
        // Implementation for common-size analysis
        console.log('Common-size view not yet implemented');
    },
    
    renderTrendView() {
        // Implementation for trend analysis
        console.log('Trend view not yet implemented');
    },
    
    formatCurrency(value, showSign = false) {
        if (value === null || value === undefined || isNaN(value)) return '$0';
        
        const formatSelect = document.getElementById('formatSelect');
        const format = formatSelect ? formatSelect.value : 'thousands';
        
        let divisor = 1000;
        let suffix = 'K';
        
        if (format === 'millions') {
            divisor = 1000000;
            suffix = 'M';
        }
        
        const formatted = (Math.abs(value) / divisor).toFixed(1);
        const sign = showSign && value !== 0 ? (value > 0 ? '+' : '-') : (value < 0 ? '-' : '');
        
        return `${sign}$${formatted}${suffix}`;
    },
    
    updateAllCharts() {
        updateAllCharts();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    BSApp.init();
});
