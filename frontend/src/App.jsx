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
                                                //localStorage.setItem("token",data.token);   
    const [isLoggedIn,setIsLoggedIn]=useState( !!localStorage.getItem("token") );   //!reverse !!back in boolean

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
                        onLogin={()=>setIsLoggedIn(true)}  //When login is successful, call this function.
                    />                    // We are passing the onLogin function as a prop
                                         // so that it can be used inside the Login component
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