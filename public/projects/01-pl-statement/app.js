/**
 * P&L Statement Application Controller
 * Main application logic and UI orchestration
 */

// Application state
const PLApp = {
    // Current view state
    currentView: 'table',
    hasEdits: false,
    
    // Initialize the application
    init() {
        this.renderPnLTable();
        this.updateMetrics();
        this.updateWarningBanner();
        this.updateInsights();
        this.renderMonthlyView();
        this.updateAllCharts();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('P&L Statement application initialized');
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Period selector
        const periodSelect = document.getElementById('periodSelect');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => {
                this.renderPnLTable();
                this.updateAllCharts();
            });
        }
        
        // Comparison selector
        const comparisonSelect = document.getElementById('comparisonSelect');
        if (comparisonSelect) {
            comparisonSelect.addEventListener('change', () => {
                this.renderPnLTable();
            });
        }
    },
    
    // Render the main P&L table
    renderPnLTable() {
        const tbody = document.getElementById('pnlTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Calculate current metrics
        const metrics = calculateKeyMetrics(financialData);
        
        // Render revenue section
        this.renderMainRow(tbody, 'Revenue', financialData.revenue, originalData.revenue * 1.05, 'revenue', true);
        
        // Render COGS section
        this.renderMainRow(tbody, 'Cost of Goods Sold', financialData.cogs, originalData.cogs * 1.02, 'cogs', true);
        
        // Render gross profit
        this.renderTotalRow(tbody, 'Gross Profit', metrics.grossProfit, (originalData.revenue * 1.05) - (originalData.cogs * 1.02));
        
        // Render OpEx section
        this.renderMainRow(tbody, 'Operating Expenses', financialData.opex, originalData.opex * 0.98, 'opex', true);
        
        // Render operating income
        this.renderTotalRow(tbody, 'Operating Income', metrics.operatingIncome, metrics.grossProfit - (originalData.opex * 0.98));
        
        // Render other income
        this.renderMainRow(tbody, 'Other Income/(Expense)', financialData.other, originalData.other, 'other', false);
        
        // Render net income
        this.renderTotalRow(tbody, 'Net Income', metrics.netIncome, metrics.operatingIncome + originalData.other);
    },
    
    // Render a main account row with expand/collapse functionality
    renderMainRow(tbody, label, actual, budget, category, expandable = true) {
        const row = document.createElement('tr');
        row.className = 'account-row font-semibold text-gray-200';
        
        const variance = calculateVariance(actual, budget);
        const percentOfRevenue = calculatePercentOfRevenue(actual, financialData.revenue);
        
        const expandIcon = expandable ? 
            `<span class="expand-icon mr-2" onclick="PLApp.toggleExpand('${category}')">▶</span>` : '';
        
        const editableClass = chartOfAccounts[category]?.editable ? 'editable-value' : '';
        const clickHandler = chartOfAccounts[category]?.editable ? `onclick="PLApp.editValue('${category}')"` : '';
        
        row.innerHTML = `
            <td class="py-2 px-2 expandable" ${expandable ? `onclick="PLApp.toggleExpand('${category}')"` : ''}>
                ${expandIcon}${label}
            </td>
            <td class="py-2 px-2 text-right ${editableClass}" ${clickHandler}>
                <span id="${category}-value">${formatCurrency(actual)}</span>
            </td>
            <td class="py-2 px-2 text-right">${formatCurrency(budget)}</td>
            <td class="py-2 px-2 text-right ${variance.amount >= 0 ? 'positive-variance' : 'negative-variance'}">
                ${formatCurrency(variance.amount, true)}
            </td>
            <td class="py-2 px-2 text-right ${variance.percentage >= 0 ? 'positive-variance' : 'negative-variance'}">
                ${variance.percentage.toFixed(1)}%
            </td>
            <td class="py-2 px-2 text-right">${percentOfRevenue.toFixed(1)}%</td>
        `;
        
        tbody.appendChild(row);
        
        // Render child accounts if expanded
        if (expandable && chartOfAccounts[category]?.expanded && chartOfAccounts[category]?.children) {
            this.renderChildRows(tbody, chartOfAccounts[category].children, actual);
        }
    },
    
    // Render child account rows
    renderChildRows(tbody, children, parentTotal) {
        Object.entries(children).forEach(([key, child]) => {
            const amount = parentTotal * (child.percentage / 100);
            const row = document.createElement('tr');
            row.className = 'child-account account-row text-gray-400';
            
            row.innerHTML = `
                <td class="py-1 px-2 pl-8">${child.name}</td>
                <td class="py-1 px-2 text-right">${formatCurrency(amount)}</td>
                <td class="py-1 px-2 text-right">-</td>
                <td class="py-1 px-2 text-right">-</td>
                <td class="py-1 px-2 text-right">-</td>
                <td class="py-1 px-2 text-right">${child.percentage.toFixed(1)}%</td>
            `;
            
            tbody.appendChild(row);
        });
    },
    
    // Render total/calculated rows
    renderTotalRow(tbody, label, actual, budget) {
        const row = document.createElement('tr');
        const isNegative = actual < 0;
        row.className = 'font-bold text-white bg-slate-800 border-t border-gray-600';
        
        const variance = calculateVariance(actual, budget);
        const percentOfRevenue = calculatePercentOfRevenue(actual, financialData.revenue);
        
        row.innerHTML = `
            <td class="py-3 px-2">${label}</td>
            <td class="py-3 px-2 text-right ${isNegative ? 'negative-value' : ''}">${formatCurrency(actual)}</td>
            <td class="py-3 px-2 text-right">${formatCurrency(budget)}</td>
            <td class="py-3 px-2 text-right ${variance.amount >= 0 ? 'positive-variance' : 'negative-variance'}">
                ${formatCurrency(variance.amount, true)}
            </td>
            <td class="py-3 px-2 text-right ${variance.percentage >= 0 ? 'positive-variance' : 'negative-variance'}">
                ${variance.percentage.toFixed(1)}%
            </td>
            <td class="py-3 px-2 text-right">${percentOfRevenue.toFixed(1)}%</td>
        `;
        
        tbody.appendChild(row);
    },
    
    // Handle inline editing of values
    editValue(category) {
        const span = document.getElementById(`${category}-value`);
        if (!span) return;
        
        const currentValue = financialData[category];
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'editing-input';
        input.value = formatNumber(currentValue);
        
        input.onblur = () => {
            const newValue = parseInt(input.value.replace(/,/g, '')) || currentValue;
            financialData[category] = newValue;
            this.hasEdits = true;
            
            this.renderPnLTable();
            this.updateMetrics();
            this.updateWarningBanner();
            this.updateInsights();
            this.updateAllCharts();
            
            document.getElementById('resetButton').classList.remove('hidden');
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        };
        
        span.innerHTML = '';
        span.appendChild(input);
        input.focus();
        input.select();
    },
    
    // Toggle expand/collapse for account categories
    toggleExpand(category) {
        if (chartOfAccounts[category]) {
            chartOfAccounts[category].expanded = !chartOfAccounts[category].expanded;
            this.renderPnLTable();
        }
    },
    
    // Apply predefined scenarios
    applyScenario(scenarioName) {
        if (!scenarios[scenarioName]) return;
        
        this.hasEdits = true;
        document.getElementById('resetButton').classList.remove('hidden');
        
        const scenario = scenarios[scenarioName];
        const adjustedData = applyScenario(originalData, scenario);
        
        // Update financial data
        Object.assign(financialData, adjustedData);
        
        // Update UI
        this.renderPnLTable();
        this.updateMetrics();
        this.updateWarningBanner();
        this.updateInsights();
        this.updateAllCharts();
    },
    
    // Reset to original values
    resetValues() {
        Object.assign(financialData, originalData);
        this.hasEdits = false;
        document.getElementById('resetButton').classList.add('hidden');
        
        this.renderPnLTable();
        this.updateMetrics();
        this.updateWarningBanner();
        this.updateInsights();
        this.updateAllCharts();
    },
    
    // Toggle insights panel
    toggleInsights() {
        const box = document.getElementById('insightsBox');
        const toggle = document.getElementById('insightsToggle');
        
        if (box && toggle) {
            box.classList.toggle('expanded');
            toggle.textContent = box.classList.contains('expanded') ? '▼' : '▶';
        }
    },
    
    // Toggle between standard and monthly view
    toggleMonthView() {
        const monthView = document.getElementById('monthView');
        const standardView = document.getElementById('tableView');
        
        if (monthView && standardView) {
            if (monthView.classList.contains('month-view')) {
                monthView.classList.add('active');
                standardView.classList.add('hidden');
            } else {
                monthView.classList.remove('active');
                standardView.classList.remove('hidden');
            }
        }
    },
    
    // Update key metrics display
    updateMetrics() {
        const metrics = calculateKeyMetrics(financialData);
        
        // Update metric cards
        const elements = {
            'grossMarginMetric': `${metrics.grossMargin.toFixed(1)}%`,
            'operatingMarginMetric': `${metrics.operatingMargin.toFixed(1)}%`,
            'ebitdaMarginMetric': `${metrics.ebitdaMargin.toFixed(1)}%`,
            'netMarginMetric': `${metrics.netMargin.toFixed(1)}%`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                
                // Update color based on performance
                const numValue = parseFloat(value);
                element.className = numValue >= 0 ? 'text-2xl font-bold text-emerald-400' : 'text-2xl font-bold text-red-400';
            }
        });
    },
    
    // Update warning banner
    updateWarningBanner() {
        const metrics = calculateKeyMetrics(financialData);
        const banner = document.getElementById('warningBanner');
        
        if (!banner) return;
        
        if (metrics.operatingIncome < 0) {
            const opexReduction = Math.abs(metrics.operatingIncome);
            const revenueIncrease = (opexReduction / metrics.revenue * 100);
            
            banner.style.display = 'flex';
            document.getElementById('opexAmount').textContent = formatCurrency(financialData.opex);
            document.getElementById('grossProfitAmount').textContent = formatCurrency(metrics.grossProfit);
            document.getElementById('lossAmount').textContent = formatCurrency(opexReduction);
        } else {
            banner.style.display = 'none';
        }
    },
    
    // Update insights panel
    updateInsights() {
        const metrics = calculateKeyMetrics(financialData);
        const insights = generateInsights(metrics);
        
        // Update burn rate
        const burnRateElement = document.getElementById('burnRate');
        if (burnRateElement && metrics.netIncome < 0) {
            const monthlyBurn = Math.abs(metrics.netIncome);
            burnRateElement.textContent = formatCurrency(monthlyBurn) + '/month';
        }
        
        // Update breakeven amount
        const breakEvenElement = document.getElementById('breakEvenAmount');
        if (breakEvenElement && metrics.operatingIncome < 0) {
            breakEvenElement.textContent = formatCurrency(Math.abs(metrics.operatingIncome));
        }
        
        // Update gross margin percentage
        const grossMarginElement = document.getElementById('grossMarginPercent');
        if (grossMarginElement) {
            grossMarginElement.textContent = `${metrics.grossMargin.toFixed(1)}%`;
        }
    },
    
    // Render monthly view
    renderMonthlyView() {
        const tbody = document.getElementById('monthTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Render revenue section
        this.renderMonthlySectionHeader(tbody, 'revenue', monthlyData.revenue);
        this.renderMonthlyAccountRow(tbody, 'Total Revenue', 'revenue', false);
        
        // Render COGS section
        this.renderMonthlySectionHeader(tbody, 'cogs', monthlyData.cogs);
        this.renderMonthlyAccountRow(tbody, 'Total COGS', 'cogs', false);
        
        // Render gross profit
        const grossProfitData = calculateMonthlyGrossProfit();
        this.renderMonthlyCalculatedRow(tbody, 'GROSS PROFIT', grossProfitData, 'total-row');
        
        // Render OpEx section
        this.renderMonthlySectionHeader(tbody, 'opex', monthlyData.opex);
        this.renderMonthlyAccountRow(tbody, 'Total OpEx', 'opex', false);
        
        // Render operating income
        const operatingIncomeData = calculateMonthlyOperatingIncome();
        this.renderMonthlyCalculatedRow(tbody, 'OPERATING INCOME', operatingIncomeData, 'total-row');
        
        // Update summary bar
        this.updateMonthlySummary();
    },
    
    // Render monthly section header
    renderMonthlySectionHeader(tbody, key, section) {
        const row = document.createElement('tr');
        row.className = 'main-section-header';
        
        row.innerHTML = `<td class="sticky-column py-2 px-3 font-bold">${section.name}</td>` +
                       Array(13).fill('<td class="py-2 px-2"></td>').join('');
        
        tbody.appendChild(row);
    },
    
    // Render monthly account row
    renderMonthlyAccountRow(tbody, label, category, expandable) {
        const row = document.createElement('tr');
        row.className = 'account-row';
        
        const data = monthlyData[category];
        const ytdActual = calculateYTDTotal(data.actuals);
        
        let html = `<td class="sticky-column py-1 px-3">${label}</td>`;
        
        // Add monthly cells
        for (let i = 0; i < 12; i++) {
            const cellId = `${category}-actuals-${i}`;
            html += `<td class="month-cell editable-cell" id="${cellId}" 
                        onclick="PLApp.editMonthlyCell('${category}', null, 'actuals', ${i})">
                        ${formatCurrency(data.actuals[i])}
                     </td>`;
        }
        
        // Add YTD cell
        html += `<td class="month-cell font-semibold">${formatCurrency(ytdActual)}</td>`;
        
        row.innerHTML = html;
        tbody.appendChild(row);
    },
    
    // Render calculated monthly row (like gross profit, operating income)
    renderMonthlyCalculatedRow(tbody, label, values, rowClass = '') {
        const row = document.createElement('tr');
        row.className = rowClass || 'font-semibold text-gray-200';
        
        const ytdTotal = calculateYTDTotal(values.actuals);
        
        let html = `<td class="sticky-column py-1 px-3">${label}</td>`;
        
        // Add monthly cells
        for (let i = 0; i < 12; i++) {
            const isNegative = values.actuals[i] < 0;
            html += `<td class="month-cell ${isNegative ? 'text-red-400' : ''}">
                        ${formatCurrency(values.actuals[i])}
                     </td>`;
        }
        
        // Add YTD cell
        const isYTDNegative = ytdTotal < 0;
        html += `<td class="month-cell font-semibold ${isYTDNegative ? 'text-red-400' : ''}">
                    ${formatCurrency(ytdTotal)}
                 </td>`;
        
        row.innerHTML = html;
        tbody.appendChild(row);
    },
    
    // Edit monthly cell values
    editMonthlyCell(parentKey, childKey, type, monthIndex) {
        const cellId = childKey ? 
            `${parentKey}-${childKey}-${type}-${monthIndex}` : 
            `${parentKey}-${type}-${monthIndex}`;
        
        const cell = document.getElementById(cellId);
        if (!cell) return;
        
        let currentValue;
        if (childKey) {
            currentValue = monthlyData[parentKey].children[childKey][type][monthIndex];
        } else {
            currentValue = monthlyData[parentKey][type][monthIndex];
        }
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'editing-input';
        input.value = formatNumber(currentValue);
        input.style.width = '70px';
        input.style.fontSize = '11px';
        
        input.onblur = () => {
            const newValue = parseInt(input.value.replace(/,/g, '')) || currentValue;
            
            if (childKey) {
                monthlyData[parentKey].children[childKey][type][monthIndex] = newValue;
            } else {
                monthlyData[parentKey][type][monthIndex] = newValue;
            }
            
            cell.classList.add('edited-cell');
            this.renderMonthlyView();
            this.updateAllCharts();
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        };
        
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
        input.select();
    },
    
    // Update monthly summary bar
    updateMonthlySummary() {
        const revenueYTD = calculateYTDTotal(monthlyData.revenue.actuals);
        const grossProfitYTD = calculateYTDTotal(calculateMonthlyGrossProfit().actuals);
        const operatingIncomeYTD = calculateYTDTotal(calculateMonthlyOperatingIncome().actuals);
        const netIncomeYTD = operatingIncomeYTD; // Simplified
        
        const elements = {
            'summaryRevenue': formatCurrency(revenueYTD),
            'summaryGrossProfit': formatCurrency(grossProfitYTD),
            'summaryOperatingIncome': formatCurrency(operatingIncomeYTD),
            'summaryNetIncome': formatCurrency(netIncomeYTD)
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    },
    
    // Toggle view between table, waterfall, and trend
    toggleView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('bg-emerald-600', 'text-white');
            btn.classList.add('bg-slate-700', 'text-gray-300');
        });
        
        const activeBtn = document.querySelector(`button[onclick="PLApp.toggleView('${view}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-700', 'text-gray-300');
            activeBtn.classList.add('bg-emerald-600', 'text-white');
        }
        
        // Show/hide appropriate sections
        const tableView = document.getElementById('tableView');
        const chartsView = document.getElementById('chartsView');
        
        if (view === 'table') {
            if (tableView) tableView.style.display = 'block';
            if (chartsView) chartsView.style.display = 'none';
        } else {
            if (tableView) tableView.style.display = 'none';
            if (chartsView) chartsView.style.display = 'block';
            this.updateAllCharts();
        }
    },
    
    // Update all charts
    updateAllCharts() {
        const metrics = calculateKeyMetrics(financialData);
        updateAllCharts(metrics, monthlyData);
    },
    
    // Export functions (placeholder implementations)
    exportToExcel() {
        alert('Excel export functionality would be implemented here');
    },
    
    exportToPDF() {
        alert('PDF export functionality would be implemented here');
    },
    
    emailReport() {
        alert('Email report functionality would be implemented here');
    },
    
    shareLink() {
        alert('Share link functionality would be implemented here');
    },
    
    // Apply monthly scenarios
    applyMonthlyScenario(scenarioName) {
        // Implementation for monthly scenario adjustments
        console.log(`Applying monthly scenario: ${scenarioName}`);
    },
    
    // Reset monthly data
    resetMonthlyData() {
        monthlyData = JSON.parse(JSON.stringify(monthlyDataOriginal));
        this.renderMonthlyView();
        this.updateAllCharts();
    }
};

// Helper functions for monthly calculations
function calculateMonthlyGrossProfit() {
    return {
        actuals: monthlyData.revenue.actuals.map((rev, i) => rev - monthlyData.cogs.actuals[i]),
        budget: monthlyData.revenue.budget.map((rev, i) => rev - monthlyData.cogs.budget[i])
    };
}

function calculateMonthlyOperatingIncome() {
    const grossProfit = calculateMonthlyGrossProfit();
    return {
        actuals: grossProfit.actuals.map((gp, i) => gp - monthlyData.opex.actuals[i]),
        budget: grossProfit.budget.map((gp, i) => gp - monthlyData.opex.budget[i])
    };
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    PLApp.init();
});
