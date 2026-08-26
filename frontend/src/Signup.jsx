import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

import "./Signup.css";

function Signup() {

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");

    const navigate=useNavigate();

//___________________________________________________________________________________________
    const handleSubmit=async(e)=>{
        e.preventDefault();

        setError("");

        if(!email.endsWith("@vitstudent.ac.in"))
                        {setError("Only VIT student emails are allowed.");
                        return; }
       

        try {

            const res=await fetch("https://lost2found-3l2n.onrender.com/api/auth/register",
                                        {method:"POST",
                                        headers:{"Content-Type":"application/json"},
                                        body:JSON.stringify(
                                                            {username:username,
                                                            email:email,
                                                            password:password }
                                                        )
                                        }
                                 );

            //Reading the response body can take time
            const text=await res.text();

            //res.ok       // Was the request successful?
            //res.status   // 200, 400, etc.

            let data=null;    //let - reassigned   const -cannot reassigned

            if(text)
                {
                    try {
                        //If backend sends JSON, convert text to JavaScript object
                        data=JSON.parse(text);
                    } catch {
                        //If backend sends plain text, store it directly
                        data=text;
                    }
                }

            //SUCCESSFUL✅
            if(res.ok)
                {
                    alert("Registration successful! Please login.");

                    navigate("/login");
                }

            //ERROR❌
            else
                {
                    //If backend sent an error message, display it
                    //Otherwise display the default "Registration failed" message
                    setError(data || "Registration failed");
                    return;
                }

        } catch(err)
            {console.error(err);
             setError("Server is not reachable.");}

        
    };

//___________________________________________________________________________________________
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