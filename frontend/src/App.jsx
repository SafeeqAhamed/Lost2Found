import React,{useState} from "react";
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./App.css";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import LostItems from "./LostItems";
import FoundItems from "./FoundItems";

function App() {

    const [isLoggedIn,setIsLoggedIn]=useState(
        !!localStorage.getItem("token")
    );

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={
                    <Login
                        onLogin={()=>setIsLoggedIn(true)}
                    />
                }
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                path="/dashboard"
                element={
                    isLoggedIn
                        ? <Dashboard />
                        : <Navigate to="/login" />
                }
            />

            <Route
                path="/lost"
                element={<LostItems />}
            />

            <Route
                path="/found"
                element={<FoundItems />}
            />

        </Routes>

    );
}

export default App;