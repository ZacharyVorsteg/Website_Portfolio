/**
 * Balance Sheet Validation Module
 * Validation logic and balance checking
 */

/**
 * Validate balance sheet equation: Assets = Liabilities + Equity
 */
function validateBalanceSheet() {
    const totalAssets = calculateTotalAssets();
    const totalLiabilities = calculateTotalLiabilities();
    const totalEquity = calculateTotalEquity();
    const totalLiabEquity = totalLiabilities + totalEquity;
    
    const difference = Math.abs(totalAssets - totalLiabEquity);
    const tolerance = 1000; // $1,000 tolerance for rounding
    
    return {
        isBalanced: difference <= tolerance,
        totalAssets: totalAssets,
        totalLiabEquity: totalLiabEquity,
        difference: difference,
        tolerance: tolerance
    };
}

/**
 * Validate individual account values
 */
function validateAccountValues() {
    const errors = [];
    const warnings = [];
    
    // Check for negative values where they shouldn't exist
    const checkNegative = (accounts, section) => {
        Object.entries(accounts).forEach(([key, account]) => {
            if (account.current < 0 && key !== 'accumulatedOCI' && key !== 'treasuryStock') {
                errors.push(`${account.name} cannot be negative`);
            }
        });
    };
    
    // Check current assets
    checkNegative(balanceSheetAccounts.assets.current.accounts, 'Current Assets');
    checkNegative(balanceSheetAccounts.assets.nonCurrent.accounts, 'Non-Current Assets');
    checkNegative(balanceSheetAccounts.liabilities.current.accounts, 'Current Liabilities');
    checkNegative(balanceSheetAccounts.liabilities.nonCurrent.accounts, 'Non-Current Liabilities');
    
    // Check for unrealistic ratios
    const ratios = calculateAllRatios();
    
    if (ratios.currentRatio < 0.5) {
        warnings.push('Current ratio below 0.5 indicates severe liquidity issues');
    }
    
    if (ratios.debtToEquity > 3.0) {
        warnings.push('Debt-to-equity ratio above 3.0 indicates high leverage risk');
    }
    
    if (ratios.workingCapital < 0) {
        warnings.push('Negative working capital indicates potential cash flow issues');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings
    };
}

/**
 * Validate data consistency across periods
 */
function validatePeriodConsistency() {
    const warnings = [];
    
    // Check for unusual period-over-period changes
    const checkChange = (accounts, sectionName) => {
        Object.entries(accounts).forEach(([key, account]) => {
            if (account.prior > 0) {
                const change = Math.abs((account.current - account.prior) / account.prior);
                if (change > 0.5) { // 50% change threshold
                    warnings.push(`${account.name} changed by ${(change * 100).toFixed(1)}% from prior period`);
                }
            }
        });
    };
    
    checkChange(balanceSheetAccounts.assets.current.accounts, 'Current Assets');
    checkChange(balanceSheetAccounts.assets.nonCurrent.accounts, 'Non-Current Assets');
    checkChange(balanceSheetAccounts.liabilities.current.accounts, 'Current Liabilities');
    checkChange(balanceSheetAccounts.liabilities.nonCurrent.accounts, 'Non-Current Liabilities');
    checkChange(balanceSheetAccounts.equity.accounts, 'Equity');
    
    return {
        warnings: warnings
    };
}

/**
 * Comprehensive validation
 */
function performComprehensiveValidation() {
    const balanceValidation = validateBalanceSheet();
    const accountValidation = validateAccountValues();
    const consistencyValidation = validatePeriodConsistency();
    
    return {
        balance: balanceValidation,
        accounts: accountValidation,
        consistency: consistencyValidation,
        overallValid: balanceValidation.isBalanced && accountValidation.isValid
    };
}

/**
 * Get validation status for UI display
 */
function getValidationStatus() {
    const validation = performComprehensiveValidation();
    
    if (validation.overallValid) {
        return {
            status: 'success',
            message: 'Balance sheet is valid and balanced',
            class: 'text-emerald-400'
        };
    } else if (validation.balance.isBalanced && !validation.accounts.isValid) {
        return {
            status: 'warning',
            message: 'Balance sheet balances but has account issues',
            class: 'text-yellow-400'
        };
    } else {
        return {
            status: 'error',
            message: 'Balance sheet has critical errors',
            class: 'text-red-400'
        };
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateBalanceSheet,
        validateAccountValues,
        validatePeriodConsistency,
        performComprehensiveValidation,
        getValidationStatus
    };
}
