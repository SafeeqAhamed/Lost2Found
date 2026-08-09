import React from "react";
import { useNavigate } from "react-router-dom";

import "./App.css";

function Dashboard() {

    const navigate=useNavigate();

    const username=localStorage.getItem("username");
    const email=localStorage.getItem("email");

    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            <div className="dashboard-card">

                <h1>VIT Lost & Found</h1>

                <div className="welcome">
                    Welcome, {username}!
                </div>

                <div className="email">
                    {email}
                </div>

                <hr />

                <h2>What do you want to do?</h2>

                <div className="dashboard-buttons">

                    <button
                        className="lost-button"
                        onClick={()=>navigate("/lost")}
                    >
                        Lost Items
                    </button>

                    <button
                        className="found-button"
                        onClick={()=>navigate("/found")}
                    >
                        Found Items
                    </button>

                </div>

                <hr />

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Dashboard;