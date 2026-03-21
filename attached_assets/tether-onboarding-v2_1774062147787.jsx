import { useState } from "react";

const STEPS = ["welcome", "account", "phone", "child", "done"];

const p = {
  primary: "#6B9E8A",
  primaryLight: "#8BBDAA",
  primaryDark: "#4E7D6A",
  accent: "#7B8EC4",
  accentLight: "#9BAAD8",
  accentDark: "#5B6EA4",
  background: "#F5F6FA",
  surface: "#ECEEF6",
  white: "#FFFFFF",
  text: "#232535",
  textMid: "#555870",
  border: "#D4D8EA",
  sand: "#C8CCE0",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh;
    background: ${p.background};
    font-family: 'Nunito', sans-serif;
    color: ${p.text};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .blob-tl {
    position: fixed; top: -140px; left: -100px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, ${p.primary}28 0%, transparent 65%);
    pointer-events: none;
  }
  .blob-br {
    position: fixed; bottom: -120px; right: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, ${p.accent}22 0%, transparent 65%);
    pointer-events: none;
  }
  .blob-mid {
    position: fixed; top: 40%; left: 55%;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, ${p.primaryLight}14 0%, transparent 70%);
    pointer-events: none;
  }

  .grain {
    position: fixed; inset: 0; opacity: 0.03; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .card {
    position: relative; z-index: 10;
    width: 100%; max-width: 408px;
    margin: 24px;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(16px);
    border-radius: 28px;
    border: 1px solid ${p.border};
    box-shadow: 0 12px 48px rgba(35,37,53,0.10), 0 2px 8px rgba(35,37,53,0.05);
    overflow: hidden;
  }

  .progress-track {
    height: 3px;
    background: ${p.surface};
  }
  .progress-fill {
    height: 3px;
    background: linear-gradient(90deg, ${p.primary}, ${p.accent});
    transition: width 0.55s cubic-bezier(0.4,0,0.2,1);
    border-radius: 0 2px 2px 0;
  }

  .inner { padding: 36px 32px 32px; }

  .logorow {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 28px;
  }
  .logobox {
    width: 36px; height: 36px; border-radius: 11px;
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px ${p.primary}44;
  }
  .logotext {
    font-family: 'Fraunces', serif;
    font-size: 21px; font-weight: 600;
    color: ${p.text}; letter-spacing: -0.4px;
  }

  .step-tag {
    display: inline-block;
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.8px; text-transform: uppercase;
    color: ${p.accent};
    background: ${p.accent}14;
    border: 1px solid ${p.accent}30;
    border-radius: 20px;
    padding: 4px 10px;
    margin-bottom: 14px;
  }

  h1 {
    font-family: 'Fraunces', serif;
    font-size: 28px; font-weight: 400;
    line-height: 1.18; color: ${p.text};
    margin-bottom: 10px;
  }
  h1 em {
    font-style: italic;
    color: ${p.primary};
  }

  .sub {
    font-size: 14px; line-height: 1.65;
    color: ${p.textMid}; margin-bottom: 28px;
  }

  .field { margin-bottom: 14px; }
  .field-row { display: flex; gap: 10px; }
  .field-row .field { flex: 1; }

  label.lbl {
    display: block;
    font-size: 11px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    color: ${p.textMid}; margin-bottom: 6px;
  }

  input.inp {
    width: 100%; padding: 12px 15px;
    border-radius: 13px;
    border: 1.5px solid ${p.border};
    background: ${p.white};
    font-family: 'Nunito', sans-serif;
    font-size: 15px; color: ${p.text};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input.inp:focus {
    border-color: ${p.primary};
    box-shadow: 0 0 0 3px ${p.primary}1C;
  }
  input.inp::placeholder { color: ${p.sand}; }

  .btn {
    width: 100%; padding: 14px;
    border: none; border-radius: 15px;
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
  }
  .btn-main {
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    color: white;
    box-shadow: 0 4px 18px ${p.primary}44;
    margin-bottom: 10px;
  }
  .btn-main:hover {
    box-shadow: 0 6px 22px ${p.primary}55;
    transform: translateY(-1px);
  }
  .btn-main:active { transform: translateY(0); }

  .btn-ghost {
    background: none; color: ${p.textMid};
    font-size: 13px; padding: 8px;
  }
  .btn-ghost:hover { color: ${p.primary}; }

  .pills {
    display: flex; flex-wrap: wrap; gap: 7px;
    margin-bottom: 28px;
  }
  .pill {
    display: flex; align-items: center; gap: 5px;
    background: ${p.primary}14;
    border: 1px solid ${p.primary}38;
    border-radius: 20px;
    padding: 5px 11px 5px 7px;
    font-size: 12px; font-weight: 700;
    color: ${p.primaryDark};
  }

  .otp-row {
    display: flex; gap: 8px;
    justify-content: center;
    margin-bottom: 20px;
  }
  .otp-box {
    width: 48px; height: 58px;
    border-radius: 13px;
    border: 1.5px solid ${p.border};
    background: ${p.white};
    font-family: 'Fraunces', serif;
    font-size: 24px; font-weight: 600;
    text-align: center; color: ${p.text};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .otp-box:focus {
    border-color: ${p.accent};
    box-shadow: 0 0 0 3px ${p.accent}1C;
  }

  .resend {
    text-align: center; font-size: 12px;
    color: ${p.textMid}; margin-bottom: 20px;
  }
  .resend button {
    background: none; border: none;
    color: ${p.accent}; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    font-size: 12px;
  }

  .divider {
    display: flex; align-items: center;
    gap: 10px; margin: 16px 0;
  }
  .div-line { flex: 1; height: 1px; background: ${p.border}; }
  .div-txt { font-size: 11px; color: ${p.textMid}; font-weight: 600; }

  .age-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px; margin-bottom: 4px;
  }
  .age-btn {
    padding: 10px 4px;
    border-radius: 11px;
    border: 1.5px solid ${p.border};
    background: ${p.white};
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 600;
    color: ${p.textMid};
    cursor: pointer;
    transition: all 0.14s;
    text-align: center;
  }
  .age-btn.on {
    border-color: ${p.primary};
    background: ${p.primary}16;
    color: ${p.primaryDark};
  }
  .age-btn:hover:not(.on) { background: ${p.surface}; }

  .done-ring {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: ${p.primary}18;
    border: 2px solid ${p.primary}44;
    display: flex; align-items: center;
    justify-content: center;
    margin: 0 auto 22px;
  }

  .invite-box {
    background: ${p.surface};
    border: 1.5px dashed ${p.border};
    border-radius: 14px;
    padding: 16px 20px;
    text-align: center;
    margin-bottom: 22px;
  }
  .invite-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: ${p.textMid}; margin-bottom: 8px;
  }
  .invite-code {
    font-family: 'Fraunces', serif;
    font-size: 30px; font-weight: 600;
    letter-spacing: 5px; color: ${p.primary};
  }

  .dots {
    display: flex; gap: 6px;
    justify-content: center; margin-top: 22px;
  }
  .dot {
    height: 5px; border-radius: 3px;
    background: ${p.border};
    transition: all 0.3s;
    width: 5px;
  }
  .dot.on { width: 16px; background: ${p.primary}; }
  .dot.done { background: ${p.primaryLight}; }

  .welcome-vis {
    margin-bottom: 26px;
    display: flex; align-items: center;
    justify-content: center; height: 130px;
  }
  .vis-wrap { position: relative; width: 120px; height: 120px; }
  .ring-outer {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 1.5px dashed ${p.border};
    animation: spin 22s linear infinite;
  }
  .ring-mid {
    position: absolute; inset: 16px;
    border-radius: 50%;
    background: ${p.primary}0E;
    border: 1px solid ${p.primary}28;
  }
  .ring-core {
    position: absolute; inset: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 22px ${p.primary}55;
  }
  .node {
    position: absolute;
    width: 11px; height: 11px;
    border-radius: 50%;
    background: ${p.accent};
    border: 2px solid white;
    box-shadow: 0 2px 6px ${p.accent}44;
  }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .in { animation: up 0.38s cubic-bezier(0.4,0,0.2,1) forwards; }

  .fine-print {
    font-size: 11px; color: ${p.textMid};
    text-align: center; margin-top: 12px;
    line-height: 1.6;
  }
  .already {
    text-align: center; font-size: 13px;
    color: ${p.textMid}; margin-top: 12px;
  }
  .already button {
    background: none; border: none;
    color: ${p.accent}; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    font-size: 13px;
  }

  .phone-note {
    background: ${p.accent}0E;
    border: 1px solid ${p.accent}28;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 12px;
    color: ${p.accentDark};
    line-height: 1.55;
    margin-bottom: 18px;
  }
`;

const Logo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3.5" fill="white" />
    <path d="M12 2v6.5M12 15.5V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12h6.5M15.5 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1.5" fill="white" opacity="0.55" />
    <circle cx="12" cy="22" r="1.5" fill="white" opacity="0.55" />
    <circle cx="2" cy="12" r="1.5" fill="white" opacity="0.55" />
    <circle cx="22" cy="12" r="1.5" fill="white" opacity="0.55" />
  </svg>
);

const Check = ({ size = 13, color = p.primaryDark }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5L9.5 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AGES = ["5","6","7","8","9","10","11","12","13","14","15","16"];

export default function TetherOnboarding() {
  const [step, setStep] = useState(0);
  const [key, setKey] = useState(0);
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", password:"", phone:"", childName:"", childAge:"" });
  const [otp, setOtp] = useState(["","","","","",""]);

  const pct = [0, 28, 54, 78, 100][step];
  const cur = STEPS[step];

  const next = () => { setKey(k => k+1); setStep(s => Math.min(s+1, STEPS.length-1)); };
  const set = (f, v) => setForm(fm => ({ ...fm, [f]: v }));

  const handleOtp = (i, val) => {
    if (val.length > 1) val = val.slice(-1);
    const o = [...otp]; o[i] = val; setOtp(o);
    if (val && i < 5) document.getElementById(`otp${i+1}`)?.focus();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="blob-tl" /><div className="blob-br" /><div className="blob-mid" /><div className="grain" />

        <div className="card">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>

          <div className="inner">

            {cur === "welcome" && (
              <div className="in" key={`w${key}`}>
                <div className="logorow">
                  <div className="logobox"><Logo /></div>
                  <span className="logotext">Tether</span>
                </div>

                <div className="welcome-vis">
                  <div className="vis-wrap">
                    <div className="ring-outer" />
                    <div className="ring-mid" />
                    <div className="ring-core"><Logo size={22} /></div>
                    <div className="node" style={{ top: -1, left: "50%", transform: "translateX(-50%)" }} />
                    <div className="node" style={{ bottom: -1, left: "50%", transform: "translateX(-50%)" }} />
                    <div className="node" style={{ left: -1, top: "50%", transform: "translateY(-50%)" }} />
                    <div className="node" style={{ right: -1, top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

                <h1>Your kids, <em>connected</em> and close.</h1>
                <p className="sub">Tether gives your children a safe place to communicate while keeping you fully in the loop — every message, every conversation.</p>

                <div className="pills">
                  {["Full message visibility", "Smart content alerts", "Your rules, your family"].map(t => (
                    <div key={t} className="pill"><Check />{t}</div>
                  ))}
                </div>

                <button className="btn btn-main" onClick={next}>Get started as a parent</button>
                <div className="already">Already have an account? <button>Sign in</button></div>
              </div>
            )}

            {cur === "account" && (
              <div className="in" key={`a${key}`}>
                <div className="logorow">
                  <div className="logobox"><Logo /></div>
                  <span className="logotext">Tether</span>
                </div>
                <div className="step-tag">Step 1 of 3</div>
                <h1>Create your <em>account</em></h1>
                <p className="sub">This is your parent account. Your children's accounts are linked to yours.</p>

                <div className="field-row">
                  <div className="field">
                    <label className="lbl">First name</label>
                    <input className="inp" placeholder="Maria" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="lbl">Last name</label>
                    <input className="inp" placeholder="Santos" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="lbl">Email address</label>
                  <input className="inp" type="email" placeholder="maria@family.com" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div className="field" style={{ marginBottom: 22 }}>
                  <label className="lbl">Password</label>
                  <input className="inp" type="password" placeholder="••••••••••" value={form.password} onChange={e => set("password", e.target.value)} />
                </div>

                <button className="btn btn-main" onClick={next}>Continue</button>
                <p className="fine-print">By continuing you agree to our Terms of Service and Privacy Policy.<br/>We never sell your data or your children's data. Ever.</p>
              </div>
            )}

            {cur === "phone" && (
              <div className="in" key={`ph${key}`}>
                <div className="logorow">
                  <div className="logobox"><Logo /></div>
                  <span className="logotext">Tether</span>
                </div>
                <div className="step-tag">Step 2 of 3</div>
                <h1>Verify your <em>number</em></h1>

                <div className="phone-note">
                  Your number is how we reach you when it matters most. High-priority alerts — including self-harm or explicit content flags — are sent as SMS directly to this number.
                </div>

                <div className="field" style={{ marginBottom: 16 }}>
                  <label className="lbl">Mobile number</label>
                  <input className="inp" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
                </div>

                <button className="btn btn-main" onClick={next}>Send verification code</button>

                <div className="divider">
                  <div className="div-line" /><span className="div-txt">enter your code</span><div className="div-line" />
                </div>

                <div className="otp-row">
                  {otp.map((v, i) => (
                    <input key={i} id={`otp${i}`} className="otp-box" maxLength={1} value={v}
                      onChange={e => handleOtp(i, e.target.value)}
                      onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) document.getElementById(`otp${i-1}`)?.focus(); }} />
                  ))}
                </div>

                <p className="resend">Didn't get a code? <button>Resend</button></p>
                <button className="btn btn-main" onClick={next}>Verify and continue</button>
              </div>
            )}

            {cur === "child" && (
              <div className="in" key={`c${key}`}>
                <div className="logorow">
                  <div className="logobox"><Logo /></div>
                  <span className="logotext">Tether</span>
                </div>
                <div className="step-tag">Step 3 of 3</div>
                <h1>Add your <em>first child</em></h1>
                <p className="sub">You can add more children after setup. Each child gets their own account with settings tailored to their age.</p>

                <div className="field">
                  <label className="lbl">Child's first name</label>
                  <input className="inp" placeholder="e.g. Olivia" value={form.childName} onChange={e => set("childName", e.target.value)} />
                </div>
                <div className="field" style={{ marginBottom: 22 }}>
                  <label className="lbl">Their age</label>
                  <div className="age-grid">
                    {AGES.map(age => (
                      <button key={age} className={`age-btn ${form.childAge === age ? "on" : ""}`}
                        onClick={() => set("childAge", age)}>{age}</button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-main" onClick={next}>Create Tether account</button>
                <button className="btn btn-ghost" onClick={next}>Skip — I'll add children later</button>
              </div>
            )}

            {cur === "done" && (
              <div className="in in" key={`d${key}`} style={{ textAlign: "center" }}>
                <div className="logorow" style={{ justifyContent: "center" }}>
                  <div className="logobox"><Logo /></div>
                  <span className="logotext">Tether</span>
                </div>

                <div className="done-ring">
                  <Check size={30} color={p.primaryDark} />
                </div>

                <h1 style={{ textAlign: "center" }}>You're all <em>set</em></h1>
                <p className="sub" style={{ textAlign: "center" }}>
                  {form.childName ? `${form.childName}'s account is ready.` : "Your account is ready."} Share your invite code with other parents in your group to get started.
                </p>

                <div className="invite-box">
                  <div className="invite-label">Your invite code</div>
                  <div className="invite-code">TETH·4829</div>
                </div>

                <button className="btn btn-main" style={{
                  background: `linear-gradient(135deg, ${p.accent}, ${p.accentDark})`,
                  boxShadow: `0 4px 18px ${p.accent}44`
                }}>Go to my dashboard</button>
                <button className="btn btn-ghost">Share my invite code</button>
              </div>
            )}

            {step > 0 && step < STEPS.length - 1 && (
              <div className="dots">
                {[1,2,3].map(i => (
                  <div key={i} className={`dot ${step === i ? "on" : step > i ? "done" : ""}`} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
