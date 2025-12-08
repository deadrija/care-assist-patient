import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Auth.css";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password
        });

        if (error) return alert(error.message);

        navigate("/dashboard");
    };

    return (
        <div className="auth-wrapper">

            {/* BACK BUTTON */}
            <Link to="/" className="back-home-btn">← Home</Link>

            <div className="auth-card">

                {/* LOGO */}
                <div className="auth-logo-container">
                    <img src="/logo.png" alt="CARE-ASSIST logo" className="auth-logo" />
                </div>

                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Log in to continue</p>

                <input
                    name="email"
                    className="auth-input"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    className="auth-input"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button className="auth-btn" onClick={handleLogin}>
                    Log In
                </button>

                <p className="auth-switch">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
