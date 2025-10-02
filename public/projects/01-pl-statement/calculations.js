/**
 * P&L Statement Calculations Module
 * Contains all financial calculation logic and validation
 */

/**
 * Formats currency values with proper formatting
 * @param {number} value - The numeric value to format
 * @param {boolean} showSign - Whether to show +/- signs
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, showSign = false) {
    if (value === null || value === undefined || isNaN(value)) {
        return '$0';
    }
    
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.abs(value));
    
    if (showSign && value !== 0) {
        return value > 0 ? '+$' + formatted : '-$' + formatted;
    }
    return '$' + formatted;
}

/**
 * Formats numbers without currency symbol
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted number string
 */
function formatNumber(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Calculates variance between actual and budget
 * @param {number} actual - Actual value
 * @param {number} budget - Budget value
 * @returns {object} Variance object with amount and percentage
 */
function calculateVariance(actual, budget) {
    if (!budget || budget === 0) {
        return { amount: actual, percentage: actual > 0 ? 100 : 0 };
    }
    
    const variance = actual - budget;
    const percentage = (variance / Math.abs(budget)) * 100;
    
    return {
        amount: variance,
        percentage: percentage
    };
}

/**
 * Calculates percentage of revenue for any line item
 * @param {number} value - Line item value
 * @param {number} revenue - Total revenue
 * @returns {number} Percentage of revenue
 */
function calculatePercentOfRevenue(value, revenue) {
    if (!revenue || revenue === 0) return 0;
    return (value / revenue) * 100;
}

/**
 * Calculates gross profit and margin
 * @param {number} revenue - Total revenue
 * @param {number} cogs - Cost of goods sold
 * @returns {object} Gross profit calculations
 */
function calculateGrossProfit(revenue, cogs) {
    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    
    return {
        profit: grossProfit,
        margin: grossMargin
    };
}

/**
 * Calculates operating income and margin
 * @param {number} grossProfit - Gross profit
 * @param {number} opex - Operating expenses
 * @returns {object} Operating income calculations
 */
function calculateOperatingIncome(grossProfit, opex) {
    const operatingIncome = grossProfit - opex;
    const operatingMargin = grossProfit > 0 ? (operatingIncome / grossProfit) * 100 : 0;
    
    return {
        income: operatingIncome,
        margin: operatingMargin
    };
}

/**
 * Calculates EBITDA (simplified - adds back depreciation estimate)
 * @param {number} operatingIncome - Operating income
 * @param {number} depreciation - Depreciation expense (default estimate)
 * @returns {object} EBITDA calculations
 */
function calculateEBITDA(operatingIncome, depreciation = 250000) {
    const ebitda = operatingIncome + depreciation;
    
    return {
        ebitda: ebitda,
        depreciation: depreciation
    };
}

/**
 * Calculates net income
 * @param {number} operatingIncome - Operating income
 * @param {number} otherIncome - Other income/expense
 * @returns {number} Net income
 */
function calculateNetIncome(operatingIncome, otherIncome) {
    return operatingIncome + otherIncome;
}

/**
 * Validates financial data for consistency and accuracy
 * @param {object} data - Financial data object
 * @returns {object} Validation results
 */
function validateFinancialData(data) {
    const errors = [];
    const warnings = [];
    
    // Basic validation
    if (data.revenue <= 0) {
        errors.push('Revenue must be positive');
    }
    
    if (data.cogs < 0) {
        errors.push('COGS cannot be negative');
    }
    
    if (data.cogs > data.revenue) {
        warnings.push('COGS exceeds revenue - negative gross margin');
    }
    
    if (data.opex < 0) {
        errors.push('Operating expenses cannot be negative');
    }
    
    // Calculate key metrics for validation
    const grossProfit = data.revenue - data.cogs;
    const operatingIncome = grossProfit - data.opex;
    
    if (operatingIncome < 0) {
        warnings.push('Operating loss detected - consider cost reduction');
    }
    
    const grossMargin = (grossProfit / data.revenue) * 100;
    if (grossMargin < 20) {
        warnings.push('Low gross margin - below 20%');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings
    };
}

/**
 * Calculates monthly totals from monthly data
 * @param {array} monthlyValues - Array of 12 monthly values
 * @returns {number} YTD total
 */
function calculateYTDTotal(monthlyValues) {
    if (!Array.isArray(monthlyValues)) return 0;
    return monthlyValues.reduce((sum, value) => sum + (value || 0), 0);
}

/**
 * Calculates monthly variance analysis
 * @param {array} actuals - Actual monthly values
 * @param {array} budget - Budget monthly values
 * @returns {object} Monthly variance analysis
 */
function calculateMonthlyVariance(actuals, budget) {
    if (!Array.isArray(actuals) || !Array.isArray(budget)) {
        return { variances: [], ytdVariance: 0 };
    }
    
    const variances = actuals.map((actual, index) => {
        const budgetValue = budget[index] || 0;
        return calculateVariance(actual, budgetValue);
    });
    
    const ytdActual = calculateYTDTotal(actuals);
    const ytdBudget = calculateYTDTotal(budget);
    const ytdVariance = calculateVariance(ytdActual, ytdBudget);
    
    return {
        variances: variances,
        ytdVariance: ytdVariance,
        ytdActual: ytdActual,
        ytdBudget: ytdBudget
    };
}

/**
 * Calculates burn rate and runway
 * @param {number} netIncome - Monthly net income (negative = burn)
 * @param {number} cashBalance - Current cash balance
 * @returns {object} Burn rate analysis
 */
function calculateBurnRate(netIncome, cashBalance = 5000000) {
    const monthlyBurn = Math.abs(netIncome);
    const runway = netIncome >= 0 ? Infinity : cashBalance / monthlyBurn;
    
    return {
        monthlyBurn: monthlyBurn,
        runway: runway,
        breakevenDate: netIncome >= 0 ? null : new Date(Date.now() + (runway * 30 * 24 * 60 * 60 * 1000))
    };
}

/**
 * Applies scenario adjustments to financial data
 * @param {object} baseData - Base financial data
 * @param {object} scenario - Scenario configuration
 * @returns {object} Adjusted financial data
 */
function applyScenario(baseData, scenario) {
    const adjustedData = { ...baseData };
    
    Object.keys(scenario.adjustments).forEach(key => {
        if (adjustedData.hasOwnProperty(key)) {
            adjustedData[key] = Math.round(baseData[key] * scenario.adjustments[key]);
        }
    });
    
    return adjustedData;
}

/**
 * Calculates key financial ratios and metrics
 * @param {object} data - Financial data
 * @returns {object} Key metrics
 */
function calculateKeyMetrics(data) {
    const grossProfit = calculateGrossProfit(data.revenue, data.cogs);
    const operatingIncome = calculateOperatingIncome(grossProfit.profit, data.opex);
    const ebitda = calculateEBITDA(operatingIncome.income);
    const netIncome = calculateNetIncome(operatingIncome.income, data.other);
    
    return {
        revenue: data.revenue,
        grossProfit: grossProfit.profit,
        grossMargin: grossProfit.margin,
        operatingIncome: operatingIncome.income,
        operatingMargin: operatingIncome.margin,
        ebitda: ebitda.ebitda,
        ebitdaMargin: data.revenue > 0 ? (ebitda.ebitda / data.revenue) * 100 : 0,
        netIncome: netIncome,
        netMargin: data.revenue > 0 ? (netIncome / data.revenue) * 100 : 0
    };
}

/**
 * Generates insights based on financial performance
 * @param {object} metrics - Calculated financial metrics
 * @returns {array} Array of insight objects
 */
function generateInsights(metrics) {
    const insights = [];
    
    // Gross margin analysis
    if (metrics.grossMargin < 50) {
        insights.push({
            type: 'warning',
            category: 'Gross Margin',
            message: `Gross margin of ${metrics.grossMargin.toFixed(1)}% is below industry average of 70%`,
            recommendation: 'Consider pricing optimization or cost reduction in COGS'
        });
    }
    
    // Operating efficiency
    if (metrics.operatingIncome < 0) {
        const breakeven = Math.abs(metrics.operatingIncome);
        insights.push({
            type: 'critical',
            category: 'Operating Loss',
            message: `Operating loss of ${formatCurrency(metrics.operatingIncome)}`,
            recommendation: `Need ${formatCurrency(breakeven)} in cost cuts or revenue increase to break even`
        });
    }
    
    // Burn rate analysis
    if (metrics.netIncome < 0) {
        const burnRate = calculateBurnRate(metrics.netIncome);
        insights.push({
            type: 'info',
            category: 'Burn Rate',
            message: `Monthly burn rate: ${formatCurrency(burnRate.monthlyBurn)}`,
            recommendation: `Cash runway: ${burnRate.runway.toFixed(1)} months at current burn`
        });
    }
    
    return insights;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        formatCurrency,
        formatNumber,
        calculateVariance,
        calculatePercentOfRevenue,
        calculateGrossProfit,
        calculateOperatingIncome,
        calculateEBITDA,
        calculateNetIncome,
        validateFinancialData,
        calculateYTDTotal,
        calculateMonthlyVariance,
        calculateBurnRate,
        applyScenario,
        calculateKeyMetrics,
        generateInsights
    };
}
