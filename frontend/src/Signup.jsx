import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

import "./Signup.css";

function Signup() {

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");

    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();

        setError("");

        if(!email.endsWith("@vitstudent.ac.in")){
            setError("Only VIT student emails are allowed.");
            return;
        }

        try {

            const res=await fetch("http://localhost:8081/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    username:username,
                    email:email,
                    password:password
                })
            });

            const data=await res.json();

            if(!res.ok){
                setError(typeof data==="string" ? data : "Registration failed");
                return;
            }

            alert("Registration successful! Please login.");

            navigate("/login");

        } catch(err) {

            console.error(err);
            setError("Server is not reachable.");

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>VIT Lost & Found</h1>

                <h2>Create Account</h2>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your VIT email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="form-submit"
                    >
                        Sign Up
                    </button>

                </form>

                <div className="auth-link">

                    <span>Already have an account? </span>

                    <button onClick={()=>navigate("/login")}>
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Signup;