import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
    const navigate = useNavigate();

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
        try {
            const { username, email, hospitalId, password } = form;

            // 1️⃣ Validate required fields
            if (!username || !email || !hospitalId || !password) {
                alert("Please fill all fields.");
                return;
            }

            // 2️⃣ Create user in Supabase Auth
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            });

            if (signupError) {
                alert(signupError.message);
                return;
            }

            const authUser = signupData.user;

            // 3️⃣ Insert into patients table
            const { error: patientError } = await supabase.from("patients").insert({
                auth_id: authUser.id,
                username,
                email,
                hospital_id: hospitalId
            });

            if (patientError) {
                alert(patientError.message);
                return;
            }

            alert("Account created! You can now log in.");
            navigate("/login");

        } catch (err) {
            console.error(err);
            alert("Unexpected error occurred.");
        }
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
