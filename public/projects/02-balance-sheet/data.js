/**
 * Balance Sheet Data Module
 * Contains all balance sheet data and account structures
 */

// Balance Sheet Account Structure
const balanceSheetAccounts = {
    assets: {
        current: {
            name: 'Current Assets',
            accounts: {
                cash: { name: 'Cash and Cash Equivalents', current: 2850000, prior: 2100000 },
                receivables: { name: 'Accounts Receivable', current: 1650000, prior: 1420000 },
                inventory: { name: 'Inventory', current: 890000, prior: 760000 },
                prepaid: { name: 'Prepaid Expenses', current: 320000, prior: 280000 },
                shortTermInvestments: { name: 'Short-term Investments', current: 500000, prior: 300000 }
            }
        },
        nonCurrent: {
            name: 'Non-Current Assets',
            accounts: {
                ppe: { name: 'Property, Plant & Equipment', current: 4200000, prior: 3800000 },
                intangible: { name: 'Intangible Assets', current: 1800000, prior: 1600000 },
                goodwill: { name: 'Goodwill', current: 2200000, prior: 2200000 },
                longTermInvestments: { name: 'Long-term Investments', current: 750000, prior: 650000 },
                deferredTax: { name: 'Deferred Tax Assets', current: 180000, prior: 150000 }
            }
        }
    },
    liabilities: {
        current: {
            name: 'Current Liabilities',
            accounts: {
                payables: { name: 'Accounts Payable', current: 980000, prior: 850000 },
                shortTermDebt: { name: 'Short-term Debt', current: 650000, prior: 500000 },
                accruedExpenses: { name: 'Accrued Expenses', current: 420000, prior: 380000 },
                deferredRevenue: { name: 'Deferred Revenue', current: 340000, prior: 290000 },
                currentPortionLTD: { name: 'Current Portion of Long-term Debt', current: 300000, prior: 250000 }
            }
        },
        nonCurrent: {
            name: 'Non-Current Liabilities',
            accounts: {
                longTermDebt: { name: 'Long-term Debt', current: 3200000, prior: 2800000 },
                deferredTaxLiab: { name: 'Deferred Tax Liabilities', current: 280000, prior: 240000 },
                pensionLiab: { name: 'Pension Liabilities', current: 450000, prior: 420000 },
                otherLTLiab: { name: 'Other Long-term Liabilities', current: 180000, prior: 160000 }
            }
        }
    },
    equity: {
        name: 'Shareholders\' Equity',
        accounts: {
            commonStock: { name: 'Common Stock', current: 1000000, prior: 1000000 },
            retainedEarnings: { name: 'Retained Earnings', current: 6890000, prior: 6200000 },
            additionalPaidIn: { name: 'Additional Paid-in Capital', current: 2500000, prior: 2300000 },
            accumulatedOCI: { name: 'Accumulated Other Comprehensive Income', current: -120000, prior: -80000 },
            treasuryStock: { name: 'Treasury Stock', current: -200000, prior: -150000 }
        }
    }
};

// Industry benchmarks for ratio analysis
const industryBenchmarks = {
    saas: {
        currentRatio: { min: 1.5, target: 2.5, max: 4.0 },
        quickRatio: { min: 1.0, target: 1.8, max: 3.0 },
        debtToEquity: { min: 0.1, target: 0.3, max: 0.6 },
        debtToAssets: { min: 0.1, target: 0.25, max: 0.4 }
    },
    manufacturing: {
        currentRatio: { min: 1.2, target: 2.0, max: 3.5 },
        quickRatio: { min: 0.8, target: 1.2, max: 2.0 },
        debtToEquity: { min: 0.2, target: 0.5, max: 1.0 },
        debtToAssets: { min: 0.15, target: 0.35, max: 0.55 }
    },
    retail: {
        currentRatio: { min: 1.0, target: 1.5, max: 2.5 },
        quickRatio: { min: 0.5, target: 0.8, max: 1.5 },
        debtToEquity: { min: 0.3, target: 0.7, max: 1.2 },
        debtToAssets: { min: 0.2, target: 0.4, max: 0.6 }
    }
};

// Additional financial data for calculations
const additionalData = {
    revenue: 15600000, // Annual revenue for turnover calculations
    sharesOutstanding: 10000000, // For per-share calculations
    marketCap: 85000000 // For market-based ratios
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        balanceSheetAccounts,
        industryBenchmarks,
        additionalData
    };
}
