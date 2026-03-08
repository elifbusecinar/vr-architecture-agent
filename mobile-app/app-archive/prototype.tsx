import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

let WebView: any;
try {
  if (Platform.OS !== 'web') {
    WebView = require('react-native-webview').WebView;
  }
} catch (e) {
  console.warn('WebView could not be loaded');
}

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VR Architecture — Billing, Analytics & More</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --cream:#F0EDE8;--cream-dark:#E8E4DE;--black:#1A1917;--soft:#2C2A27;
  --gray:#8A8783;--gray-l:#C8C5C0;--green:#4A7C59;--border:#D8D4CE;
  --red:#D95555;--amber:#C4783A;--blue:#3A6FA0;--purple:#7B6FA0;
  --white:#FAFAF8;
}
body{background:#111009;font-family:'DM Sans',sans-serif;padding:52px 24px 80px;}

.page-title{
  text-align:center;margin-bottom:52px;
  font-family:'Playfair Display',serif;font-size:13px;color:#3A3632;
  letter-spacing:.2em;text-transform:uppercase;
}
.section{margin-bottom:72px;}
.section-label{
  font-size:10px;color:#3A3632;letter-spacing:.1em;text-transform:uppercase;
  margin-bottom:32px;display:flex;align-items:center;gap:12px;
}
.section-label::after{content:'';flex:1;height:1px;background:rgba(58,54,50,0.2);}

/* ── 1. BILLING SYSTEM ── */
.billing-hero{text-align:center;margin-bottom:60px;}
.billing-h1{font-family:'Playfair Display',serif;font-size:42px;color:var(--cream);letter-spacing:-.02em;margin-bottom:12px;}
.billing-h1 em{font-style:italic;color:var(--gray);font-weight:400;}
.billing-sub{color:var(--gray);font-size:15px;max-width:300px;margin:0 auto 32px;}

.billing-toggle{
  display:inline-flex;background:var(--black);padding:4px;border-radius:100px;
  border:1px solid rgba(255,255,255,0.05);margin-bottom:40px;
}
.bt-btn{padding:8px 20px;border-radius:100px;font-size:12px;font-weight:600;color:var(--gray);cursor:pointer;}
.bt-btn.active{background:var(--cream);color:var(--black);}

.plans-grid{display:flex;flex-direction:column;gap:20px;}
.plan-card{background:#1A1917;border:1px solid rgba(255,255,255,0.05);border-radius:32px;padding:40px 32px;position:relative;overflow:hidden;}
.plan-card.featured{border-color:var(--gray);background:#22211F;}
.plan-badge{position:absolute;top:24px;right:24px;font-size:9px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.1em;background:rgba(74,124,89,0.1);padding:4px 10px;border-radius:100px;}

.plan-name{font-family:'Playfair Display',serif;font-size:28px;color:var(--cream);margin-bottom:8px;}
.plan-desc{font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:28px;}
.plan-price{display:flex;align-items:baseline;gap:4px;margin-bottom:4px;}
.p-cur{font-size:18px;color:var(--cream);}
.p-val{font-size:48px;font-family:'Playfair Display',serif;color:var(--cream);}
.p-mo{font-size:12px;color:var(--gray);}

.plan-sep{height:1px;background:rgba(255,255,255,0.05);margin:28px 0;}
.plan-feats{display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
.p-feat{font-size:13px;color:var(--gray-l);display:flex;align-items:center;gap:10px;}
.p-feat::before{content:'✓';color:var(--green);font-weight:700;}

.btn-primary{width:100%;padding:18px;background:var(--cream);color:var(--black);border-radius:16px;border:none;font-weight:700;font-size:14px;cursor:pointer;}
.btn-outline{width:100%;padding:18px;background:transparent;color:var(--cream);border:1.5px solid rgba(255,255,255,0.1);border-radius:16px;font-weight:600;font-size:14px;}

/* ── 2. USAGE ESTIMATOR ── */
.estimator{background:var(--black);border-radius:40px;padding:40px 24px;border:1px solid rgba(255,255,255,0.05);}
.est-h{font-family:'Playfair Display',serif;font-size:32px;color:var(--cream);margin-bottom:32px;text-align:center;}
.est-slider{margin-bottom:32px;}
.es-top{display:flex;justify-content:space-between;margin-bottom:12px;}
.es-l{font-size:12px;color:var(--gray);font-weight:600;}
.es-v{font-family:'Playfair Display',serif;font-size:24px;color:var(--cream);}
.es-track{height:2px;background:rgba(255,255,255,0.05);position:relative;margin-top:20px;}
.es-fill{position:absolute;top:0;left:0;height:100%;background:var(--cream);width:40%;}
.es-thumb{position:absolute;top:-8px;left:40%;width:18px;height:18px;background:var(--white);border-radius:50%;border:4px solid var(--black);}

.est-result{background:rgba(255,255,255,0.03);border-radius:24px;padding:24px;margin-top:12px;text-align:center;}
.er-l{font-size:10px;color:var(--gray);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px;}
.er-plan{font-family:'Playfair Display',serif;font-size:24px;color:var(--cream);margin-bottom:8px;}
.er-price{font-size:32px;color:var(--white);font-weight:700;margin-bottom:4px;}
.er-sub{font-size:12px;color:var(--gray);}

/* ── 3. STUDIO ANALYTICS ── */
.ana-card{background:#161512;border-radius:28px;padding:28px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.04);}
.ana-h{font-size:12px;color:var(--gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:24px;}
.ana-hero-val{font-family:'Playfair Display',serif;font-size:56px;color:var(--cream);line-height:1;margin-bottom:8px;}
.ana-hero-unit{font-size:24px;font-style:italic;color:var(--gray);font-family:'Playfair Display',serif;}
.ana-delta{display:inline-flex;padding:4px 10px;background:rgba(74,124,89,0.1);color:var(--green);border-radius:100px;font-size:11px;font-weight:700;}

.bar-chart{display:flex;align-items:flex-end;height:100px;gap:8px;margin-top:32px;}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;}
.bar-f{width:100%;background:rgba(255,255,255,0.05);border-radius:4px;transition:height 0.3s;}
.bar-f.active{background:var(--green);box-shadow:0 0 15px rgba(74,124,89,0.3);}
.bar-l{font-size:9px;color:var(--gray);text-transform:uppercase;}

.sentiment{margin-top:32px;display:flex;flex-direction:column;gap:16px;}
.sent-row{display:flex;align-items:center;gap:12px;}
.sent-icon{font-size:18px;width:24px;}
.sent-track{flex:1;height:6px;background:rgba(255,255,255,0.05);border-radius:100px;overflow:hidden;}
.sent-fill{height:100%;border-radius:100px;}
.sent-v{font-size:12px;font-weight:700;color:var(--cream);width:32px;text-align:right;}

/* ── 4. TABLET SPLIT VIEW (Simulation) ── */
.tablet-frame{background:#000;border:8px solid #222;border-radius:40px;height:500px;display:flex;overflow:hidden;}
.t-sidebar{width:200px;background:#111;border-right:1px solid #222;padding:32px 20px;}
.t-main{flex:1;background:#161616;padding:32px;}
.t-nav-item{padding:12px;border-radius:10px;margin-bottom:8px;color:var(--gray);font-size:13px;display:flex;align-items:center;gap:10px;}
.t-nav-item.active{background:#222;color:white;}
.t-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.t-card{background:#222;border-radius:16px;padding:20px;}

/* ── 5. EMAIL DIGEST ── */
.email-box{background:var(--white);border-radius:4px;overflow:hidden;color:var(--black);}
.email-top{padding:40px;text-align:center;border-bottom:1px solid #EEE;}
.email-logo{font-family:'Playfair Display',serif;font-size:16px;font-weight:800;letter-spacing:2px;}
.email-body{padding:40px;}
.email-h1{font-family:'Playfair Display',serif;font-size:32px;margin-bottom:16px;}
.email-cta{display:inline-block;padding:16px 32px;background:var(--black);color:white;text-decoration:none;border-radius:4px;font-weight:700;margin-top:32px;}

/* ── 6. ACCESSIBILITY MODE ── */
.acc-mode{background:black;color:white;padding:32px;border:4px solid yellow;}
.acc-h1{font-size:48px;font-weight:900;color:yellow;margin-bottom:24px;text-transform:uppercase;}
.acc-btn{background:yellow;color:black;padding:24px;font-size:24px;font-weight:900;border:none;width:100%;margin-bottom:16px;}
</style>
</head>
<body>

<div class="page-title">Full UI System — v2.0</div>

<!-- 1. BILLING SECTION -->
<div class="section">
  <div class="section-label">01 // Billing & Plans</div>
  <div class="billing-hero">
    <h1 class="billing-h1">Pay for what you<br><em>actually</em> use</h1>
    <p class="billing-sub">No seat fees. No surprise overages. Scale up as your studio grows.</p>
    <div class="billing-toggle">
      <div class="bt-btn">Monthly</div>
      <div class="bt-btn active">Annual — Save 20%</div>
    </div>
  </div>

  <div class="plans-grid">
    <div class="plan-card">
      <div class="plan-name">Starter</div>
      <p class="plan-desc">For architects exploring VR. Get started without a credit card.</p>
      <div class="plan-price">
        <span class="p-cur">$</span>
        <span class="p-val">0</span>
      </div>
      <p class="p-mo">forever free</p>
      <div class="plan-sep"></div>
      <div class="plan-feats">
        <div class="p-feat">1 project</div>
        <div class="p-feat">2 seats included</div>
        <div class="p-feat">5 GB storage</div>
      </div>
      <button class="btn-outline">Start Free →</button>
    </div>

    <div class="plan-card featured">
      <div class="plan-badge">Most Popular</div>
      <div class="plan-name">Pro Architect</div>
      <p class="plan-desc">For firms running concurrent projects and client walkthroughs.</p>
      <div class="plan-price">
        <span class="p-cur">$</span>
        <span class="p-val">63</span>
      </div>
      <p class="p-mo">per month, billed annually</p>
      <div class="plan-sep"></div>
      <div class="plan-feats">
        <div class="p-feat">Unlimited projects</div>
        <div class="p-feat">7 seats included</div>
        <div class="p-feat">50 GB storage</div>
        <div class="p-feat">Advanced analytics</div>
      </div>
      <button class="btn-primary">Subscribe Now</button>
    </div>
  </div>
</div>

<!-- 2. USAGE ESTIMATOR -->
<div class="section">
  <div class="section-label">02 // Plan Estimator</div>
  <div class="estimator">
    <h2 class="est-h">Build your plan</h2>
    <div class="est-slider">
      <div class="es-top">
        <span class="es-l">Team members</span>
        <span class="es-v">14</span>
      </div>
      <div class="es-track">
        <div class="es-fill" style="width: 28%;"></div>
        <div class="es-thumb" style="left: 28%;"></div>
      </div>
    </div>
    <div class="est-slider">
      <div class="es-top">
        <span class="es-l">Model storage</span>
        <span class="es-v">85 GB</span>
      </div>
      <div class="es-track">
        <div class="es-fill" style="width: 60%;"></div>
        <div class="es-thumb" style="left: 60%;"></div>
      </div>
    </div>
    <div class="est-result">
      <div class="er-l">Recommended plan</div>
      <div class="er-plan">Pro Architect</div>
      <div class="er-price">$63<span style="font-size:14px;color:rgba(255,255,255,0.4);">/mo</span></div>
      <p class="er-sub">Annual billing · 14-day free trial</p>
    </div>
  </div>
</div>

<!-- 3. STUDIO ANALYTICS -->
<div class="section">
  <div class="section-label">03 // Analytics Dashboard</div>
  <div class="ana-card">
    <div class="ana-h">Total VR session time</div>
    <div class="ana-hero-val">28<span class="ana-hero-unit">h 42m</span></div>
    <div class="ana-delta">↑ 34% vs last month</div>
    
    <div class="bar-chart">
      <div class="bar-col"><div class="bar-f" style="height: 40%;"></div><span class="bar-l">M</span></div>
      <div class="bar-col"><div class="bar-f" style="height: 65%;"></div><span class="bar-l">T</span></div>
      <div class="bar-col"><div class="bar-f active" style="height: 90%;"></div><span class="bar-l">W</span></div>
      <div class="bar-col"><div class="bar-f" style="height: 50%;"></div><span class="bar-l">T</span></div>
      <div class="bar-col"><div class="bar-f" style="height: 100%;"></div><span class="bar-l">F</span></div>
      <div class="bar-col"><div class="bar-f" style="height: 30%;"></div><span class="bar-l">S</span></div>
      <div class="bar-col"><div class="bar-f" style="height: 15%;"></div><span class="bar-l">S</span></div>
    </div>

    <div class="sentiment">
      <div class="sent-row">
        <span class="sent-icon">❤️</span>
        <div class="sent-track"><div class="sent-fill" style="width: 72%; background: var(--green);"></div></div>
        <span class="sent-v">72%</span>
      </div>
      <div class="sent-row">
        <span class="sent-icon">🤔</span>
        <div class="sent-track"><div class="sent-fill" style="width: 18%; background: var(--amber);"></div></div>
        <span class="sent-v">18%</span>
      </div>
    </div>
  </div>
</div>

<!-- 4. TABLET VIEW -->
<div class="section">
  <div class="section-label">04 // Tablet Split View</div>
  <div class="tablet-frame">
    <div class="t-sidebar">
      <div class="t-nav-item active">Overview</div>
      <div class="t-nav-item">Projects</div>
      <div class="t-nav-item">Team</div>
      <div class="t-nav-item">Analytics</div>
    </div>
    <div class="t-main">
      <h3 style="color:white; margin-bottom:24px;">Monday, 8 March</h3>
      <div class="t-grid">
        <div class="t-card">
          <div style="font-size:10px; color:var(--gray); margin-bottom:8px;">ACTIVE SESSIONS</div>
          <div style="font-size:24px; color:white;">4</div>
        </div>
        <div class="t-card">
          <div style="font-size:10px; color:var(--gray); margin-bottom:8px;">PENDING REVIEWS</div>
          <div style="font-size:24px; color:white;">12</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 5. EMAIL DIGEST -->
<div class="section">
  <div class="section-label">05 // Weekly Email Digest</div>
  <div class="email-box">
    <div class="email-top">
      <div class="email-logo">VR ARCHITECTURE</div>
    </div>
    <div class="email-body">
      <h1 class="email-h1">Your Weekly Studio Insights</h1>
      <p style="color:var(--gray); line-height:1.6; margin-bottom:32px;">Great job! Your studio completed 12 VR sessions this week, totaling 8.5 hours of client walkthrough time.</p>
      <div style="background:#F9F9F9; padding:24px; border-radius:8px;">
        <div style="font-size:11px; font-weight:700; margin-bottom:12px;">TOP PROJECT</div>
        <div style="font-size:18px; font-weight:700;">Riverside Penthouse</div>
        <div style="font-size:13px; color:var(--gray); margin-top:4px;">5 sessions · 3 annotations</div>
      </div>
      <a href="#" class="email-cta">View Full Dashboard</a>
    </div>
  </div>
</div>

<!-- 6. ACCESSIBILITY -->
<div class="section">
  <div class="section-label">06 // Accessibility Mode</div>
  <div class="acc-mode">
    <h1 class="acc-h1">ACCESSIBILITY MODE ACTIVE</h1>
    <button class="acc-btn">JOIN ACTIVE SESSION</button>
    <button class="acc-btn">VIEW MODEL LIBRARY</button>
    <button class="acc-btn">STUDIO SETTINGS</button>
  </div>
</div>

</body>
</html>
`;

export default function PrototypeViewer() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke="#1A1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.backText}>Exit Prototype</Text>
        </TouchableOpacity>
        <Text style={styles.title}>High-Fidelity Concept</Text>
      </View>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={HTML_CONTENT}
          style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
          title="Prototype"
        />
      ) : (
        WebView && (
          <WebView
            originWhitelist={['*']}
            source={{ html: HTML_CONTENT }}
            style={styles.webview}
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EDE8' },
  header: { height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#D8D4CE', backgroundColor: '#F0EDE8' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 4, fontSize: 14, fontWeight: '600', color: '#1A1917' },
  title: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '500', color: '#8A8783', marginRight: 40 },
  webview: { flex: 1 },
});
