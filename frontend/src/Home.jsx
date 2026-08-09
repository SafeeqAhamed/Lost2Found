import React from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* The background graphics are handled by CSS pseudo-elements (::before/::after) */}
            
            <div className="home-card">
                {/* Decorative top gradient bar */}
                <div className="card-deco-bar"></div>

                {/* Container needed for the glow effect */}
                <div className="home-icon-container">
                    <div className="home-icon">
                        {/* You could replace this emoji with an <img> or <svg> for even more grandeur */}
                        🔎
                    </div>
                </div>

                <h1>VIT Lost & Found</h1>

                <p className="home-tagline">
                    Find what you lost. Return what you found.
                </p>

                <p className="home-description">
                    A premium, simple platform for VIT students to effortlessly report,
                    discover, and recover lost belongings within our campus community.
                </p>

                {/* ADDED QUOTE SECTION */}
                <div className="home-quote-container">
                    <p className="home-quote">
                        "Integrity is doing the right thing, even when no one is watching."
                    </p>
                </div>

                <div className="home-buttons">
                    <button
                        className="home-login-button"
                        onClick={() => navigate("/login")}
                    >
                        {/* Simple text is grander than icons here, but you could add them if desired */}
                        Sign In to Your Account
                    </button>

                    <button
                        className="home-signup-button"
                        onClick={() => navigate("/signup")}
                    >
                        Join the Community
                    </button>
                </div>

                <div className="home-footer">
                    {/* Placeholder for a small VIT logo if you have one, otherwise just text is fine */}
                    {/* <div className="vit-logo-placeholder"></div> */}
                    <span>Exclusively for the VIT Student Community</span>
                </div>
            </div>
        </div>
    );
}

export default Home;