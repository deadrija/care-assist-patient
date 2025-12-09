import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/Home.css";

export default function Home() {
    const heroRef = useRef(null);

    useEffect(() => {
        // ============= GSAP PAGE ENTER ANIMATIONS =============
        gsap.from(heroRef.current, { opacity: 0, y: 20, duration: 0.6 });
        gsap.from(".phone-preview", { opacity: 0, y: 25, duration: 0.7, delay: 0.1 });
        gsap.from(".feature-card", { opacity: 0, y: 15, stagger: 0.1, delay: 0.3 });
        gsap.from(".why-list li", { opacity: 0, x: -10, stagger: 0.1, delay: 0.4 });

        // ============= PARALLAX INTERACTION =============
        const phone = document.querySelector(".phone-preview");
        const screen = document.querySelector(".preview-screen");
        const bars = document.querySelectorAll(".p-bar");
        const rows = document.querySelectorAll(".ex-row");

        if (!phone) return;

        const handleParallax = (e) => {
            if (window.innerWidth < 768) return; // Disable parallax for mobile

            const rect = phone.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Device tilt
            phone.style.setProperty("--tiltX", `${y * 8}deg`);
            phone.style.setProperty("--tiltY", `${x * 8}deg`);

            // Screen parallax (inner layer)
            screen.style.setProperty("--px", `${x * 14}px`);
            screen.style.setProperty("--py", `${y * 14}px`);

            // Graph bar depth movement
            bars.forEach((bar, i) => {
                bar.style.transform = `translateY(${y * (8 + i * 2.5)}px)`;
            });

            // Exchange rows depth movement
            rows.forEach((row, i) => {
                row.style.transform = `translateY(${y * (6 + i * 2)}px)`;
            });
        };

        const handleLeave = () => {
            phone.style.setProperty("--tiltX", "6deg");
            phone.style.setProperty("--tiltY", "2deg");
            screen.style.setProperty("--px", "0px");
            screen.style.setProperty("--py", "0px");

            bars.forEach((bar) => (bar.style.transform = ""));
            rows.forEach((row) => (row.style.transform = ""));
        };

        phone.addEventListener("mousemove", handleParallax);
        phone.addEventListener("mouseleave", handleLeave);

        return () => {
            phone.removeEventListener("mousemove", handleParallax);
            phone.removeEventListener("mouseleave", handleLeave);
        };
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

            {/* PREMIUM PARALLAX PHONE MOCKUP */}
            <div className="phone-preview">
                <div className="preview-screen">

                    {/* DASHBOARD HEADER */}
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

                    {/* EXCHANGE PREVIEW */}
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
                            <span className="ex-strength">7.5%</span>
                            <span className="ex-uf">UF: -120 mL</span>
                            <span className="ex-time">4:20 PM</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* FEATURES */}
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

            {/* WHY SECTION */}
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
