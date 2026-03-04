import React from 'react';

const BillingDashboard: React.FC = () => {
    const plans = [
        { name: 'Starter', price: '$49', features: ['5 Projects', '50GB Storage', 'Basic 3D Viewer', '1 User'], active: true },
        { name: 'Professional', price: '$149', features: ['20 Projects', '500GB Storage', 'Visual Diff', '5 Users', 'AI Transcription'], active: false },
        { name: 'Enterprise', price: 'Custom', features: ['Unlimited Projects', 'Infinite Storage', 'Custom LOD', 'Dedicated Support'], active: false },
    ];

    return (
        <div className="billing-dashboard" style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 24 }}>
            <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--serif)' }}>Subscription & Usage</h2>
                <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>Manage your workspace plan and storage limits.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 60 }}>
                {plans.map(plan => (
                    <div key={plan.name} style={{
                        padding: 32,
                        background: plan.active ? 'white' : 'transparent',
                        border: `1px solid ${plan.active ? 'var(--blue)' : 'var(--border)'}`,
                        borderRadius: 20,
                        boxShadow: plan.active ? 'var(--shadow-lg)' : 'none',
                        position: 'relative'
                    }}>
                        {plan.active && <span style={{
                            position: 'absolute',
                            top: -12,
                            right: 20,
                            padding: '4px 12px',
                            background: 'var(--blue)',
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: 100
                        }}>CURRENT PLAN</span>}
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{plan.name}</h3>
                        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{plan.price}<span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 400 }}>/mo</span></div>
                        <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {plan.features.map(f => (
                                <li key={f} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-2)' }}>
                                    <span style={{ color: 'var(--blue)' }}>✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button className={`btn ${plan.active ? 'btn-ghost' : 'btn-primary'}`} style={{ width: '100%', marginTop: 32 }}>
                            {plan.active ? 'Manage' : 'Upgrade Now'}
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Resource Usage</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>Projects (4/5)</span>
                            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>80% Used</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--bg-inset)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ width: '80%', height: '100%', background: 'var(--blue)' }} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>Storage (42GB / 50GB)</span>
                            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>84% Used</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--bg-inset)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ width: '84%', height: '100%', background: 'var(--amber)' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingDashboard;
