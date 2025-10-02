/**
 * P&L Statement Validation Tests
 * Basic validation and testing functions
 */

// Test suite for P&L calculations
const PLTests = {
    
    // Run all tests
    runAllTests() {
        console.log('🧪 Running P&L Statement Tests...');
        
        const tests = [
            this.testFormatCurrency,
            this.testCalculateVariance,
            this.testCalculateGrossProfit,
            this.testCalculateOperatingIncome,
            this.testValidateFinancialData,
            this.testScenarioApplication,
            this.testMonthlyCalculations
        ];
        
        let passed = 0;
        let failed = 0;
        
        tests.forEach(test => {
            try {
                test.call(this);
                console.log(`✅ ${test.name} - PASSED`);
                passed++;
            } catch (error) {
                console.error(`❌ ${test.name} - FAILED:`, error.message);
                failed++;
            }
        });
        
        console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    },
    
    // Test currency formatting
    testFormatCurrency() {
        const tests = [
            { input: 1000000, expected: '$1,000,000' },
            { input: -500000, expected: '$500,000' },
            { input: 0, expected: '$0' },
            { input: 1234.56, expected: '$1,235' }
        ];
        
        tests.forEach(({ input, expected }) => {
            const result = formatCurrency(input);
            if (result !== expected) {
                throw new Error(`Expected ${expected}, got ${result}`);
            }
        });
    },
    
    // Test variance calculations
    testCalculateVariance() {
        const variance1 = calculateVariance(1100, 1000);
        if (variance1.amount !== 100 || Math.abs(variance1.percentage - 10) > 0.01) {
            throw new Error('Variance calculation failed for positive variance');
        }
        
        const variance2 = calculateVariance(900, 1000);
        if (variance2.amount !== -100 || Math.abs(variance2.percentage - (-10)) > 0.01) {
            throw new Error('Variance calculation failed for negative variance');
        }
        
        const variance3 = calculateVariance(1000, 0);
        if (variance3.percentage !== 100) {
            throw new Error('Variance calculation failed for zero budget');
        }
    },
    
    // Test gross profit calculations
    testCalculateGrossProfit() {
        const result = calculateGrossProfit(1000000, 300000);
        
        if (result.profit !== 700000) {
            throw new Error(`Expected gross profit 700000, got ${result.profit}`);
        }
        
        if (Math.abs(result.margin - 70) > 0.01) {
            throw new Error(`Expected gross margin 70%, got ${result.margin}%`);
        }
    },
    
    // Test operating income calculations
    testCalculateOperatingIncome() {
        const result = calculateOperatingIncome(700000, 500000);
        
        if (result.income !== 200000) {
            throw new Error(`Expected operating income 200000, got ${result.income}`);
        }
        
        if (Math.abs(result.margin - 28.57) > 0.1) {
            throw new Error(`Expected operating margin ~28.57%, got ${result.margin}%`);
        }
    },
    
    // Test financial data validation
    testValidateFinancialData() {
        // Valid data
        const validData = {
            revenue: 1000000,
            cogs: 300000,
            opex: 500000,
            other: 10000
        };
        
        const validResult = validateFinancialData(validData);
        if (!validResult.isValid) {
            throw new Error('Valid data failed validation');
        }
        
        // Invalid data - negative revenue
        const invalidData = {
            revenue: -1000000,
            cogs: 300000,
            opex: 500000,
            other: 10000
        };
        
        const invalidResult = validateFinancialData(invalidData);
        if (invalidResult.isValid) {
            throw new Error('Invalid data passed validation');
        }
        
        if (invalidResult.errors.length === 0) {
            throw new Error('Expected validation errors for negative revenue');
        }
    },
    
    // Test scenario application
    testScenarioApplication() {
        const baseData = {
            revenue: 1000000,
            cogs: 300000,
            opex: 500000,
            other: 10000
        };
        
        const growthScenario = {
            adjustments: {
                revenue: 1.15,
                cogs: 1.10,
                opex: 1.05,
                other: 1.0
            }
        };
        
        const result = applyScenario(baseData, growthScenario);
        
        if (result.revenue !== 1150000) {
            throw new Error(`Expected revenue 1150000, got ${result.revenue}`);
        }
        
        if (result.cogs !== 330000) {
            throw new Error(`Expected COGS 330000, got ${result.cogs}`);
        }
        
        if (result.opex !== 525000) {
            throw new Error(`Expected OpEx 525000, got ${result.opex}`);
        }
    },
    
    // Test monthly calculations
    testMonthlyCalculations() {
        const testMonthlyData = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
        
        const ytdTotal = calculateYTDTotal(testMonthlyData);
        const expectedTotal = 7800; // Sum of 100 to 1200
        
        if (ytdTotal !== expectedTotal) {
            throw new Error(`Expected YTD total ${expectedTotal}, got ${ytdTotal}`);
        }
        
        // Test with partial array
        const partialData = [100, 200, 300];
        const partialTotal = calculateYTDTotal(partialData);
        
        if (partialTotal !== 600) {
            throw new Error(`Expected partial total 600, got ${partialTotal}`);
        }
    },
    
    // Test key metrics calculation
    testKeyMetrics() {
        const testData = {
            revenue: 1000000,
            cogs: 300000,
            opex: 500000,
            other: 10000
        };
        
        const metrics = calculateKeyMetrics(testData);
        
        // Check gross profit
        if (metrics.grossProfit !== 700000) {
            throw new Error(`Expected gross profit 700000, got ${metrics.grossProfit}`);
        }
        
        // Check operating income
        if (metrics.operatingIncome !== 200000) {
            throw new Error(`Expected operating income 200000, got ${metrics.operatingIncome}`);
        }
        
        // Check net income
        if (metrics.netIncome !== 210000) {
            throw new Error(`Expected net income 210000, got ${metrics.netIncome}`);
        }
        
        // Check margins
        if (Math.abs(metrics.grossMargin - 70) > 0.01) {
            throw new Error(`Expected gross margin 70%, got ${metrics.grossMargin}%`);
        }
    },
    
    // Validate data integrity
    validateDataIntegrity() {
        // Check that original data is not mutated
        const originalRevenue = originalData.revenue;
        
        // Simulate editing
        financialData.revenue = 2000000;
        
        if (originalData.revenue !== originalRevenue) {
            throw new Error('Original data was mutated - data integrity compromised');
        }
        
        // Reset
        financialData.revenue = originalRevenue;
    },
    
    // Performance test for large calculations
    performanceTest() {
        const startTime = performance.now();
        
        // Run calculations 1000 times
        for (let i = 0; i < 1000; i++) {
            calculateKeyMetrics(financialData);
            calculateVariance(1000 + i, 1000);
            formatCurrency(1000000 + i);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`⚡ Performance test: 1000 calculations completed in ${duration.toFixed(2)}ms`);
        
        // Should complete in under 100ms
        if (duration > 100) {
            console.warn('⚠️ Performance may be suboptimal - calculations took longer than expected');
        }
    }
};

// Auto-run tests in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Run tests after a short delay to ensure all modules are loaded
    setTimeout(() => {
        PLTests.runAllTests();
        PLTests.performanceTest();
    }, 1000);
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PLTests;
}
