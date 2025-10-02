/**
 * Working Capital Optimizer Data Module
 */

const workingCapitalData = {
    current: {
        revenue: 50000000, // Annual revenue
        cogs: 30000000,    // Annual COGS
        receivables: 6164000, // Current A/R
        inventory: 4932000,   // Current inventory
        payables: 2466000,    // Current A/P
        dso: 45,  // Days Sales Outstanding
        dio: 60,  // Days Inventory Outstanding
        dpo: 30   // Days Payable Outstanding
    },
    industryBenchmarks: {
        saas: { dso: 35, dio: 15, dpo: 45 },
        manufacturing: { dso: 50, dio: 75, dpo: 35 },
        retail: { dso: 25, dio: 45, dpo: 40 },
        services: { dso: 40, dio: 20, dpo: 35 }
    },
    optimizationGoals: {
        balanced: { dsoTarget: 0.9, dioTarget: 0.85, dpoTarget: 1.2 },
        aggressive: { dsoTarget: 0.75, dioTarget: 0.7, dpoTarget: 1.5 },
        conservative: { dsoTarget: 0.95, dioTarget: 0.9, dpoTarget: 1.1 }
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { workingCapitalData };
}
