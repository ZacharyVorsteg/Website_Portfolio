/**
 * Balance Sheet Ratios Module
 * Financial ratio calculations and analysis
 */

/**
 * Calculate total current assets
 */
function calculateCurrentAssets() {
    const accounts = balanceSheetAccounts.assets.current.accounts;
    return Object.values(accounts).reduce((sum, account) => sum + account.current, 0);
}

/**
 * Calculate total current liabilities
 */
function calculateCurrentLiabilities() {
    const accounts = balanceSheetAccounts.liabilities.current.accounts;
    return Object.values(accounts).reduce((sum, account) => sum + account.current, 0);
}

/**
 * Calculate total assets
 */
function calculateTotalAssets() {
    const currentAssets = calculateCurrentAssets();
    const nonCurrentAccounts = balanceSheetAccounts.assets.nonCurrent.accounts;
    const nonCurrentAssets = Object.values(nonCurrentAccounts).reduce((sum, account) => sum + account.current, 0);
    return currentAssets + nonCurrentAssets;
}

/**
 * Calculate total liabilities
 */
function calculateTotalLiabilities() {
    const currentLiabilities = calculateCurrentLiabilities();
    const nonCurrentAccounts = balanceSheetAccounts.liabilities.nonCurrent.accounts;
    const nonCurrentLiabilities = Object.values(nonCurrentAccounts).reduce((sum, account) => sum + account.current, 0);
    return currentLiabilities + nonCurrentLiabilities;
}

/**
 * Calculate total equity
 */
function calculateTotalEquity() {
    const accounts = balanceSheetAccounts.equity.accounts;
    return Object.values(accounts).reduce((sum, account) => sum + account.current, 0);
}

/**
 * Calculate current ratio
 */
function calculateCurrentRatio() {
    const currentAssets = calculateCurrentAssets();
    const currentLiabilities = calculateCurrentLiabilities();
    return currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
}

/**
 * Calculate quick ratio (acid test)
 */
function calculateQuickRatio() {
    const currentAssets = calculateCurrentAssets();
    const inventory = balanceSheetAccounts.assets.current.accounts.inventory.current;
    const prepaid = balanceSheetAccounts.assets.current.accounts.prepaid.current;
    const quickAssets = currentAssets - inventory - prepaid;
    const currentLiabilities = calculateCurrentLiabilities();
    return currentLiabilities > 0 ? quickAssets / currentLiabilities : 0;
}

/**
 * Calculate cash ratio
 */
function calculateCashRatio() {
    const cash = balanceSheetAccounts.assets.current.accounts.cash.current;
    const shortTermInvestments = balanceSheetAccounts.assets.current.accounts.shortTermInvestments.current;
    const cashEquivalents = cash + shortTermInvestments;
    const currentLiabilities = calculateCurrentLiabilities();
    return currentLiabilities > 0 ? cashEquivalents / currentLiabilities : 0;
}

/**
 * Calculate debt-to-equity ratio
 */
function calculateDebtToEquity() {
    const totalLiabilities = calculateTotalLiabilities();
    const totalEquity = calculateTotalEquity();
    return totalEquity > 0 ? totalLiabilities / totalEquity : 0;
}

/**
 * Calculate debt-to-assets ratio
 */
function calculateDebtToAssets() {
    const totalLiabilities = calculateTotalLiabilities();
    const totalAssets = calculateTotalAssets();
    return totalAssets > 0 ? totalLiabilities / totalAssets : 0;
}

/**
 * Calculate equity ratio
 */
function calculateEquityRatio() {
    const totalEquity = calculateTotalEquity();
    const totalAssets = calculateTotalAssets();
    return totalAssets > 0 ? totalEquity / totalAssets : 0;
}

/**
 * Calculate asset turnover ratio
 */
function calculateAssetTurnover() {
    const totalAssets = calculateTotalAssets();
    return totalAssets > 0 ? additionalData.revenue / totalAssets : 0;
}

/**
 * Calculate working capital
 */
function calculateWorkingCapital() {
    const currentAssets = calculateCurrentAssets();
    const currentLiabilities = calculateCurrentLiabilities();
    return currentAssets - currentLiabilities;
}

/**
 * Calculate book value per share
 */
function calculateBookValuePerShare() {
    const totalEquity = calculateTotalEquity();
    return additionalData.sharesOutstanding > 0 ? totalEquity / additionalData.sharesOutstanding : 0;
}

/**
 * Calculate all ratios
 */
function calculateAllRatios() {
    return {
        currentRatio: calculateCurrentRatio(),
        quickRatio: calculateQuickRatio(),
        cashRatio: calculateCashRatio(),
        debtToEquity: calculateDebtToEquity(),
        debtToAssets: calculateDebtToAssets(),
        equityRatio: calculateEquityRatio(),
        assetTurnover: calculateAssetTurnover(),
        workingCapital: calculateWorkingCapital(),
        bookValuePerShare: calculateBookValuePerShare(),
        totalAssets: calculateTotalAssets(),
        totalLiabilities: calculateTotalLiabilities(),
        totalEquity: calculateTotalEquity()
    };
}

/**
 * Get ratio health status based on industry benchmarks
 */
function getRatioHealth(ratioName, value, industry = 'saas') {
    const benchmarks = industryBenchmarks[industry];
    if (!benchmarks || !benchmarks[ratioName]) return 'neutral';
    
    const { min, target, max } = benchmarks[ratioName];
    
    if (value >= min && value <= max) {
        return value >= target * 0.9 && value <= target * 1.1 ? 'excellent' : 'good';
    } else if (value < min || value > max) {
        return 'warning';
    }
    return 'neutral';
}

/**
 * Format ratio for display
 */
function formatRatio(value, type = 'ratio') {
    if (value === null || value === undefined || isNaN(value)) return '--';
    
    switch (type) {
        case 'ratio':
            return value.toFixed(2);
        case 'percentage':
            return (value * 100).toFixed(1) + '%';
        case 'currency':
            return '$' + (value / 1000000).toFixed(1) + 'M';
        case 'currency_k':
            return '$' + (value / 1000).toFixed(0) + 'K';
        default:
            return value.toFixed(2);
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateCurrentAssets,
        calculateCurrentLiabilities,
        calculateTotalAssets,
        calculateTotalLiabilities,
        calculateTotalEquity,
        calculateCurrentRatio,
        calculateQuickRatio,
        calculateCashRatio,
        calculateDebtToEquity,
        calculateDebtToAssets,
        calculateEquityRatio,
        calculateAssetTurnover,
        calculateWorkingCapital,
        calculateBookValuePerShare,
        calculateAllRatios,
        getRatioHealth,
        formatRatio
    };
}
