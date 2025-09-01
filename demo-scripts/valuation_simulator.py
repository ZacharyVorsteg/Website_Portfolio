#!/usr/bin/env python3
"""
Valuation Simulator (DCF + Multiples)
Author: Zachary Vorsteg
Description: Interactive financial valuation tool demonstrating DCF and multiples analysis.
             All data is synthetic/mock - no external dependencies required.
             
Run: streamlit run valuation_simulator.py
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

# Page config
st.set_page_config(
    page_title="Valuation Simulator | CFO Demo",
    page_icon="💰",
    layout="wide"
)

# Professional header
st.title("🏦 Valuation Simulator (DCF + Multiples)")
st.markdown("""
**Demo Purpose:** Interactive valuation tool showcasing financial modeling expertise combined with 
full-stack development skills. Calculates enterprise value using DCF and comparable company analysis.
""")

# Sidebar inputs
st.sidebar.header("📊 Company Assumptions")

col1, col2 = st.sidebar.columns(2)
with col1:
    current_revenue = st.number_input("Current Revenue ($M)", 10, 1000, 50, 5)
    growth_rate_y1 = st.slider("Year 1 Growth %", 0, 100, 30)
    growth_rate_y2 = st.slider("Year 2 Growth %", 0, 100, 25)
    growth_rate_y3 = st.slider("Year 3 Growth %", 0, 100, 20)
    
with col2:
    growth_rate_y4 = st.slider("Year 4 Growth %", 0, 100, 15)
    growth_rate_y5 = st.slider("Year 5 Growth %", 0, 100, 10)
    terminal_growth = st.slider("Terminal Growth %", 0, 10, 3)
    ebitda_margin = st.slider("EBITDA Margin %", 5, 50, 25)

st.sidebar.header("💵 Financial Parameters")
wacc = st.sidebar.slider("WACC %", 5, 20, 10)
tax_rate = st.sidebar.slider("Tax Rate %", 15, 35, 21)
capex_percent = st.sidebar.slider("CapEx % of Revenue", 2, 15, 5)
nwc_percent = st.sidebar.slider("NWC % of Revenue", 5, 25, 10)

# DCF Calculation
def calculate_dcf():
    """Calculate DCF valuation with all components"""
    
    # Revenue projections
    revenues = [current_revenue]
    growth_rates = [growth_rate_y1, growth_rate_y2, growth_rate_y3, growth_rate_y4, growth_rate_y5]
    
    for rate in growth_rates:
        revenues.append(revenues[-1] * (1 + rate/100))
    
    # EBITDA & Free Cash Flow
    years = list(range(datetime.now().year, datetime.now().year + 6))
    ebitda = [rev * ebitda_margin/100 for rev in revenues]
    taxes = [ebit * tax_rate/100 for ebit in ebitda]
    capex = [rev * capex_percent/100 for rev in revenues]
    nwc_change = [0] + [revenues[i] * nwc_percent/100 - revenues[i-1] * nwc_percent/100 
                        for i in range(1, len(revenues))]
    
    fcf = []
    for i in range(len(revenues)):
        fcf_value = ebitda[i] - taxes[i] - capex[i] - nwc_change[i]
        fcf.append(fcf_value)
    
    # Terminal Value
    terminal_fcf = fcf[-1] * (1 + terminal_growth/100)
    terminal_value = terminal_fcf / (wacc/100 - terminal_growth/100)
    
    # Present Value
    discount_factors = [(1 + wacc/100) ** -i for i in range(1, 6)]
    pv_fcf = [fcf[i+1] * discount_factors[i] for i in range(5)]
    pv_terminal = terminal_value * discount_factors[-1]
    
    enterprise_value = sum(pv_fcf) + pv_terminal
    
    # Create detailed DataFrame
    df = pd.DataFrame({
        'Year': years,
        'Revenue': revenues,
        'EBITDA': ebitda,
        'Taxes': taxes,
        'CapEx': capex,
        'NWC Change': nwc_change,
        'FCF': fcf
    })
    
    return enterprise_value, df, pv_fcf, pv_terminal, terminal_value

# Comparable Companies Analysis
def generate_comps():
    """Generate synthetic comparable company data"""
    np.random.seed(42)
    
    companies = ['TechCo A', 'TechCo B', 'TechCo C', 'SaaS D', 'SaaS E', 
                 'Platform F', 'Platform G', 'Enterprise H']
    
    # Generate correlated multiples
    ev_revenue = np.random.normal(5, 1.5, len(companies))
    ev_ebitda = ev_revenue * 4 + np.random.normal(0, 2, len(companies))
    pe_ratio = ev_ebitda * 1.5 + np.random.normal(0, 3, len(companies))
    
    comps_df = pd.DataFrame({
        'Company': companies,
        'EV/Revenue': np.maximum(1, ev_revenue),
        'EV/EBITDA': np.maximum(5, ev_ebitda),
        'P/E Ratio': np.maximum(10, pe_ratio),
        'Revenue Growth %': np.random.uniform(15, 45, len(companies))
    })
    
    return comps_df

# Main calculation
enterprise_value, dcf_df, pv_fcf, pv_terminal, terminal_value = calculate_dcf()
comps_df = generate_comps()

# Display layout
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Enterprise Value (DCF)", f"${enterprise_value:.1f}M", 
              f"{(enterprise_value/current_revenue):.1f}x Revenue")

with col2:
    median_multiple = comps_df['EV/Revenue'].median()
    comp_value = current_revenue * median_multiple
    st.metric("Enterprise Value (Comps)", f"${comp_value:.1f}M",
              f"{median_multiple:.1f}x Revenue (median)")

with col3:
    implied_multiple = enterprise_value / current_revenue
    st.metric("Implied EV/Revenue", f"{implied_multiple:.1f}x",
              f"{'Premium' if implied_multiple > median_multiple else 'Discount'}")

with col4:
    irr = ((enterprise_value / current_revenue) ** (1/5) - 1) * 100
    st.metric("5-Year IRR", f"{irr:.1f}%",
              "Based on DCF")

# Tabs for different views
tab1, tab2, tab3, tab4 = st.tabs(["📈 DCF Analysis", "🏢 Comparable Companies", 
                                   "📊 Sensitivity Analysis", "📋 Summary Report"])

with tab1:
    st.subheader("Discounted Cash Flow Analysis")
    
    # FCF Projection Chart
    fig_fcf = go.Figure()
    fig_fcf.add_trace(go.Bar(
        x=dcf_df['Year'],
        y=dcf_df['FCF'],
        name='Free Cash Flow',
        marker_color='lightblue'
    ))
    fig_fcf.add_trace(go.Scatter(
        x=dcf_df['Year'],
        y=dcf_df['Revenue'],
        name='Revenue',
        mode='lines+markers',
        yaxis='y2',
        marker_color='darkgreen'
    ))
    fig_fcf.update_layout(
        title="Revenue & FCF Projections",
        yaxis=dict(title="FCF ($M)"),
        yaxis2=dict(title="Revenue ($M)", overlaying='y', side='right'),
        hovermode='x unified',
        height=400
    )
    st.plotly_chart(fig_fcf, use_container_width=True)
    
    # DCF Table
    st.dataframe(
        dcf_df.style.format({
            'Revenue': '${:.1f}M',
            'EBITDA': '${:.1f}M',
            'Taxes': '${:.1f}M',
            'CapEx': '${:.1f}M',
            'NWC Change': '${:.1f}M',
            'FCF': '${:.1f}M'
        }),
        use_container_width=True
    )
    
    # Valuation Bridge
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Valuation Components")
        bridge_data = pd.DataFrame({
            'Component': ['PV of FCF (Years 1-5)', 'PV of Terminal Value', 'Enterprise Value'],
            'Value': [sum(pv_fcf), pv_terminal, enterprise_value]
        })
        fig_bridge = px.bar(bridge_data, x='Component', y='Value', 
                           title="DCF Value Bridge",
                           color='Component')
        st.plotly_chart(fig_bridge, use_container_width=True)
    
    with col2:
        st.subheader("Key Assumptions Impact")
        st.info(f"""
        **Terminal Value:** ${terminal_value:.1f}M ({terminal_growth}% perpetual growth)  
        **WACC:** {wacc}% (discount rate)  
        **Exit Multiple:** {(terminal_value/dcf_df['EBITDA'].iloc[-1]):.1f}x EBITDA  
        **FCF Conversion:** {(dcf_df['FCF'].iloc[-1]/dcf_df['EBITDA'].iloc[-1]*100):.1f}%
        """)

with tab2:
    st.subheader("Comparable Company Analysis")
    
    # Comps table
    st.dataframe(
        comps_df.style.format({
            'EV/Revenue': '{:.1f}x',
            'EV/EBITDA': '{:.1f}x',
            'P/E Ratio': '{:.1f}x',
            'Revenue Growth %': '{:.1f}%'
        }).background_gradient(cmap='RdYlGn', subset=['EV/Revenue', 'EV/EBITDA']),
        use_container_width=True
    )
    
    # Multiples distribution
    fig_multiples = go.Figure()
    fig_multiples.add_trace(go.Box(y=comps_df['EV/Revenue'], name='EV/Revenue'))
    fig_multiples.add_trace(go.Box(y=comps_df['EV/EBITDA'], name='EV/EBITDA'))
    fig_multiples.add_trace(go.Box(y=comps_df['P/E Ratio'], name='P/E Ratio'))
    fig_multiples.update_layout(
        title="Trading Multiples Distribution",
        yaxis_title="Multiple",
        showlegend=False,
        height=400
    )
    st.plotly_chart(fig_multiples, use_container_width=True)
    
    # Regression analysis
    fig_regression = px.scatter(comps_df, x='Revenue Growth %', y='EV/Revenue',
                               text='Company', trendline="ols",
                               title="Growth vs Valuation Multiple")
    fig_regression.update_traces(textposition='top center')
    st.plotly_chart(fig_regression, use_container_width=True)

with tab3:
    st.subheader("Sensitivity Analysis")
    
    # Create sensitivity matrix
    wacc_range = np.arange(wacc-2, wacc+3, 1)
    terminal_range = np.arange(terminal_growth-2, terminal_growth+3, 1)
    
    sensitivity_matrix = []
    for w in wacc_range:
        row = []
        for t in terminal_range:
            # Simplified DCF calc for sensitivity
            terminal_fcf = dcf_df['FCF'].iloc[-1] * (1 + t/100)
            tv = terminal_fcf / (w/100 - t/100) if w > t else 0
            discount = (1 + w/100) ** -5
            ev = sum(pv_fcf) + tv * discount
            row.append(ev)
        sensitivity_matrix.append(row)
    
    # Heatmap
    fig_heatmap = go.Figure(data=go.Heatmap(
        z=sensitivity_matrix,
        x=[f"{t}%" for t in terminal_range],
        y=[f"{w}%" for w in wacc_range],
        colorscale='RdYlGn',
        text=[[f"${val:.0f}M" for val in row] for row in sensitivity_matrix],
        texttemplate="%{text}",
        textfont={"size": 10}
    ))
    fig_heatmap.update_layout(
        title="Valuation Sensitivity: WACC vs Terminal Growth",
        xaxis_title="Terminal Growth Rate",
        yaxis_title="WACC",
        height=400
    )
    st.plotly_chart(fig_heatmap, use_container_width=True)
    
    # Tornado chart for key drivers
    st.subheader("Key Value Drivers")
    
    base_value = enterprise_value
    drivers = {
        'EBITDA Margin +5%': base_value * 1.2,
        'Revenue Growth +10%': base_value * 1.15,
        'WACC -1%': base_value * 1.1,
        'Terminal Growth +1%': base_value * 1.08,
        'CapEx -2%': base_value * 1.05
    }
    
    tornado_df = pd.DataFrame({
        'Driver': list(drivers.keys()),
        'Impact': [v - base_value for v in drivers.values()]
    }).sort_values('Impact')
    
    fig_tornado = px.bar(tornado_df, x='Impact', y='Driver', orientation='h',
                         title="Value Driver Sensitivity ($ Impact)",
                         color='Impact', color_continuous_scale='RdYlGn')
    st.plotly_chart(fig_tornado, use_container_width=True)

with tab4:
    st.subheader("Executive Summary Report")
    
    # Summary metrics in columns
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📊 Valuation Summary")
        st.markdown(f"""
        **DCF Enterprise Value:** ${enterprise_value:.1f}M  
        **Comps-Based Value:** ${comp_value:.1f}M  
        **Implied Share Price:** ${(enterprise_value/10):.2f} (assuming 10M shares)  
        
        **Key Multiples:**
        - EV/Revenue: {(enterprise_value/current_revenue):.1f}x
        - EV/EBITDA: {(enterprise_value/(current_revenue*ebitda_margin/100)):.1f}x
        - PEG Ratio: {(enterprise_value/current_revenue/growth_rate_y1):.2f}
        """)
        
    with col2:
        st.markdown("### 💡 Investment Highlights")
        
        # Generate dynamic insights
        if growth_rate_y1 > 25:
            growth_insight = "✅ High growth trajectory supports premium valuation"
        else:
            growth_insight = "⚠️ Moderate growth may limit multiple expansion"
            
        if ebitda_margin > 30:
            margin_insight = "✅ Strong profitability profile"
        else:
            margin_insight = "⚠️ Margin improvement opportunity"
            
        if implied_multiple > median_multiple:
            valuation_insight = "📈 Trading above peer median - growth justified"
        else:
            valuation_insight = "📉 Attractive entry point vs peers"
        
        st.markdown(f"""
        {growth_insight}  
        {margin_insight}  
        {valuation_insight}  
        
        **Risk Factors:**
        - Terminal value represents {(pv_terminal/enterprise_value*100):.0f}% of total value
        - Sensitive to WACC assumptions (±1% = ±${abs(enterprise_value*0.1):.0f}M)
        """)
    
    # Download button for report
    st.markdown("---")
    report_data = {
        'Enterprise Value (DCF)': f'${enterprise_value:.1f}M',
        'Revenue Multiple': f'{(enterprise_value/current_revenue):.1f}x',
        'EBITDA Multiple': f'{(enterprise_value/(current_revenue*ebitda_margin/100)):.1f}x',
        '5-Year IRR': f'{irr:.1f}%',
        'Terminal Value %': f'{(pv_terminal/enterprise_value*100):.0f}%'
    }
    
    if st.button("📥 Generate PDF Report"):
        st.success("PDF report would be generated with full DCF model, comps analysis, and executive summary.")
        st.json(report_data)

# Footer with context
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666;'>
    <p><strong>Demo Purpose:</strong> This valuation simulator demonstrates the intersection of financial expertise 
    and full-stack development. In production, this would connect to live data sources and generate institutional-grade reports.</p>
    <p>Built with Streamlit + Plotly | Zachary Vorsteg - Fractional CFO & Developer</p>
</div>
""", unsafe_allow_html=True)
