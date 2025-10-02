/**
 * Balance Sheet Charts Module
 * Chart.js configurations for balance sheet visualizations
 */

let assetChart = null;
let capitalChart = null;

/**
 * Render asset composition chart
 */
function renderAssetChart() {
    const ctx = document.getElementById('assetChart');
    if (!ctx) return;
    
    if (assetChart) {
        assetChart.destroy();
    }
    
    const currentAssets = calculateCurrentAssets();
    const nonCurrentAssets = calculateTotalAssets() - currentAssets;
    
    assetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Current Assets', 'Non-Current Assets'],
            datasets: [{
                data: [currentAssets, nonCurrentAssets],
                backgroundColor: ['#3b82f6', '#8b5cf6'],
                borderColor: ['#1e40af', '#7c3aed'],
                borderWidth: 2
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
                        padding: 20
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
                            return `${context.label}: $${(context.parsed / 1000000).toFixed(1)}M (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render capital structure chart
 */
function renderCapitalChart() {
    const ctx = document.getElementById('capitalChart');
    if (!ctx) return;
    
    if (capitalChart) {
        capitalChart.destroy();
    }
    
    const totalLiabilities = calculateTotalLiabilities();
    const totalEquity = calculateTotalEquity();
    
    capitalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Liabilities', 'Shareholders\' Equity'],
            datasets: [{
                data: [totalLiabilities, totalEquity],
                backgroundColor: ['#ef4444', '#10b981'],
                borderColor: ['#dc2626', '#059669'],
                borderWidth: 2
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
                        padding: 20
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
                            return `${context.label}: $${(context.parsed / 1000000).toFixed(1)}M (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render ratio trend chart
 */
function renderRatioTrendChart() {
    // Implementation for ratio trends over time
    // Would show historical ratio performance
}

/**
 * Update all charts
 */
function updateAllCharts() {
    renderAssetChart();
    renderCapitalChart();
}

/**
 * Destroy all charts
 */
function destroyAllCharts() {
    if (assetChart) {
        assetChart.destroy();
        assetChart = null;
    }
    if (capitalChart) {
        capitalChart.destroy();
        capitalChart = null;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderAssetChart,
        renderCapitalChart,
        renderRatioTrendChart,
        updateAllCharts,
        destroyAllCharts
    };
}
