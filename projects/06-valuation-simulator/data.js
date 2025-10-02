/**
 * Valuation Simulator Data Module
 */

const valuationData = {
    assumptions: {
        currentRevenue: 50, // $M
        growthRate: 40, // %
        growthDecay: 15, // % per year
        grossMargin: 75, // %
        operatingMargin: 20, // %
        wacc: 12, // %
        terminalGrowth: 3, // %
        taxRate: 25, // %
        capexPercent: 3, // % of revenue
        nwcPercent: 5, // % of revenue change
        depreciationPercent: 2 // % of revenue
    },
    
    comparableCompanies: [
        { name: 'SaaS Co A', evRevenue: 8.5, evEbitda: 45, peRatio: 35 },
        { name: 'SaaS Co B', evRevenue: 12.2, evEbitda: 52, peRatio: 42 },
        { name: 'SaaS Co C', evRevenue: 6.8, evEbitda: 38, peRatio: 28 },
        { name: 'Platform D', evRevenue: 15.1, evEbitda: 65, peRatio: 55 },
        { name: 'Platform E', evRevenue: 9.7, evEbitda: 41, peRatio: 33 }
    ],
    
    sensitivityRanges: {
        wacc: { min: 8, max: 16, step: 1 },
        terminalGrowth: { min: 1, max: 5, step: 0.5 },
        operatingMargin: { min: 15, max: 30, step: 2.5 }
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { valuationData };
}
