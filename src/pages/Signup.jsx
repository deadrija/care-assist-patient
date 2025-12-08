import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        hospitalId: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        console.log("Signup:", form);
        // your signup logic here
    };

    return (
        <div className="auth-wrapper">

            <Link className="back-home-btn" to="/">
                ← Home
            </Link>

            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo-container">
                    <img src="/logo.png" alt="Logo" className="auth-logo" />
                </div>

                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join CARE-ASSIST today</p>

                {/* INPUTS */}
                <input
                    type="text"
                    className="auth-input"
                    placeholder="Username"
                    name="username"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    className="auth-input"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    className="auth-input"
                    placeholder="Hospital ID"
                    name="hospitalId"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    className="auth-input"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                />

                <button className="auth-btn" onClick={handleSignup}>
                    Sign Up
                </button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}
