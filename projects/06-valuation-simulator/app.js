/**
 * Valuation Simulator Application Controller
 */

const VSApp = {
    currentAssumptions: { ...valuationData.assumptions },
    
    init() {
        this.setupSliders();
        this.calculateDCF();
        this.updateCharts();
        console.log('Valuation Simulator initialized');
    },
    
    setupSliders() {
        const sliders = [
            'growthRate', 'growthDecay', 'grossMargin', 'operatingMargin',
            'wacc', 'terminalGrowth', 'taxRate'
        ];
        
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = document.getElementById(sliderId + 'Value');
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    this.currentAssumptions[sliderId] = value;
                    
                    // Update display
                    if (sliderId === 'growthDecay') {
                        valueDisplay.textContent = `${value}%/yr`;
                    } else {
                        valueDisplay.textContent = `${value}%`;
                    }
                    
                    this.calculateDCF();
                    this.updateCharts();
                });
            }
        });
        
        // Revenue input
        const revenueInput = document.getElementById('currentRevenue');
        if (revenueInput) {
            revenueInput.addEventListener('change', (e) => {
                this.currentAssumptions.currentRevenue = parseFloat(e.target.value);
                this.calculateDCF();
                this.updateCharts();
            });
        }
    },
    
    calculateDCF() {
        const assumptions = this.currentAssumptions;
        const projectionYears = 5;
        
        // Calculate revenue projections with declining growth
        const revenues = [];
        let currentGrowth = assumptions.growthRate / 100;
        let revenue = assumptions.currentRevenue;
        
        for (let year = 0; year < projectionYears; year++) {
            revenue = revenue * (1 + currentGrowth);
            revenues.push(revenue);
            
            // Decline growth rate
            currentGrowth = Math.max(
                currentGrowth * (1 - assumptions.growthDecay / 100),
                assumptions.terminalGrowth / 100
            );
        }
        
        // Calculate cash flows
        const cashFlows = revenues.map(rev => {
            const grossProfit = rev * (assumptions.grossMargin / 100);
            const operatingIncome = rev * (assumptions.operatingMargin / 100);
            const taxes = operatingIncome * (assumptions.taxRate / 100);
            const nopat = operatingIncome - taxes;
            const capex = rev * (assumptions.capexPercent / 100);
            const depreciation = rev * (assumptions.depreciationPercent / 100);
            
            return nopat + depreciation - capex;
        });
        
        // Terminal value
        const terminalCashFlow = cashFlows[cashFlows.length - 1] * (1 + assumptions.terminalGrowth / 100);
        const terminalValue = terminalCashFlow / (assumptions.wacc / 100 - assumptions.terminalGrowth / 100);
        
        // Present value calculations
        const discountRate = assumptions.wacc / 100;
        const pvCashFlows = cashFlows.map((cf, index) => cf / Math.pow(1 + discountRate, index + 1));
        const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);
        
        const enterpriseValue = pvCashFlows.reduce((sum, pv) => sum + pv, 0) + pvTerminalValue;
        
        // Calculate metrics
        const evRevenue = enterpriseValue / assumptions.currentRevenue;
        const terminalPercent = (pvTerminalValue / enterpriseValue) * 100;
        const irr = Math.pow(enterpriseValue / assumptions.currentRevenue, 1/5) - 1;
        
        // Update display
        this.updateResults({
            enterpriseValue,
            evRevenue,
            terminalPercent,
            irr: irr * 100,
            revenues,
            cashFlows,
            pvCashFlows,
            pvTerminalValue
        });
        
        this.results = {
            enterpriseValue,
            evRevenue,
            terminalPercent,
            irr: irr * 100,
            revenues,
            cashFlows,
            pvCashFlows,
            pvTerminalValue
        };
    },
    
    updateResults(results) {
        document.getElementById('enterpriseValue').textContent = `$${results.enterpriseValue.toFixed(0)}M`;
        document.getElementById('evRevenue').textContent = `${results.evRevenue.toFixed(1)}x`;
        document.getElementById('terminalPercent').textContent = `${results.terminalPercent.toFixed(0)}%`;
        document.getElementById('irr').textContent = `${results.irr.toFixed(1)}%`;
    },
    
    updateCharts() {
        if (this.results) {
            this.renderDCFChart();
            this.renderSensitivityChart();
            this.renderFootballFieldChart();
        }
    },
    
    renderDCFChart() {
        const ctx = document.getElementById('dcfChart');
        if (!ctx) return;
        
        if (this.dcfChart) {
            this.dcfChart.destroy();
        }
        
        const data = {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Terminal'],
            datasets: [{
                label: 'Present Value ($M)',
                data: [...this.results.pvCashFlows, this.results.pvTerminalValue],
                backgroundColor: [
                    '#10b981', '#10b981', '#10b981', '#10b981', '#10b981', '#3b82f6'
                ],
                borderColor: '#1f2937',
                borderWidth: 1
            }]
        };
        
        this.dcfChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'DCF Components',
                        color: '#f1f5f9'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                }
            }
        });
    },
    
    renderSensitivityChart() {
        const ctx = document.getElementById('sensitivityChart');
        if (!ctx) return;
        
        if (this.sensitivityChart) {
            this.sensitivityChart.destroy();
        }
        
        // Generate sensitivity data
        const baseEV = this.results.enterpriseValue;
        const waccRange = [8, 10, 12, 14, 16];
        const terminalRange = [1, 2, 3, 4, 5];
        
        const sensitivityData = waccRange.map(wacc => {
            return terminalRange.map(terminal => {
                // Simplified sensitivity calculation
                const waccAdjustment = (this.currentAssumptions.wacc - wacc) * 0.1;
                const terminalAdjustment = (terminal - this.currentAssumptions.terminalGrowth) * 0.05;
                return baseEV * (1 + waccAdjustment + terminalAdjustment);
            });
        });
        
        this.sensitivityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: terminalRange.map(t => `${t}%`),
                datasets: waccRange.map((wacc, index) => ({
                    label: `WACC ${wacc}%`,
                    data: sensitivityData[index],
                    borderColor: `hsl(${index * 60}, 70%, 60%)`,
                    backgroundColor: `hsla(${index * 60}, 70%, 60%, 0.1)`,
                    tension: 0.4
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'WACC vs Terminal Growth Sensitivity',
                        color: '#f1f5f9'
                    },
                    legend: {
                        labels: { color: '#94a3b8' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Terminal Growth Rate',
                            color: '#94a3b8'
                        },
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                }
            }
        });
    },
    
    renderFootballFieldChart() {
        const ctx = document.getElementById('footballFieldChart');
        if (!ctx) return;
        
        if (this.footballFieldChart) {
            this.footballFieldChart.destroy();
        }
        
        // Calculate different valuation methods
        const dcfValue = this.results.enterpriseValue;
        const compsMedian = valuationData.comparableCompanies.reduce((sum, comp) => sum + comp.evRevenue, 0) / valuationData.comparableCompanies.length;
        const compsValue = this.currentAssumptions.currentRevenue * compsMedian;
        
        const methods = ['DCF', 'Comps Median', 'Comps 25th %ile', 'Comps 75th %ile'];
        const values = [dcfValue, compsValue, compsValue * 0.85, compsValue * 1.15];
        
        this.footballFieldChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: methods,
                datasets: [{
                    label: 'Valuation ($M)',
                    data: values,
                    backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
                    borderColor: '#1f2937',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Valuation Range (Football Field)',
                        color: '#f1f5f9'
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                }
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    VSApp.init();
});
