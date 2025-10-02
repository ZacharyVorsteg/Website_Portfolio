# P&L Statement - Interactive Financial Dashboard

## Overview
A comprehensive Income Statement (P&L) tool that demonstrates advanced financial modeling capabilities combined with modern web development. This interactive dashboard allows real-time editing of financial data with immediate impact analysis, GAAP-compliant account hierarchies, and professional-grade financial reporting.

## Key Features
- **Real-time Financial Modeling**: Click any revenue or expense figure to edit and see immediate impact on all calculations
- **GAAP-Compliant Structure**: Proper chart of accounts with hierarchical categorization (Revenue → COGS → Gross Profit → OpEx → Operating Income → Net Income)
- **Scenario Analysis**: Pre-built growth and cost-cutting scenarios with one-click application
- **12-Month View**: Complete monthly P&L with budget vs actual variance analysis
- **Smart Insights**: Automated financial analysis with burn rate calculations and breakeven recommendations
- **Interactive Visualizations**: Waterfall charts showing revenue flow and trend analysis
- **Professional Export**: PDF, Excel, and email reporting capabilities (UI ready)

## Technical Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Chart.js for interactive financial visualizations
- **Architecture**: Modular design with separated concerns (data, calculations, charts, UI)

## Core Logic

### Financial Calculations
- **Gross Profit**: Revenue - Cost of Goods Sold
- **Operating Income**: Gross Profit - Operating Expenses  
- **EBITDA**: Operating Income + Depreciation & Amortization
- **Net Income**: Operating Income + Other Income/Expenses
- **Variance Analysis**: (Actual - Budget) / Budget * 100
- **Burn Rate**: Monthly cash consumption based on net loss

### Key Algorithms
- **Hierarchical Account Expansion**: Dynamic rendering of sub-accounts with percentage allocation
- **Real-time Recalculation**: Cascading updates through entire P&L when any value changes
- **Variance Classification**: Automatic color-coding based on performance thresholds (>15% = high variance)
- **Breakeven Analysis**: Calculates exact amount needed in cost cuts or revenue increase

## Files Structure
- `index.html` - Main application interface with responsive layout
- `app.js` - Application controller and UI orchestration logic
- `data.js` - Financial data models and chart of accounts structure
- `calculations.js` - All financial calculation functions and validation
- `charts.js` - Chart.js configurations for waterfall and trend visualizations
- `styles.css` - Custom CSS for financial dashboard styling

## How to Run
1. Open `index.html` in any modern web browser
2. No server or build process required - runs entirely client-side
3. Click on revenue/expense values to edit and see real-time impact
4. Use scenario buttons for quick "what-if" analysis
5. Toggle to 12-month view for detailed monthly breakdown

## Business Impact
This tool demonstrates the intersection of **financial expertise** and **technical execution**:

### For CFOs/Finance Teams:
- **Time Savings**: Reduces monthly P&L analysis from hours to minutes
- **Scenario Planning**: Instant modeling of growth cases and cost reduction initiatives  
- **Variance Analysis**: Automated identification of budget deviations requiring attention
- **Cash Management**: Real-time burn rate and runway calculations for liquidity planning

### For Technical Evaluation:
- **Code Quality**: Clean, modular architecture with separated concerns
- **User Experience**: Intuitive interface with professional financial dashboard design
- **Performance**: Optimized calculations with smooth real-time updates
- **Scalability**: Extensible structure for additional financial statements and metrics

## Demo Scenarios
Try these scenarios to see the tool in action:

1. **Growth Case**: Click "Growth Case (+15%)" to model revenue expansion impact
2. **Cost Cutting**: Click "Cut Costs (-10%)" to see breakeven improvement  
3. **Manual Editing**: Click on any revenue/expense number to input custom values
4. **Monthly Analysis**: Toggle "12-Month View" for detailed monthly variance analysis

## Financial Modeling Expertise Demonstrated
- GAAP-compliant financial statement structure
- Professional variance analysis with threshold-based alerting
- Cash flow and burn rate modeling for startup/growth company scenarios
- Automated financial ratio calculations (gross margin, operating margin, etc.)
- Scenario planning and sensitivity analysis capabilities

---

**Built by Zachary Vorsteg** - Demonstrating the unique combination of fractional CFO expertise with full-stack development capabilities.
