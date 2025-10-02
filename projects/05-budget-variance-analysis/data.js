/**
 * Budget Variance Analysis Data Module
 */

const budgetData = {
    categories: {
        revenue: {
            name: 'Revenue',
            budget: 12500000,
            actual: 11850000,
            subcategories: {
                saas: { name: 'SaaS Revenue', budget: 8750000, actual: 8320000 },
                services: { name: 'Professional Services', budget: 2500000, actual: 2380000 },
                other: { name: 'Other Revenue', budget: 1250000, actual: 1150000 }
            }
        },
        cogs: {
            name: 'Cost of Goods Sold',
            budget: 3750000,
            actual: 4120000,
            subcategories: {
                hosting: { name: 'Cloud Infrastructure', budget: 1687500, actual: 1854000 },
                support: { name: 'Customer Success', budget: 1312500, actual: 1442000 },
                licenses: { name: 'Third-party Licenses', budget: 750000, actual: 824000 }
            }
        },
        sales: {
            name: 'Sales & Marketing',
            budget: 4200000,
            actual: 4680000,
            subcategories: {
                advertising: { name: 'Digital Advertising', budget: 1680000, actual: 1872000 },
                events: { name: 'Events & Conferences', budget: 840000, actual: 936000 },
                salaries: { name: 'Sales Salaries', budget: 1260000, actual: 1404000 },
                tools: { name: 'Sales Tools', budget: 420000, actual: 468000 }
            }
        },
        rd: {
            name: 'Research & Development',
            budget: 2800000,
            actual: 2650000,
            subcategories: {
                salaries: { name: 'Engineering Salaries', budget: 2240000, actual: 2120000 },
                tools: { name: 'Development Tools', budget: 280000, actual: 265000 },
                infrastructure: { name: 'Dev Infrastructure', budget: 280000, actual: 265000 }
            }
        },
        ga: {
            name: 'General & Administrative',
            budget: 1400000,
            actual: 1520000,
            subcategories: {
                salaries: { name: 'Admin Salaries', budget: 840000, actual: 912000 },
                legal: { name: 'Legal & Compliance', budget: 280000, actual: 304000 },
                facilities: { name: 'Facilities', budget: 280000, actual: 304000 }
            }
        }
    },
    thresholds: {
        5: { favorable: 5, unfavorable: -5 },
        10: { favorable: 10, unfavorable: -10 },
        15: { favorable: 15, unfavorable: -15 }
    },
    periods: {
        'current-month': 'October 2024',
        'last-month': 'September 2024',
        'quarter': 'Q3 2024',
        'ytd': 'YTD 2024'
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { budgetData };
}
