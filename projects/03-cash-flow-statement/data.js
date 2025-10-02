/**
 * Cash Flow Statement Data Module
 */

const cashFlowData = {
    operating: {
        indirect: {
            netIncome: { q3: 1250000, q2: 1180000, q1: 1050000 },
            depreciation: { q3: 320000, q2: 315000, q1: 310000 },
            amortization: { q3: 180000, q2: 175000, q1: 170000 },
            stockCompensation: { q3: 220000, q2: 210000, q1: 200000 },
            changeInReceivables: { q3: -150000, q2: -120000, q1: -100000 },
            changeInInventory: { q3: -80000, q2: -60000, q1: -40000 },
            changeInPayables: { q3: 90000, q2: 70000, q1: 50000 },
            changeInAccrued: { q3: 45000, q2: 35000, q1: 25000 },
            deferredTax: { q3: -25000, q2: -20000, q1: -15000 }
        },
        direct: {
            cashFromCustomers: { q3: 8200000, q2: 7800000, q1: 7400000 },
            cashToSuppliers: { q3: -2800000, q2: -2650000, q1: -2500000 },
            cashToEmployees: { q3: -3200000, q2: -3050000, q1: -2900000 },
            interestPaid: { q3: -180000, q2: -175000, q1: -170000 },
            taxesPaid: { q3: -320000, q2: -305000, q1: -290000 },
            otherOperating: { q3: 150000, q2: 140000, q1: 130000 }
        }
    },
    investing: {
        capex: { q3: -450000, q2: -420000, q1: -380000 },
        acquisitions: { q3: -1200000, q2: 0, q1: 0 },
        investmentPurchases: { q3: -300000, q2: -250000, q1: -200000 },
        investmentSales: { q3: 150000, q2: 100000, q1: 80000 },
        assetSales: { q3: 80000, q2: 60000, q1: 40000 }
    },
    financing: {
        debtProceeds: { q3: 500000, q2: 0, q1: 1000000 },
        debtRepayments: { q3: -200000, q2: -180000, q1: -160000 },
        equityIssuance: { q3: 0, q2: 0, q1: 2000000 },
        dividendsPaid: { q3: -150000, q2: -150000, q1: -150000 },
        shareRepurchases: { q3: -100000, q2: -80000, q1: -60000 }
    },
    cash: {
        beginning: { q3: 2100000, q2: 1850000, q1: 1200000 },
        ending: { q3: 2850000, q2: 2100000, q1: 1850000 }
    }
};

// Cash flow categories for display
const cashFlowCategories = {
    operating: {
        name: 'Operating Activities',
        color: '#10b981',
        items: [
            'netIncome', 'depreciation', 'amortization', 'stockCompensation',
            'changeInReceivables', 'changeInInventory', 'changeInPayables',
            'changeInAccrued', 'deferredTax'
        ]
    },
    investing: {
        name: 'Investing Activities',
        color: '#3b82f6',
        items: ['capex', 'acquisitions', 'investmentPurchases', 'investmentSales', 'assetSales']
    },
    financing: {
        name: 'Financing Activities',
        color: '#8b5cf6',
        items: ['debtProceeds', 'debtRepayments', 'equityIssuance', 'dividendsPaid', 'shareRepurchases']
    }
};

// Line item labels
const lineItemLabels = {
    // Operating - Indirect
    netIncome: 'Net Income',
    depreciation: 'Depreciation',
    amortization: 'Amortization',
    stockCompensation: 'Stock-based Compensation',
    changeInReceivables: 'Change in Accounts Receivable',
    changeInInventory: 'Change in Inventory',
    changeInPayables: 'Change in Accounts Payable',
    changeInAccrued: 'Change in Accrued Expenses',
    deferredTax: 'Deferred Tax Assets/Liabilities',
    
    // Operating - Direct
    cashFromCustomers: 'Cash Received from Customers',
    cashToSuppliers: 'Cash Paid to Suppliers',
    cashToEmployees: 'Cash Paid to Employees',
    interestPaid: 'Interest Paid',
    taxesPaid: 'Income Taxes Paid',
    otherOperating: 'Other Operating Activities',
    
    // Investing
    capex: 'Capital Expenditures',
    acquisitions: 'Business Acquisitions',
    investmentPurchases: 'Investment Purchases',
    investmentSales: 'Investment Sales',
    assetSales: 'Asset Disposals',
    
    // Financing
    debtProceeds: 'Debt Proceeds',
    debtRepayments: 'Debt Repayments',
    equityIssuance: 'Equity Issuance',
    dividendsPaid: 'Dividends Paid',
    shareRepurchases: 'Share Repurchases'
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cashFlowData,
        cashFlowCategories,
        lineItemLabels
    };
}
