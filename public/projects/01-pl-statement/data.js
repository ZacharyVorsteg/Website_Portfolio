/**
 * P&L Statement Data Module
 * Contains all mock financial data and chart of accounts structure
 */

// Chart of Accounts - GAAP Compliant Structure
const chartOfAccounts = {
    revenue: {
        name: 'Revenue',
        level: 0,
        editable: true,
        children: {
            'saas': { name: 'SaaS Revenue', level: 1, percentage: 60 },
            'services': { name: 'Professional Services', level: 1, percentage: 40 }
        }
    },
    cogs: {
        name: 'Cost of Goods Sold',
        level: 0,
        editable: true,
        children: {
            'hosting': { name: 'Cloud Infrastructure', level: 1, percentage: 45 },
            'support': { name: 'Customer Success', level: 1, percentage: 35 },
            'third_party': { name: 'Third-party Licenses', level: 1, percentage: 20 }
        }
    },
    opex: {
        name: 'Operating Expenses',
        level: 0,
        editable: true,
        children: {
            'sales_marketing': { name: 'Sales & Marketing', level: 1, percentage: 45 },
            'rd': { name: 'Research & Development', level: 1, percentage: 30 },
            'ga': { name: 'General & Administrative', level: 1, percentage: 25 }
        }
    },
    other: {
        name: 'Other Income/(Expense)',
        level: 0,
        editable: true,
        children: {
            'interest': { name: 'Interest Income', level: 1, percentage: 80 },
            'fx': { name: 'Foreign Exchange', level: 1, percentage: 20 }
        }
    }
};

// Original financial data (immutable baseline)
const originalData = {
    revenue: 7950000,
    cogs: 2350000,
    opex: 5770000,
    other: -36000
};

// Current financial data (mutable for scenarios)
let financialData = {
    revenue: 7950000,
    cogs: 2350000,
    opex: 5770000,
    other: -36000
};

// Monthly P&L data for 12-month view
const monthlyDataOriginal = {
    revenue: {
        name: 'REVENUE',
        expanded: true,
        actuals: [650000, 680000, 720000, 700000, 750000, 800000, 820000, 850000, 880000, 900000, 920000, 950000],
        budget: [640000, 660000, 700000, 700000, 740000, 780000, 800000, 820000, 850000, 880000, 900000, 920000],
        children: {
            product: {
                name: 'Product Revenue',
                actuals: [520000, 540000, 580000, 600000, 620000, 640000, 660000, 680000, 700000, 720000, 740000, 760000],
                budget: [500000, 520000, 560000, 580000, 600000, 620000, 640000, 660000, 680000, 700000, 720000, 740000]
            },
            services: {
                name: 'Services Revenue',
                actuals: [130000, 140000, 140000, 100000, 130000, 160000, 160000, 170000, 180000, 180000, 180000, 190000],
                budget: [140000, 140000, 140000, 120000, 140000, 160000, 160000, 160000, 170000, 180000, 180000, 180000]
            }
        }
    },
    cogs: {
        name: 'COST OF GOODS SOLD',
        expanded: false,
        actuals: [195000, 204000, 216000, 210000, 225000, 240000, 246000, 255000, 264000, 270000, 276000, 285000],
        budget: [192000, 198000, 210000, 210000, 222000, 234000, 240000, 246000, 255000, 264000, 270000, 276000],
        children: {
            hosting: {
                name: 'Cloud Infrastructure',
                actuals: [87750, 91800, 97200, 94500, 101250, 108000, 110700, 114750, 118800, 121500, 124200, 128250],
                budget: [86400, 89100, 94500, 94500, 99900, 105300, 108000, 110700, 114750, 118800, 121500, 124200]
            },
            support: {
                name: 'Customer Success',
                actuals: [68250, 71400, 75600, 73500, 78750, 84000, 86100, 89250, 92400, 94500, 96600, 99750],
                budget: [67200, 69300, 73500, 73500, 77700, 81900, 84000, 86100, 89250, 92400, 94500, 96600]
            },
            thirdParty: {
                name: 'Third-party Licenses',
                actuals: [39000, 40800, 43200, 42000, 45000, 48000, 49200, 51000, 52800, 54000, 55200, 57000],
                budget: [38400, 39600, 42000, 42000, 44400, 46800, 48000, 49200, 51000, 52800, 54000, 55200]
            }
        }
    },
    opex: {
        name: 'OPERATING EXPENSES',
        expanded: false,
        actuals: [480000, 500000, 520000, 510000, 540000, 570000, 580000, 600000, 620000, 630000, 640000, 660000],
        budget: [470000, 490000, 510000, 510000, 530000, 560000, 570000, 590000, 610000, 630000, 650000, 670000],
        children: {
            salesMarketing: {
                name: 'Sales & Marketing',
                actuals: [216000, 225000, 234000, 229500, 243000, 256500, 261000, 270000, 279000, 283500, 288000, 297000],
                budget: [211500, 220500, 229500, 229500, 238500, 252000, 256500, 265500, 274500, 283500, 292500, 301500]
            },
            rd: {
                name: 'Research & Development',
                actuals: [144000, 150000, 156000, 153000, 162000, 171000, 174000, 180000, 186000, 189000, 192000, 198000],
                budget: [141000, 147000, 153000, 153000, 159000, 168000, 171000, 177000, 183000, 189000, 195000, 201000]
            },
            ga: {
                name: 'General & Administrative',
                actuals: [120000, 125000, 130000, 127500, 135000, 142500, 145000, 150000, 155000, 157500, 160000, 165000],
                budget: [117500, 122500, 127500, 127500, 132500, 140000, 142500, 147500, 152500, 157500, 162500, 167500]
            }
        }
    },
    depreciation: {
        name: 'Depreciation & Amortization',
        actuals: [25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000],
        budget: [25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000]
    },
    stockComp: {
        name: 'Stock-based Compensation',
        actuals: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
        budget: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000]
    },
    nonOperating: {
        name: 'NON-OPERATING INCOME',
        expanded: false,
        children: {
            interest: {
                name: 'Interest Income',
                actuals: [2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600],
                budget: [2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500]
            },
            otherIncome: {
                name: 'Other Income',
                actuals: [1000, 1200, 800, 1500, 900, 1100, 1300, 1000, 1200, 1400, 1100, 1300],
                budget: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
            }
        }
    },
    taxes: {
        name: 'Income Tax Expense',
        actuals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // No taxes due to losses
        budget: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    shares: {
        name: 'Weighted Avg Shares Outstanding',
        actuals: [10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000],
        budget: [10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000, 10000000]
    }
};

// Deep copy for mutable monthly data
let monthlyData = JSON.parse(JSON.stringify(monthlyDataOriginal));

// Prior year data for comparison
const priorYearData = {
    revenue: 7500000,
    cogs: 2100000,
    opex: 5200000,
    other: -45000
};

// Forecast data for comparison
const forecastData = {
    revenue: 8500000,
    cogs: 2380000,
    opex: 5650000,
    other: -50000
};

// Budget data for comparison
const budgetData = {
    revenue: 8200000,
    cogs: 2280000,
    opex: 5600000,
    other: -40000
};

// Quarterly breakdowns
const quarterlyData = {
    q1: { revenue: 2000000, cogs: 600000, opex: 1400000, other: -10000 },
    q2: { revenue: 2200000, cogs: 660000, opex: 1450000, other: -12000 },
    q3: { revenue: 2400000, cogs: 720000, opex: 1500000, other: -15000 },
    ytd: { revenue: 7950000, cogs: 2350000, opex: 5770000, other: -36000 }
};

// Budget vs actual variance thresholds
const varianceThresholds = {
    high: 0.15,    // 15% variance is high
    medium: 0.10,  // 10% variance is medium
    low: 0.05      // 5% variance is low
};

// Scenario configurations
const scenarios = {
    growth: {
        name: 'Growth Case',
        description: '15% revenue increase, 5% OpEx increase',
        adjustments: {
            revenue: 1.15,
            cogs: 1.10,    // Slight increase due to scale
            opex: 1.05,    // Controlled OpEx growth
            other: 1.0
        }
    },
    'cost-cut': {
        name: 'Cost Reduction',
        description: '10% OpEx reduction, maintain revenue',
        adjustments: {
            revenue: 1.0,
            cogs: 1.0,
            opex: 0.90,    // 10% cost reduction
            other: 1.0
        }
    }
};

// Key performance indicators
const kpiTargets = {
    grossMargin: 0.70,      // Target 70% gross margin
    operatingMargin: 0.15,  // Target 15% operating margin
    ebitdaMargin: 0.20,     // Target 20% EBITDA margin
    netMargin: 0.12,        // Target 12% net margin
    burnRate: 500000        // Target monthly burn rate
};

// Export all data objects
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        chartOfAccounts,
        originalData,
        financialData,
        monthlyDataOriginal,
        monthlyData,
        varianceThresholds,
        scenarios,
        kpiTargets
    };
}
