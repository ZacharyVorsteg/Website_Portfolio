# Balance Sheet - Interactive Financial Position Dashboard

## Overview
A comprehensive Balance Sheet tool that demonstrates advanced financial analysis capabilities with real-time ratio calculations, balance validation, and professional financial reporting. This interactive dashboard provides instant insights into financial position, liquidity, and capital structure.

## Key Features
- **Real-time Balance Validation**: Automatic verification that Assets = Liabilities + Equity
- **Comprehensive Ratio Analysis**: 12+ financial ratios with industry benchmarks and health indicators
- **Interactive Visualizations**: Asset composition and capital structure charts
- **Multi-period Analysis**: Current vs prior year comparison with variance analysis
- **Professional Formatting**: Multiple display formats (thousands/millions) for executive presentations
- **Industry Benchmarking**: Compare ratios against SaaS, manufacturing, and retail benchmarks

## Technical Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Chart.js for financial visualizations
- **Architecture**: Modular design with separated financial calculations and validation logic

## Core Logic

### Balance Sheet Equation Validation
- **Fundamental Check**: Assets = Liabilities + Shareholders' Equity
- **Tolerance Handling**: Allows $1,000 rounding tolerance for real-world scenarios
- **Real-time Validation**: Instant feedback on balance sheet integrity

### Financial Ratio Calculations
- **Liquidity Ratios**: Current Ratio, Quick Ratio, Cash Ratio
- **Leverage Ratios**: Debt-to-Equity, Debt-to-Assets, Equity Ratio
- **Efficiency Ratios**: Asset Turnover, Working Capital, Book Value per Share
- **Health Assessment**: Industry benchmark comparison with color-coded indicators

## Files Structure
- `index.html` - Main balance sheet interface with ratio dashboard
- `app.js` - Application controller and UI rendering logic
- `data.js` - Balance sheet accounts and industry benchmark data
- `ratios.js` - Financial ratio calculation functions
- `validation.js` - Balance sheet validation and error checking logic
- `charts.js` - Chart.js configurations for asset and capital structure visualization
- `styles.css` - Custom CSS for financial dashboard styling

## How to Run
1. Open `index.html` in any modern web browser
2. No server or build process required - runs entirely client-side
3. View real-time balance validation and ratio calculations
4. Switch between different view modes and formatting options
5. Analyze asset composition and capital structure through interactive charts

## Business Impact
This tool demonstrates sophisticated **financial analysis capabilities** combined with **technical implementation**:

### For CFOs/Finance Teams:
- **Balance Sheet Integrity**: Instant validation prevents accounting errors
- **Ratio Analysis**: Comprehensive financial health assessment with industry benchmarks
- **Liquidity Management**: Real-time working capital and cash position analysis
- **Capital Structure**: Debt-to-equity optimization insights for financing decisions

### For Technical Evaluation:
- **Financial Expertise**: Proper GAAP account structure and ratio calculations
- **Data Validation**: Robust error checking and balance verification
- **Modular Architecture**: Clean separation of calculations, validation, and presentation
- **Professional UI**: Executive-ready dashboard with multiple view modes

## Demo Scenarios
Explore these features:

1. **Balance Validation**: Observe automatic balance checking (Assets = Liabilities + Equity)
2. **Ratio Analysis**: Review 12+ financial ratios with health indicators
3. **View Switching**: Toggle between standard, common-size, and trend views
4. **Format Options**: Switch between thousands and millions display
5. **Visual Analysis**: Examine asset composition and capital structure charts

## Financial Analysis Capabilities
- **Liquidity Assessment**: Current, quick, and cash ratios for short-term financial health
- **Leverage Analysis**: Debt ratios for capital structure optimization
- **Efficiency Metrics**: Asset utilization and working capital management
- **Industry Benchmarking**: Compare performance against sector standards
- **Balance Sheet Validation**: Ensure accounting equation integrity

---

**Built by Zachary Vorsteg** - Showcasing the intersection of fractional CFO expertise with technical development skills.
