/**
 * P&L Statement Charts Module
 * Contains Chart.js configurations and chart rendering logic
 */

// Chart instances (global references)
let waterfallChart = null;
let trendChart = null;

/**
 * Renders the revenue waterfall chart showing flow from revenue to net income
 * @param {object} metrics - Financial metrics object
 */
function renderWaterfallChart(metrics) {
    const ctx = document.getElementById('waterfallChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (waterfallChart) {
        waterfallChart.destroy();
    }
    
    // Prepare waterfall data
    const waterfallData = [
        { label: 'Revenue', value: metrics.revenue, color: '#10b981' },
        { label: 'COGS', value: -metrics.revenue + metrics.grossProfit, color: '#ef4444' },
        { label: 'Gross Profit', value: metrics.grossProfit, color: '#3b82f6' },
        { label: 'OpEx', value: -metrics.grossProfit + metrics.operatingIncome, color: '#ef4444' },
        { label: 'Operating Income', value: metrics.operatingIncome, color: metrics.operatingIncome >= 0 ? '#10b981' : '#ef4444' },
        { label: 'Other', value: metrics.netIncome - metrics.operatingIncome, color: '#8b5cf6' },
        { label: 'Net Income', value: metrics.netIncome, color: metrics.netIncome >= 0 ? '#10b981' : '#ef4444' }
    ];
    
    // Calculate cumulative values for waterfall effect
    let cumulative = 0;
    const chartData = waterfallData.map((item, index) => {
        const start = cumulative;
        cumulative += item.value;
        
        return {
            label: item.label,
            data: [start, cumulative],
            backgroundColor: item.color,
            borderColor: item.color,
            borderWidth: 1
        };
    });
    
    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: waterfallData.map(item => item.label),
            datasets: [{
                label: 'Financial Flow',
                data: waterfallData.map(item => Math.abs(item.value)),
                backgroundColor: waterfallData.map(item => item.color),
                borderColor: waterfallData.map(item => item.color),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue to Net Income Waterfall',
                    color: '#f1f5f9',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        maxRotation: 45
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                }
            }
        }
    });
}

/**
 * Renders the performance trend chart showing monthly progression
 * @param {object} monthlyData - Monthly financial data
 */
function renderTrendChart(monthlyData) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (trendChart) {
        trendChart.destroy();
    }
    
    // Prepare monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const revenueData = monthlyData.revenue.actuals;
    const grossProfitData = revenueData.map((rev, i) => rev - monthlyData.cogs.actuals[i]);
    const operatingIncomeData = grossProfitData.map((gp, i) => gp - monthlyData.opex.actuals[i]);
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenueData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Gross Profit',
                    data: grossProfitData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Operating Income',
                    data: operatingIncomeData,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Performance Trends',
                    color: '#f1f5f9',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Renders a simple donut chart for expense breakdown
 * @param {object} data - Expense breakdown data
 * @param {string} canvasId - Canvas element ID
 */
function renderExpenseBreakdown(data, canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#ef4444',  // Red
                    '#f59e0b',  // Amber
                    '#10b981',  // Emerald
                    '#3b82f6',  // Blue
                    '#8b5cf6',  // Violet
                    '#ec4899'   // Pink
                ],
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Renders a variance analysis chart comparing actual vs budget
 * @param {array} actualData - Actual monthly values
 * @param {array} budgetData - Budget monthly values
 * @param {string} canvasId - Canvas element ID
 * @param {string} title - Chart title
 */
function renderVarianceChart(actualData, budgetData, canvasId, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Actual',
                    data: actualData,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                },
                {
                    label: 'Budget',
                    data: budgetData,
                    backgroundColor: 'rgba(156, 163, 175, 0.5)',
                    borderColor: '#9ca3af',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#f1f5f9',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    labels: {
                        color: '#94a3b8'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    callbacks: {
                        afterBody: function(tooltipItems) {
                            const actual = tooltipItems[0].parsed.y;
                            const budget = tooltipItems[1] ? tooltipItems[1].parsed.y : 0;
                            const variance = actual - budget;
                            const variancePercent = budget !== 0 ? ((variance / budget) * 100).toFixed(1) : 0;
                            return `Variance: ${formatCurrency(variance, true)} (${variancePercent}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Updates all charts with new data
 * @param {object} metrics - Current financial metrics
 * @param {object} monthlyData - Monthly data object
 */
function updateAllCharts(metrics, monthlyData) {
    renderWaterfallChart(metrics);
    renderTrendChart(monthlyData);
    
    // Render additional charts
    const expenseData = {
        'Sales & Marketing': financialData.opex * 0.45,
        'R&D': financialData.opex * 0.30,
        'G&A': financialData.opex * 0.25
    };
    renderExpenseBreakdown(expenseData, 'expenseBreakdownChart');
    
    // Render variance chart
    renderVarianceChart(
        monthlyData.revenue.actuals, 
        monthlyData.revenue.budget, 
        'varianceChart', 
        'Monthly Revenue: Actual vs Budget'
    );
}

/**
 * Destroys all chart instances (cleanup)
 */
function destroyAllCharts() {
    if (waterfallChart) {
        waterfallChart.destroy();
        waterfallChart = null;
    }
    if (trendChart) {
        trendChart.destroy();
        trendChart = null;
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        renderWaterfallChart,
        renderTrendChart,
        renderExpenseBreakdown,
        renderVarianceChart,
        updateAllCharts,
        destroyAllCharts
    };
}
