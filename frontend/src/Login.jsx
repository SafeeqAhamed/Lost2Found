import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

function Login({onLogin}) {

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [error,setError]=useState("");

const navigate=useNavigate();

const handleSubmit=async(e)=>{
    e.preventDefault();

    setError("");

    try {

        const res=await fetch("https://lost2found-3l2n.onrender.com/api/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        });

        const text=await res.text();

        let data=null;

        if(text) {
            try {
                data=JSON.parse(text);
            } catch {
                data=text;
            }
        }

        if(res.ok) {

            localStorage.setItem("token",data.token);
            localStorage.setItem("username",data.username);
            localStorage.setItem("email",data.email);

            navigate("/dashboard");

        } else if(res.status===401) {

            setError("Unauthorized request. Please login again.");

        } else {

            setError(data || "Login failed");

        }

    } catch(error) {

        console.error("Login error:",error);

        setError("Cannot connect to backend");

    }
};

return (
    <div className="auth-page">

        <div className="auth-card">

            <h1>VIT Lost & Found</h1>

            <h2>Login</h2>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="form-submit"
                >
                    Login
                </button>

            </form>

            <div className="auth-link">

                <span>Don't have an account? </span>

                <button onClick={()=>navigate("/signup")}>
                    Create Account
                </button>

            </div>

        </div>

    </div>
);

}

export default Login;