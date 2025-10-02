/**
 * P&L Statement Application Controller
 * Main application logic and UI orchestration
 */

// Application state
const PLApp = {
    // Current view state
    currentView: 'table',
    hasEdits: false,
    currentPeriod: 'q3',
    currentData: financialData,
    comparisonData: budgetData,
    comparisonLabel: 'Budget',
    
    // Period-specific data storage
    periodData: {
        q1: { ...quarterlyData.q1 },
        q2: { ...quarterlyData.q2 },
        q3: { ...quarterlyData.q3 },
        ytd: { ...originalData }
    },
    
    // Original period data for resets
    originalPeriodData: {
        q1: { ...quarterlyData.q1 },
        q2: { ...quarterlyData.q2 },
        q3: { ...quarterlyData.q3 },
        ytd: { ...originalData }
    },
    
    // Initialize the application
    init() {
        try {
            // Initialize period data properly
            this.initializePeriodData();
            
            // Check for shared data on load
            this.loadSharedData();
            
            // Set initial period data
            this.loadPeriodData();
            
            this.renderPnLTable();
            this.updateMetrics();
            this.updateWarningBanner();
            this.updateInsights();
            this.renderMonthlyView();
            this.updateAllCharts();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('P&L Statement application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize P&L application:', error);
            this.showToast('⚠️ Application initialization failed. Please refresh the page.', 'error');
        }
    },
    
    // Initialize period data structure
    initializePeriodData() {
        try {
            // Use quarterly data with validation
            this.periodData = {
                q1: { ...quarterlyData.q1 },
                q2: { ...quarterlyData.q2 },
                q3: { ...quarterlyData.q3 }, // Now matches YTD data
                ytd: { ...originalData }
            };
            
            // Validate data integrity
            Object.keys(this.periodData).forEach(period => {
                const data = this.periodData[period];
                if (!data.revenue || data.revenue <= 0) {
                    console.error(`Invalid revenue for ${period}:`, data.revenue);
                    throw new Error(`Data corruption detected in ${period}`);
                }
            });
            
            // Create deep copy for original data
            this.originalPeriodData = JSON.parse(JSON.stringify(this.periodData));
            
            console.log('Period data initialized successfully:', this.periodData);
        } catch (error) {
            console.error('Failed to initialize period data:', error);
            // Fallback to safe defaults
            this.periodData = {
                q1: { revenue: 2000000, cogs: 600000, opex: 1400000, other: -10000 },
                q2: { revenue: 4200000, cogs: 1260000, opex: 2850000, other: -22000 },
                q3: { revenue: 7950000, cogs: 2350000, opex: 5770000, other: -36000 },
                ytd: { revenue: 7950000, cogs: 2350000, opex: 5770000, other: -36000 }
            };
            this.originalPeriodData = JSON.parse(JSON.stringify(this.periodData));
        }
    },
    
    // Load data for current period
    loadPeriodData() {
        const periodSelect = document.getElementById('periodSelect');
        this.currentPeriod = periodSelect ? periodSelect.value : 'q3';
        
        // Load current period's data
        const currentPeriodData = this.periodData[this.currentPeriod];
        if (currentPeriodData) {
            Object.assign(financialData, currentPeriodData);
        }
    },
    
    // Load shared data if available
    loadSharedData() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedParam = urlParams.get('shared');
        
        if (sharedParam) {
            const sharedData = localStorage.getItem('sharedPLData');
            if (sharedData) {
                try {
                    const data = JSON.parse(sharedData);
                    // Restore financial data
                    Object.assign(financialData, data.financialData);
                    Object.assign(monthlyData, data.monthlyData);
                    this.hasEdits = data.hasEdits || false;
                    
                    if (this.hasEdits) {
                        document.getElementById('resetButton').classList.remove('hidden');
                    }
                    
                    console.log('Loaded shared P&L data');
                } catch (e) {
                    console.warn('Failed to load shared data:', e);
                }
            }
        }
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Period selector
        const periodSelect = document.getElementById('periodSelect');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => {
                this.handlePeriodChange();
            });
        }
        
        // Comparison selector
        const comparisonSelect = document.getElementById('comparisonSelect');
        if (comparisonSelect) {
            comparisonSelect.addEventListener('change', (event) => {
                this.handleComparisonChange(event);
            });
        }
    },
    
    // Handle period changes
    handlePeriodChange() {
        const newPeriod = document.getElementById('periodSelect').value;
        
        // Save current period's data before switching
        if (this.hasEdits) {
            this.periodData[this.currentPeriod] = { ...financialData };
        }
        
        // Load data for new period
        this.currentPeriod = newPeriod;
        Object.assign(financialData, this.periodData[newPeriod]);
        
        // Check if this period has edits
        const originalData = this.originalPeriodData[newPeriod];
        this.hasEdits = JSON.stringify(financialData) !== JSON.stringify(originalData);
        
        // Update reset button visibility
        if (this.hasEdits) {
            document.getElementById('resetButton').classList.remove('hidden');
        } else {
            document.getElementById('resetButton').classList.add('hidden');
        }
        
        this.renderPnLTable();
        this.updateMetrics();
        this.updateWarningBanner();
        this.updateInsights();
        this.updateAllCharts();
    },
    
    // Handle comparison changes
    handleComparisonChange(event) {
        // Prevent default behavior and stop propagation
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const comparisonSelect = document.getElementById('comparisonSelect');
        if (!comparisonSelect) return;
        
        const comparison = comparisonSelect.value;
        
        switch(comparison) {
            case 'budget':
                this.comparisonData = budgetData;
                this.comparisonLabel = 'Budget';
                break;
            case 'prior':
                this.comparisonData = priorYearData;
                this.comparisonLabel = 'Prior Year';
                break;
            case 'forecast':
                this.comparisonData = forecastData;
                this.comparisonLabel = 'Forecast';
                break;
            default:
                this.comparisonData = budgetData;
                this.comparisonLabel = 'Budget';
        }
        
        // Update table header to show comparison type
        const comparisonHeader = document.querySelector('th:nth-child(3)');
        if (comparisonHeader) {
            comparisonHeader.textContent = this.comparisonLabel;
        }
        
        this.renderPnLTable();
    },
    
    // Render the main P&L table
    renderPnLTable() {
        try {
            const tbody = document.getElementById('pnlTableBody');
            if (!tbody) {
                console.error('P&L table body not found');
                return;
            }
            
            tbody.innerHTML = '';
            
            // Validate financial data
            if (!financialData || typeof financialData.revenue === 'undefined') {
                console.error('Invalid financial data, reinitializing...');
                this.loadPeriodData();
            }
            
            // Use current financial data
            const currentData = financialData;
            const comparisonData = this.comparisonData || budgetData;
        
        // Calculate current metrics
        const metrics = calculateKeyMetrics(currentData);
        
        // Render revenue section
        this.renderMainRow(tbody, 'Revenue', currentData.revenue, comparisonData.revenue, 'revenue', true);
        
        // Render COGS section
        this.renderMainRow(tbody, 'Cost of Goods Sold', currentData.cogs, comparisonData.cogs, 'cogs', true);
        
        // Render gross profit
        this.renderTotalRow(tbody, 'Gross Profit', metrics.grossProfit, comparisonData.revenue - comparisonData.cogs);
        
        // Render OpEx section
        this.renderMainRow(tbody, 'Operating Expenses', currentData.opex, comparisonData.opex, 'opex', true);
        
        // Render operating income
        this.renderTotalRow(tbody, 'Operating Income', metrics.operatingIncome, comparisonData.revenue - comparisonData.cogs - comparisonData.opex);
        
        // Render other income
        this.renderMainRow(tbody, 'Other Income/(Expense)', currentData.other, comparisonData.other, 'other', false);
        
        // Render net income
        this.renderTotalRow(tbody, 'Net Income', metrics.netIncome, comparisonData.revenue - comparisonData.cogs - comparisonData.opex + comparisonData.other);
        
        } catch (error) {
            console.error('Error rendering P&L table:', error);
            const tbody = document.getElementById('pnlTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-red-400 py-8">Error loading P&L data. Please refresh the page.</td></tr>';
            }
        }
    },
    
    // Render a main account row with expand/collapse functionality
    renderMainRow(tbody, label, actual, budget, category, expandable = true) {
        const row = document.createElement('tr');
        const isExpanded = chartOfAccounts[category]?.expanded;
        row.className = `account-row font-semibold text-gray-200 ${isExpanded ? 'expanded' : ''}`;
        
        const variance = calculateVariance(actual, budget);
        const percentOfRevenue = calculatePercentOfRevenue(actual, financialData.revenue);
        
        // Remove expand icons for now since sub-accounts aren't fully implemented
        const expandIcon = '';
        
        const editableClass = chartOfAccounts[category]?.editable ? 'editable-value' : '';
        const clickHandler = chartOfAccounts[category]?.editable ? `onclick="PLApp.editValue('${category}')"` : '';
        
        row.innerHTML = `
            <td class="py-2 px-2">
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
        
        // Prevent multiple edits
        if (span.querySelector('input')) return;
        
        const currentValue = financialData[category];
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'editing-input';
        input.value = formatNumber(currentValue);
        
        const commitEdit = () => {
            const newValue = parseInt(input.value.replace(/[^0-9-]/g, '')) || currentValue;
            if (newValue !== currentValue) {
                financialData[category] = newValue;
                
                // Save to period data storage
                this.periodData[this.currentPeriod] = { ...financialData };
                
                this.hasEdits = true;
                document.getElementById('resetButton').classList.remove('hidden');
            }
            
            // Restore original content
            span.innerHTML = `<span id="${category}-value">${formatCurrency(financialData[category])}</span>`;
            
            // Update everything
            this.renderPnLTable();
            this.updateMetrics();
            this.updateWarningBanner();
            this.updateInsights();
            this.updateAllCharts();
        };
        
        input.onblur = commitEdit;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitEdit();
            } else if (e.key === 'Escape') {
                // Cancel edit
                span.innerHTML = `<span id="${category}-value">${formatCurrency(currentValue)}</span>`;
            }
        };
        
        // Replace content with input
        span.innerHTML = '';
        span.appendChild(input);
        input.focus();
        input.select();
    },
    
    // Toggle expand/collapse for account categories
    toggleExpand(category) {
        if (chartOfAccounts[category]) {
            chartOfAccounts[category].expanded = !chartOfAccounts[category].expanded;
            
            // Update expand icon
            const expandIcon = document.querySelector(`[onclick="PLApp.toggleExpand('${category}')"] .expand-icon`);
            if (expandIcon) {
                if (chartOfAccounts[category].expanded) {
                    expandIcon.textContent = '▼';
                    expandIcon.classList.add('expanded');
                } else {
                    expandIcon.textContent = '▶';
                    expandIcon.classList.remove('expanded');
                }
            }
            
            this.renderPnLTable();
        }
    },
    
    // Apply predefined scenarios
    applyScenario(scenarioName) {
        try {
            if (!scenarios[scenarioName]) {
                console.error('Unknown scenario:', scenarioName);
                return;
            }
            
            // Validate current period data
            const baseData = this.originalPeriodData[this.currentPeriod];
            if (!baseData || !baseData.revenue) {
                console.error('Invalid base data for period:', this.currentPeriod);
                this.showToast('⚠️ Data error. Please refresh the page.', 'error');
                return;
            }
            
            // Warn if user has existing edits
            if (this.hasEdits) {
                if (!confirm(`Applying this scenario will overwrite your current edits for ${this.currentPeriod.toUpperCase()}. Continue?`)) {
                    return;
                }
            }
            
            const scenario = scenarios[scenarioName];
            const adjustedData = applyScenario(baseData, scenario);
            
            // Validate adjusted data
            if (!adjustedData || !adjustedData.revenue) {
                console.error('Scenario produced invalid data:', adjustedData);
                this.showToast('⚠️ Scenario calculation failed.', 'error');
                return;
            }
            
            // Update financial data for current period
            Object.assign(financialData, adjustedData);
            
            // Save to period data storage
            this.periodData[this.currentPeriod] = { ...adjustedData };
            
            this.hasEdits = true;
            document.getElementById('resetButton').classList.remove('hidden');
            
            // Update UI with error handling
            this.safeUpdateUI();
            
            // Show confirmation
            this.showToast(`✓ ${scenario.name} applied to ${this.currentPeriod.toUpperCase()} - Revenue: ${formatCurrency(adjustedData.revenue)}`, 'success');
            
        } catch (error) {
            console.error('Scenario application failed:', error);
            this.showToast('⚠️ Scenario failed to apply. Please try again.', 'error');
        }
    },
    
    // Reset to original values
    resetValues() {
        // Reset current period to its original data
        const originalData = this.originalPeriodData[this.currentPeriod];
        Object.assign(financialData, originalData);
        
        // Update period data storage
        this.periodData[this.currentPeriod] = { ...originalData };
        
        this.hasEdits = false;
        document.getElementById('resetButton').classList.add('hidden');
        
        this.renderPnLTable();
        this.updateMetrics();
        this.updateWarningBanner();
        this.updateInsights();
        this.updateAllCharts();
    },
    
    // Safe UI update with error handling
    safeUpdateUI() {
        try {
            this.renderPnLTable();
            this.updateMetrics();
            this.updateWarningBanner();
            this.updateInsights();
            this.updateAllCharts();
        } catch (error) {
            console.error('UI update failed:', error);
            this.showToast('⚠️ Display update failed. Some data may not be current.', 'error');
        }
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
            const monthlyBurn = Math.abs(metrics.netIncome / 12); // Monthly burn from annual
            burnRateElement.textContent = formatCurrency(monthlyBurn) + '/month';
        }
        
        // Update breakeven amount
        const breakEvenElement = document.getElementById('breakEvenAmount');
        if (breakEvenElement && metrics.operatingIncome < 0) {
            breakEvenElement.textContent = formatCurrency(Math.abs(metrics.operatingIncome));
        }
        
        // Update revenue increase needed
        const revenueIncreaseElement = document.getElementById('revenueIncrease');
        if (revenueIncreaseElement && metrics.operatingIncome < 0) {
            const increaseNeeded = (Math.abs(metrics.operatingIncome) / metrics.revenue * 100);
            revenueIncreaseElement.textContent = `${increaseNeeded.toFixed(1)}%`;
        }
        
        // Update gross margin percentage
        const grossMarginElement = document.getElementById('grossMarginPercent');
        if (grossMarginElement) {
            grossMarginElement.textContent = `${metrics.grossMargin.toFixed(1)}%`;
        }
        
        // Generate dynamic insights
        const insightsContainer = document.querySelector('#insightsBox ul');
        if (insightsContainer && insights.length > 0) {
            insightsContainer.innerHTML = insights.map(insight => `
                <li class="flex items-start gap-2">
                    <span class="${insight.type === 'critical' ? 'text-red-500' : insight.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'} mt-0.5">●</span>
                    <span class="text-gray-300 text-sm">
                        <strong>${insight.category}:</strong> ${insight.message}
                        <br><em class="text-gray-400">${insight.recommendation}</em>
                    </span>
                </li>
            `).join('');
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
        if (!cell || cell.querySelector('input')) return; // Prevent multiple edits
        
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
        input.style.textAlign = 'right';
        
        const commitEdit = () => {
            const newValue = parseInt(input.value.replace(/[^0-9-]/g, '')) || currentValue;
            
            if (newValue !== currentValue) {
                if (childKey) {
                    monthlyData[parentKey].children[childKey][type][monthIndex] = newValue;
                } else {
                    monthlyData[parentKey][type][monthIndex] = newValue;
                }
                
                cell.classList.add('edited-cell');
            }
            
            // Restore original content
            cell.innerHTML = formatCurrency(newValue);
            
            this.renderMonthlyView();
            this.updateAllCharts();
        };
        
        input.onblur = commitEdit;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitEdit();
            } else if (e.key === 'Escape') {
                // Cancel edit
                cell.innerHTML = formatCurrency(currentValue);
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
        
        // Show/hide appropriate sections and charts
        const tableView = document.getElementById('tableView');
        const chartsView = document.getElementById('chartsView');
        
        if (view === 'table') {
            if (tableView) {
                tableView.style.display = 'block';
                tableView.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (chartsView) chartsView.style.display = 'none';
        } else {
            if (tableView) tableView.style.display = 'none';
            if (chartsView) {
                chartsView.style.display = 'block';
                
                // Show only selected chart
                const waterfallContainer = document.querySelector('#waterfallChart').closest('div');
                const trendContainer = document.querySelector('#trendChart').closest('div');
                const expenseContainer = document.querySelector('#expenseBreakdownChart').closest('div');
                const varianceContainer = document.querySelector('#varianceChart').closest('div');
                
                // Hide all charts first
                [waterfallContainer, trendContainer, expenseContainer, varianceContainer].forEach(container => {
                    if (container) container.style.display = 'none';
                });
                
                // Show only selected chart
                if (view === 'waterfall' && waterfallContainer) {
                    waterfallContainer.style.display = 'block';
                    waterfallContainer.parentElement.style.display = 'grid';
                    waterfallContainer.parentElement.style.gridTemplateColumns = '1fr';
                    // Ensure waterfall chart renders
                    setTimeout(() => renderWaterfallChart(calculateKeyMetrics(financialData)), 100);
                } else if (view === 'trend' && trendContainer) {
                    trendContainer.style.display = 'block';
                    trendContainer.parentElement.style.display = 'grid';
                    trendContainer.parentElement.style.gridTemplateColumns = '1fr';
                    // Ensure trend chart renders
                    setTimeout(() => renderTrendChart(monthlyData), 100);
                }
                
                // Smooth scroll to charts without jumping
                chartsView.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            this.updateAllCharts();
        }
    },
    
    // Update all charts
    updateAllCharts() {
        try {
            const metrics = calculateKeyMetrics(financialData);
            updateAllCharts(metrics, monthlyData);
            
            // Force render additional charts with error handling
            setTimeout(() => {
                try {
                    // Check if canvas elements exist
                    const expenseCanvas = document.getElementById('expenseBreakdownChart');
                    const varianceCanvas = document.getElementById('varianceChart');
                    
                    if (expenseCanvas) {
                        const expenseData = {
                            'Sales & Marketing': financialData.opex * 0.45,
                            'R&D': financialData.opex * 0.30,
                            'G&A': financialData.opex * 0.25
                        };
                        renderExpenseBreakdown(expenseData, 'expenseBreakdownChart');
                    }
                    
                    if (varianceCanvas && monthlyData.revenue?.actuals && monthlyData.revenue?.budget) {
                        renderVarianceChart(
                            monthlyData.revenue.actuals, 
                            monthlyData.revenue.budget, 
                            'varianceChart', 
                            'Monthly Revenue: Actual vs Budget'
                        );
                    }
                } catch (chartError) {
                    console.warn('Chart rendering error:', chartError);
                }
            }, 300);
        } catch (error) {
            console.error('Error updating charts:', error);
        }
    },
    
    // Export functions (fully implemented)
    exportToExcel() {
        const wb = XLSX.utils.book_new();
        
        // Create annual P&L data array
        const metrics = calculateKeyMetrics(financialData);
        const annualData = [
            ['P&L Statement', '', '', '', ''],
            ['Generated:', new Date().toLocaleDateString(), '', '', ''],
            ['', '', '', '', ''],
            ['Account', 'Actual', 'Budget', 'Variance', '% of Revenue'],
            ['Revenue', financialData.revenue, budgetData.revenue, 
             financialData.revenue - budgetData.revenue, '100.0%'],
            ['COGS', financialData.cogs, budgetData.cogs,
             financialData.cogs - budgetData.cogs,
             ((financialData.cogs / financialData.revenue) * 100).toFixed(1) + '%'],
            ['Gross Profit', metrics.grossProfit, budgetData.revenue - budgetData.cogs,
             metrics.grossProfit - (budgetData.revenue - budgetData.cogs),
             metrics.grossMargin.toFixed(1) + '%'],
            ['OpEx', financialData.opex, budgetData.opex,
             financialData.opex - budgetData.opex,
             ((financialData.opex / financialData.revenue) * 100).toFixed(1) + '%'],
            ['Operating Income', metrics.operatingIncome, 
             (budgetData.revenue - budgetData.cogs - budgetData.opex),
             metrics.operatingIncome - (budgetData.revenue - budgetData.cogs - budgetData.opex),
             metrics.operatingMargin.toFixed(1) + '%'],
            ['Net Income', metrics.netIncome,
             (budgetData.revenue - budgetData.cogs - budgetData.opex + budgetData.other),
             metrics.netIncome - (budgetData.revenue - budgetData.cogs - budgetData.opex + budgetData.other),
             metrics.netMargin.toFixed(1) + '%']
        ];
        
        // Add monthly data
        const monthlyDataArray = [
            ['Monthly P&L', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            ['Revenue', ...monthlyData.revenue.actuals],
            ['COGS', ...monthlyData.cogs.actuals],
            ['OpEx', ...monthlyData.opex.actuals]
        ];
        
        const ws1 = XLSX.utils.aoa_to_sheet(annualData);
        const ws2 = XLSX.utils.aoa_to_sheet(monthlyDataArray);
        
        XLSX.utils.book_append_sheet(wb, ws1, "Annual P&L");
        XLSX.utils.book_append_sheet(wb, ws2, "Monthly P&L");
        
        XLSX.writeFile(wb, `PL_Statement_${new Date().toISOString().split('T')[0]}.xlsx`);
        this.showToast('✓ Excel file downloaded successfully', 'success');
    },
    
    exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('P&L Statement Report', 14, 22);
        
        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
        
        // Add key metrics
        const metrics = calculateKeyMetrics(financialData);
        doc.setFontSize(14);
        doc.text('Key Metrics', 14, 45);
        doc.setFontSize(10);
        doc.text(`Revenue: ${formatCurrency(financialData.revenue)}`, 14, 55);
        doc.text(`Gross Profit: ${formatCurrency(metrics.grossProfit)} (${metrics.grossMargin.toFixed(1)}%)`, 14, 62);
        doc.text(`Operating Income: ${formatCurrency(metrics.operatingIncome)} (${metrics.operatingMargin.toFixed(1)}%)`, 14, 69);
        doc.text(`Net Income: ${formatCurrency(metrics.netIncome)} (${metrics.netMargin.toFixed(1)}%)`, 14, 76);
        
        // Add variance analysis
        doc.setFontSize(14);
        doc.text('Variance Analysis', 14, 90);
        doc.setFontSize(10);
        const revenueVar = financialData.revenue - budgetData.revenue;
        doc.text(`Revenue Variance: ${formatCurrency(revenueVar)} (${revenueVar > 0 ? 'Favorable' : 'Unfavorable'})`, 14, 100);
        
        const opexVar = financialData.opex - budgetData.opex;
        doc.text(`OpEx Variance: ${formatCurrency(opexVar)} (${opexVar < 0 ? 'Favorable' : 'Unfavorable'})`, 14, 107);
        
        doc.save(`PL_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        this.showToast('✓ PDF report downloaded successfully', 'success');
    },
    
    emailReport() {
        const subject = encodeURIComponent('P&L Statement Report');
        const metrics = calculateKeyMetrics(financialData);
        const revenue = formatCurrency(financialData.revenue);
        const netIncome = formatCurrency(metrics.netIncome);
        
        const body = encodeURIComponent(
            `P&L Statement Summary\n\n` +
            `Period: Q3 2024\n` +
            `Revenue: ${revenue}\n` +
            `Gross Margin: ${metrics.grossMargin.toFixed(1)}%\n` +
            `Operating Margin: ${metrics.operatingMargin.toFixed(1)}%\n` +
            `Net Income: ${netIncome}\n\n` +
            `View full interactive report: ${window.location.href}\n\n` +
            `Generated: ${new Date().toLocaleString()}`
        );
        
        // Try to open email client, but show toast regardless
        try {
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
            this.showToast('✓ Email client opened with P&L report', 'success');
        } catch (e) {
            this.showToast('Email functionality requires a configured email client', 'info');
        }
    },
    
    shareLink() {
        // Save current state to localStorage
        const shareData = {
            financialData: financialData,
            monthlyData: monthlyData,
            hasEdits: this.hasEdits,
            timestamp: Date.now()
        };
        
        localStorage.setItem('sharedPLData', JSON.stringify(shareData));
        
        // Create shareable URL with state parameter
        const baseUrl = window.location.href.split('?')[0];
        const shareUrl = `${baseUrl}?shared=${Date.now()}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            // Show toast notification instead of button change
            this.showToast('✓ Link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback - show the URL in a prompt
            this.showToast('Copy this link: ' + shareUrl, 'info');
        });
    },
    
    // Apply monthly scenarios
    applyMonthlyScenario(scenarioName) {
        const scenarios = {
            'growth': {
                revenue: 1.05,  // 5% growth
                cogs: 1.03,      // 3% increase in COGS
                opex: 1.02       // 2% increase in OpEx
            },
            'cost-cut': {
                revenue: 1.0,    // No change in revenue
                cogs: 0.95,      // 5% reduction in COGS
                opex: 0.90       // 10% reduction in OpEx
            }
        };
        
        const adjustments = scenarios[scenarioName];
        if (!adjustments) return;
        
        // Apply adjustments to each month
        monthlyData.revenue.actuals = monthlyData.revenue.actuals.map(val => Math.round(val * adjustments.revenue));
        monthlyData.cogs.actuals = monthlyData.cogs.actuals.map(val => Math.round(val * adjustments.cogs));
        monthlyData.opex.actuals = monthlyData.opex.actuals.map(val => Math.round(val * adjustments.opex));
        
        // Re-render the monthly view
        this.renderMonthlyView();
        this.updateAllCharts();
        
        // Show scenario applied indicator
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Applied';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    },
    
    // Reset monthly data
    resetMonthlyData() {
        monthlyData = JSON.parse(JSON.stringify(monthlyDataOriginal));
        this.renderMonthlyView();
        this.updateAllCharts();
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast-notification fixed top-6 right-6 px-6 py-3 rounded-lg text-white font-medium z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-emerald-600' : 
            type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },
    
    // Emergency data reset - clears all stored data
    emergencyReset() {
        try {
            localStorage.removeItem('sharedPLData');
            this.initializePeriodData();
            this.loadPeriodData();
            this.hasEdits = false;
            document.getElementById('resetButton').classList.add('hidden');
            this.safeUpdateUI();
            this.showToast('✓ All data reset to original state', 'success');
        } catch (error) {
            console.error('Emergency reset failed:', error);
            window.location.reload();
        }
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

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    PLApp.showToast('⚠️ An error occurred. The page may need to be refreshed.', 'error');
});

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        PLApp.init();
    } catch (error) {
        console.error('Critical initialization error:', error);
        document.body.innerHTML = `
            <div class="fixed inset-0 bg-slate-900 flex items-center justify-center text-white">
                <div class="text-center">
                    <h1 class="text-2xl font-bold mb-4 text-red-400">Application Error</h1>
                    <p class="mb-4">The P&L Statement failed to initialize properly.</p>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }
});
