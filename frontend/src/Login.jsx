import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

function Login({onLogin}) {

                const [email,setEmail]=useState("");
                const [password,setPassword]=useState("");
                const [error,setError]=useState("");

                const navigate=useNavigate();


                //_____________________________________________________________________________
                //async = function can perform an operation that takes some time
                    // e = antha e kulla type panna all details

                const handleSubmit=async(e)=>{

                    e.preventDefault(); //Default ah page ah reload agratha prevent pannum
                
                    setError("");

                    try {
                                //await → Wait for that operation to finish
                        const res=await fetch("https://lost2found-3l2n.onrender.com/api/auth/login",
                                                    {method:"POST",
                                                     headers: {"Content-Type":"application/json"} ,
                                                        //no need Authorization
                                                     body:
                                                        JSON.stringify
                                                                    ({email:email,   // in html -button onChange={(e)=>setEmail(e.target.value)}
                                                                    password:password })
                                                
                                                    }
                                            );
                        
                        //res.text → {"token":"abc123","username":"Safeeq"}                    
                        //Reading the response body can take time
                        const text=await res.text();
                                        //res.ok       // Was the request successful?
                                        //res.status   // 200, 401, etc.
                

                        let data=null;    //let - reassigned   const -cannot reassigned

                        if(text) 
                            {   try {
                                    data=JSON.parse(text);   //text->JSON ,so we get acess to data.token,data.username
                                } catch {        //JSON.parse("Invalid email or password") ❌=Error
                                    data=text;    // So store the plain text directly instead
                                }
                            }
 
                        //SUCCESSFUL✅
                        if(res.ok)   //store -> Login -> Dashboard
                                {
                                    localStorage.setItem("token",data.token);  //can be used later to prove user is logged in
                                    localStorage.setItem("username",data.username);
                                    localStorage.setItem("email",data.email);

                                    // Call the onLogin function received from App component
                                    onLogin();     //onLogin={()=>setIsLoggedIn(true)}
                                                // This changes the application's login state to true

                                    navigate("/dashboard"); 
                                }

                        //AUTH ERROR❌  
                        else if(res.status===401)  // Unauthorized → invalid email or password
                                    {setError("Invalid email or password.");} // Display an error message to the user

                        //OTHER ERROR❌
                        else 
                            // If backend sent an error message, display it
                            // Otherwise display the default "Login failed" message
                            {setError(data || "Login failed");}

                        

                    } catch(error) {

                        console.error("Login error:",error);

                        setError("Cannot connect to backend");

                    }
                };
                //________________________________________________________________________________________

                return (

                    <div className="auth-page">

                        <div className="auth-card">

                            <h1>VIT Lost & Found</h1>

                            <h2>Login</h2>

                            {error && (
                                    <p className="error-message">
                                        {error}
                                    </p>
                                    )
                            }
                            
                            {/* When the form is submitted, handleSubmit() is called */}
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

//If you have multiple buttons with type="submit" inside the same <form>,
//  then all of them can trigger the same onSubmit={handleSubmit}.