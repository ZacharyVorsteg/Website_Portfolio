#!/usr/bin/env python3
"""
Growth Funnel Simulator
Author: Zachary Vorsteg
Description: Interactive marketing funnel showing how spend and conversion rates cascade to MRR.
             100% self-contained with synthetic data. No external dependencies.

Run: streamlit run growth_funnel.py
Dependencies: pip install streamlit plotly pandas numpy
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta

# Page config
st.set_page_config(
    page_title="Growth Funnel Simulator | CEO Strategy",
    page_icon="🎯",
    layout="wide"
)

# Header
st.title("🎯 Growth Funnel Simulator")
st.markdown("""
**Demo Purpose:** Visualize how marketing spend and conversion rates cascade through your funnel to MRR. 
Demonstrates strategic thinking about growth levers combined with technical implementation skills.
""")

# Sidebar inputs
st.sidebar.header("📈 Growth Levers")

# Marketing channels
st.sidebar.subheader("Marketing Spend (Monthly)")
paid_search = st.sidebar.slider("Paid Search ($k)", 0, 100, 25, 5)
content_marketing = st.sidebar.slider("Content Marketing ($k)", 0, 50, 15, 5)
social_media = st.sidebar.slider("Social Media ($k)", 0, 50, 10, 5)
events = st.sidebar.slider("Events/Webinars ($k)", 0, 30, 5, 5)

total_spend = (paid_search + content_marketing + social_media + events) * 1000

# Conversion rates
st.sidebar.subheader("Funnel Conversion Rates")
visitor_to_lead = st.sidebar.slider("Visitor → Lead (%)", 1, 10, 3) / 100
lead_to_trial = st.sidebar.slider("Lead → Trial (%)", 10, 40, 20) / 100
trial_to_paid = st.sidebar.slider("Trial → Paid (%)", 10, 50, 25) / 100
paid_retention = st.sidebar.slider("Monthly Retention (%)", 85, 98, 95) / 100

# Pricing
st.sidebar.subheader("Pricing & Value")
avg_contract_value = st.sidebar.slider("ACV per Customer ($)", 50, 500, 150)
sales_cycle_days = st.sidebar.slider("Sales Cycle (days)", 7, 60, 21)

# Calculate funnel metrics
def calculate_funnel():
    """Calculate all funnel metrics based on inputs"""
    
    # Channel efficiency (mock data showing different CACs)
    channel_cac = {
        'Paid Search': 1.2,  # Higher CAC
        'Content Marketing': 0.6,  # Lower CAC, slower
        'Social Media': 0.9,
        'Events': 1.5  # Highest CAC but better quality
    }
    
    # Calculate visitors from spend (using mock CPM/CPC rates)
    visitors_paid = (paid_search * 1000) / 2  # $2 CPC
    visitors_content = (content_marketing * 1000) / 0.5  # $0.50 per visitor
    visitors_social = (social_media * 1000) / 1  # $1 per visitor
    visitors_events = (events * 1000) / 10  # $10 per visitor (high quality)
    
    total_visitors = visitors_paid + visitors_content + visitors_social + visitors_events
    
    # Funnel stages
    leads = total_visitors * visitor_to_lead
    trials = leads * lead_to_trial
    customers = trials * trial_to_paid
    
    # MRR calculation
    mrr = customers * avg_contract_value
    
    # CAC calculation
    cac = total_spend / customers if customers > 0 else 0
    
    # LTV calculation (simplified)
    ltv = avg_contract_value / (1 - paid_retention) if paid_retention < 1 else avg_contract_value * 24
    
    # Payback period
    payback_months = cac / avg_contract_value if avg_contract_value > 0 else 0
    
    return {
        'visitors': total_visitors,
        'leads': leads,
        'trials': trials,
        'customers': customers,
        'mrr': mrr,
        'cac': cac,
        'ltv': ltv,
        'payback_months': payback_months,
        'channel_breakdown': {
            'Paid Search': visitors_paid,
            'Content Marketing': visitors_content,
            'Social Media': visitors_social,
            'Events': visitors_events
        }
    }

# Calculate metrics
metrics = calculate_funnel()

# Main layout
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Monthly MRR", f"${metrics['mrr']:,.0f}", 
              f"+{(metrics['customers'] * avg_contract_value):,.0f} new")

with col2:
    st.metric("CAC", f"${metrics['cac']:,.0f}",
              f"Payback: {metrics['payback_months']:.1f} months")

with col3:
    ltv_cac_ratio = metrics['ltv'] / metrics['cac'] if metrics['cac'] > 0 else 0
    st.metric("LTV:CAC Ratio", f"{ltv_cac_ratio:.1f}x",
              "✅ Healthy" if ltv_cac_ratio >= 3 else "⚠️ Needs improvement")

with col4:
    conversion_rate = (metrics['customers'] / metrics['visitors'] * 100) if metrics['visitors'] > 0 else 0
    st.metric("Overall Conversion", f"{conversion_rate:.2f}%",
              f"{metrics['customers']:.0f} customers")

# Tabs for different views
tab1, tab2, tab3, tab4 = st.tabs(["🎯 Funnel Visualization", "📊 Channel Performance", 
                                   "📈 Growth Projections", "💡 Optimization Insights"])

with tab1:
    st.subheader("Marketing Funnel Flow")
    
    # Create funnel chart
    funnel_stages = ['Visitors', 'Leads', 'Trials', 'Customers']
    funnel_values = [metrics['visitors'], metrics['leads'], metrics['trials'], metrics['customers']]
    funnel_text = [
        f"{int(v):,}<br>{funnel_stages[i]}" for i, v in enumerate(funnel_values)
    ]
    
    fig_funnel = go.Figure(go.Funnel(
        y=funnel_stages,
        x=funnel_values,
        textposition="inside",
        textinfo="text",
        text=funnel_text,
        marker=dict(
            color=['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
            line=dict(width=2, color='white')
        ),
        connector=dict(line=dict(color='#64748B', width=2))
    ))
    
    fig_funnel.update_layout(
        title="Conversion Funnel",
        height=500,
        showlegend=False
    )
    
    st.plotly_chart(fig_funnel, use_container_width=True)
    
    # Conversion rates between stages
    col1, col2, col3 = st.columns(3)
    with col1:
        st.info(f"**Visitor → Lead**\n{visitor_to_lead*100:.1f}% conversion")
    with col2:
        st.info(f"**Lead → Trial**\n{lead_to_trial*100:.1f}% conversion")
    with col3:
        st.info(f"**Trial → Customer**\n{trial_to_paid*100:.1f}% conversion")

with tab2:
    st.subheader("Channel Performance Analysis")
    
    # Channel breakdown
    channel_data = pd.DataFrame({
        'Channel': list(metrics['channel_breakdown'].keys()),
        'Visitors': list(metrics['channel_breakdown'].values()),
        'Spend': [paid_search*1000, content_marketing*1000, social_media*1000, events*1000],
    })
    channel_data['CPV'] = channel_data['Spend'] / channel_data['Visitors']
    channel_data['Customers'] = channel_data['Visitors'] * (metrics['customers'] / metrics['visitors'])
    channel_data['Revenue'] = channel_data['Customers'] * avg_contract_value
    channel_data['ROI'] = ((channel_data['Revenue'] - channel_data['Spend']) / channel_data['Spend'] * 100)
    
    # Dual axis chart - Spend vs ROI
    fig_channel = go.Figure()
    
    fig_channel.add_trace(go.Bar(
        x=channel_data['Channel'],
        y=channel_data['Spend'],
        name='Spend ($)',
        marker_color='#3B82F6',
        yaxis='y'
    ))
    
    fig_channel.add_trace(go.Scatter(
        x=channel_data['Channel'],
        y=channel_data['ROI'],
        name='ROI (%)',
        mode='lines+markers',
        marker_color='#10B981',
        yaxis='y2',
        line=dict(width=3)
    ))
    
    fig_channel.update_layout(
        title="Channel Spend vs ROI",
        yaxis=dict(title="Spend ($)", side='left'),
        yaxis2=dict(title="ROI (%)", overlaying='y', side='right'),
        hovermode='x unified',
        height=400
    )
    
    st.plotly_chart(fig_channel, use_container_width=True)
    
    # Channel metrics table
    st.dataframe(
        channel_data.style.format({
            'Visitors': '{:,.0f}',
            'Spend': '${:,.0f}',
            'CPV': '${:.2f}',
            'Customers': '{:.1f}',
            'Revenue': '${:,.0f}',
            'ROI': '{:.0f}%'
        }).background_gradient(cmap='RdYlGn', subset=['ROI']),
        use_container_width=True
    )

with tab3:
    st.subheader("12-Month Growth Projections")
    
    # Generate projections
    months = []
    mrr_projection = []
    customers_projection = []
    current_customers = metrics['customers']
    current_mrr = metrics['mrr']
    
    for month in range(12):
        months.append(f"Month {month+1}")
        
        # Apply retention and growth
        if month > 0:
            retained = current_customers * paid_retention
            new_customers = metrics['customers']  # Assuming constant acquisition
            current_customers = retained + new_customers
            current_mrr = current_customers * avg_contract_value
        
        customers_projection.append(current_customers)
        mrr_projection.append(current_mrr)
    
    # Create projection chart
    fig_projection = go.Figure()
    
    fig_projection.add_trace(go.Scatter(
        x=months,
        y=mrr_projection,
        name='MRR',
        mode='lines+markers',
        fill='tozeroy',
        marker_color='#8B5CF6'
    ))
    
    fig_projection.add_trace(go.Scatter(
        x=months,
        y=customers_projection,
        name='Customers',
        mode='lines+markers',
        yaxis='y2',
        marker_color='#10B981'
    ))
    
    fig_projection.update_layout(
        title="MRR & Customer Growth Projection",
        yaxis=dict(title="MRR ($)", side='left'),
        yaxis2=dict(title="Customers", overlaying='y', side='right'),
        hovermode='x unified',
        height=400
    )
    
    st.plotly_chart(fig_projection, use_container_width=True)
    
    # Key metrics at month 12
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Month 12 MRR", f"${mrr_projection[-1]:,.0f}",
                  f"+{((mrr_projection[-1]/mrr_projection[0]-1)*100):.0f}% growth")
    with col2:
        st.metric("Month 12 Customers", f"{customers_projection[-1]:,.0f}",
                  f"+{(customers_projection[-1]-customers_projection[0]):,.0f} net new")
    with col3:
        arr = mrr_projection[-1] * 12
        st.metric("Projected ARR", f"${arr:,.0f}",
                  f"Run rate at Month 12")

with tab4:
    st.subheader("💡 Optimization Recommendations")
    
    # Generate insights based on current metrics
    insights = []
    
    # CAC efficiency
    if metrics['cac'] > avg_contract_value * 3:
        insights.append({
            'type': 'warning',
            'title': 'High CAC Alert',
            'message': f"CAC (${metrics['cac']:.0f}) is {metrics['cac']/avg_contract_value:.1f}x ACV. Consider improving conversion rates or focusing on lower-cost channels.",
            'action': 'Increase trial→paid conversion by 5% to reduce CAC by 20%'
        })
    else:
        insights.append({
            'type': 'success',
            'title': 'Efficient CAC',
            'message': f"CAC is well-controlled at ${metrics['cac']:.0f}. Room to scale spend.",
            'action': 'Consider increasing marketing spend by 50% to accelerate growth'
        })
    
    # Conversion optimization
    if visitor_to_lead < 0.05:
        insights.append({
            'type': 'warning',
            'title': 'Low Top-of-Funnel Conversion',
            'message': f"Only {visitor_to_lead*100:.1f}% of visitors convert to leads.",
            'action': 'A/B test landing pages, improve CTAs, or refine targeting'
        })
    
    # Retention focus
    if paid_retention < 0.90:
        insights.append({
            'type': 'critical',
            'title': 'Retention Needs Attention',
            'message': f"Monthly retention at {paid_retention*100:.0f}% limits LTV.",
            'action': 'Focus on customer success, product improvements, and engagement'
        })
    
    # Display insights
    for insight in insights:
        if insight['type'] == 'success':
            st.success(f"**{insight['title']}**\n\n{insight['message']}\n\n💡 {insight['action']}")
        elif insight['type'] == 'warning':
            st.warning(f"**{insight['title']}**\n\n{insight['message']}\n\n💡 {insight['action']}")
        else:
            st.error(f"**{insight['title']}**\n\n{insight['message']}\n\n💡 {insight['action']}")
    
    # Scenario comparison
    st.subheader("What-If Scenarios")
    
    scenarios = {
        'Current': {
            'mrr': metrics['mrr'],
            'cac': metrics['cac'],
            'ltv_cac': ltv_cac_ratio
        },
        '10% Better Conversion': {
            'mrr': metrics['mrr'] * 1.1,
            'cac': metrics['cac'] * 0.91,
            'ltv_cac': ltv_cac_ratio * 1.1
        },
        '2x Marketing Spend': {
            'mrr': metrics['mrr'] * 1.8,  # Not quite 2x due to diminishing returns
            'cac': metrics['cac'] * 1.1,
            'ltv_cac': ltv_cac_ratio * 0.95
        },
        'Premium Pricing (+50%)': {
            'mrr': metrics['mrr'] * 1.35,  # Some customer loss
            'cac': metrics['cac'],
            'ltv_cac': ltv_cac_ratio * 1.35
        }
    }
    
    scenario_df = pd.DataFrame(scenarios).T
    st.dataframe(
        scenario_df.style.format({
            'mrr': '${:,.0f}',
            'cac': '${:,.0f}',
            'ltv_cac': '{:.1f}x'
        }).background_gradient(cmap='RdYlGn', subset=['mrr', 'ltv_cac']),
        use_container_width=True
    )

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666;'>
    <p><strong>Demo Purpose:</strong> This growth funnel simulator demonstrates strategic thinking about 
    growth levers combined with technical implementation. Shows how marketing investments cascade through 
    conversion rates to drive MRR growth.</p>
    <p>Single Python file • No external APIs • Instant results</p>
</div>
""", unsafe_allow_html=True)
