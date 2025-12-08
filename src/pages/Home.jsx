import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/Home.css";

export default function Home() {
    const heroRef = useRef(null);

    useEffect(() => {
        gsap.from(heroRef.current, { opacity: 0, y: 20, duration: 0.6 });
        gsap.from(".mockup", { opacity: 0, y: 25, duration: 0.7, delay: 0.1 });
        gsap.from(".feature-card", { opacity: 0, y: 15, stagger: 0.1, delay: 0.3 });
        gsap.from(".why-list li", { opacity: 0, x: -10, stagger: 0.1, delay: 0.4 });
    }, []);

    return (
        <div className="home">

            {/* HERO SECTION */}
            <section className="hero" ref={heroRef}>
                <img src="/logo.png" alt="CARE-ASSIST" className="hero-logo" />

                <h1 className="hero-title">Your Dialysis Companion</h1>

                <p className="hero-subtitle">
                    Track UF trends, manage PD exchanges, monitor health insights,
                    and stay connected with your nephrologist — all in one place.
                </p>

                <div className="hero-buttons">
                    <Link to="/login" className="btn primary">Login</Link>
                    <Link to="/signup" className="btn secondary">Create Account</Link>
                </div>
            </section>

            {/* REAL APP PREVIEW MOCKUP (INFORMATIONAL) */}
            <div className="phone-preview">
                <div className="preview-screen">

                    {/* HEADER */}
                    <div className="preview-header">
                        <h4>Dashboard</h4>
                        <span className="preview-tag">Today</span>
                    </div>

                    {/* TODAY UF CARD */}
                    <div className="preview-uf-card">
                        <p className="uf-label">Today’s UF</p>
                        <p className="uf-value">-420 mL</p>
                    </div>

                    {/* GRAPH PREVIEW */}
                    <div className="preview-graph">
                        <div className="p-bar h30 delay1"></div>
                        <div className="p-bar h60 delay2"></div>
                        <div className="p-bar h45 delay3"></div>
                        <div className="p-bar h20 delay4"></div>
                        <div className="p-bar h55 delay5"></div>
                        <div className="p-bar h40 delay6"></div>
                    </div>

                    {/* EXCHANGE SAMPLE */}
                    <div className="preview-exchange">
                        <div className="ex-row">
                            <span className="ex-strength">1.5%</span>
                            <span className="ex-uf">UF: -120 mL</span>
                            <span className="ex-time">8:40 AM</span>
                        </div>
                        <div className="ex-row">
                            <span className="ex-strength">2.5%</span>
                            <span className="ex-uf">UF: -180 mL</span>
                            <span className="ex-time">12:10 PM</span>
                        </div>
                        <div className="ex-row">
                            <span className="ex-strength">4.25%</span>
                            <span className="ex-uf">UF: -120 mL</span>
                            <span className="ex-time">4:20 PM</span>
                        </div>
                    </div>

                </div>
            </div>



            {/* FEATURES SECTION */}
            <section className="features">
                <h2 className="section-header">What You Can Do</h2>

                <div className="feature-grid">
                    <div className="feature-card">
                        <span>💧</span>
                        <h3>Record PD Sessions</h3>
                        <p>Track fill, drain, Baxter strength & UF instantly.</p>
                    </div>

                    <div className="feature-card">
                        <span>📈</span>
                        <h3>Track UF Trends</h3>
                        <p>Graphs + insights help monitor fluid balance.</p>
                    </div>

                    <div className="feature-card">
                        <span>🧪</span>
                        <h3>Monitor Health</h3>
                        <p>Electrolytes & labs (coming soon).</p>
                    </div>

                    <div className="feature-card">
                        <span>👨‍⚕️</span>
                        <h3>Clinician Sharing</h3>
                        <p>Share summaries securely with your doctor.</p>
                    </div>
                </div>
            </section>

            {/* WHY IT MATTERS */}
            <section className="why-section">
                <h2 className="section-title">Why It Matters</h2>

                <ul className="why-list">
                    <li>✔ Maintain healthy fluid balance daily</li>
                    <li>✔ Reduce over-drain & under-drain risks</li>
                    <li>✔ Track UF behavior across weeks & months</li>
                    <li>✔ Improve communication with clinicians</li>
                </ul>
            </section>

            <footer className="footer">
                Made with ❤️ to support dialysis patients.
            </footer>
        </div>
    );
}
