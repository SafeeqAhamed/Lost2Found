import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

import "./Items.css";

function FoundItems() {

 
// Stores all found items received from the backend
const [items,setItems]=useState([]);      //[ {} ,{}]
const [itemName,setItemName]=useState(""); 

const [location,setLocation]=useState("");
const [date,setDate]=useState("");

const navigate=useNavigate();

const token=localStorage.getItem("token");  //// Used to prove to the backend that the user is authenticated
const loggedInEmail=localStorage.getItem("email");  //// Used later to decide whether to show the Delete button

const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    navigate("/login");
};
 

// GETFOUNDITEMS -> ADD + DELETE

//______________________________
//Getting and storing in variable items[]
const getFoundItems=async()=>{             //Has to be called after adding||removing
 
    try {

        const res=await fetch("https://lost2found-3l2n.onrender.com/api/found",
                                    {headers:{
                                            Authorization:`Bearer ${token}`
                                           }
                                    //method default=get
                                    //Body- no needed for get
                                    }
                            );

        //AUTH PROBLEM❌
        if(res.status===401)   // If token is invalid/expired, backend returns 401 Unauthorized
                        {logout(); 
                        return;}
        
        //SUCCESSFUL✅
        else if(res.ok)             // If item was successfully added
             {const data=await res.json();
             // Store all received found items in the items state to update the UI
             setItems(data);}

        //OTHER PROBLEM
        else 
            {console.log("Failed to get found items");}

    } catch(err)
              {console.log("Error:",err);}

    
};
 

//_____________________________________________________________________________________________________________
//When the FoundItems page opens for the first time, useEffect calls getFoundItems() to get all items from the database.

 
// useEffect runs automatically when this component first loads
useEffect(()=>{ getFoundItems(); },[]);
 // [] means: run only once when the component first loads
 

//________________________________
const addFoundItem=async(e)=>{   //sending data-event

 
    e.preventDefault();

    try {

        const res=await fetch("https://lost2found-3l2n.onrender.com/api/found",
                                    {   method:"POST",
                                        headers:
                                              {"Content-Type":"application/json",   //tells the backend:
                                                                                    //"The data I am sending in the request body is JSON."
                                                                                    //if not  sending any data as body -no needed
                                                Authorization:`Bearer ${token}`
                                             },
                                        body:JSON.stringify(
                                                            {itemName:itemName, //// in html -button onChange={(e)=>name(e.target.value)}
                                                         
                                                            location:location,
                                                            date:date}
                                                         )
                                   }
                            );

         //AUTH PROBLEM❌
        if(res.status===401) // If authentication fails, logout the user
            {logout();
            return;}
        
        //SUCCESSFUL✅
        if(res.ok)                 // If item was successfully added -clear and get total list again
            {setItemName("");     
                      //clear variables
            setLocation("");
            setDate("");

            getFoundItems();}     // Get the updated list of found items from database
         
        //OTHER PROBLEM❌
        else 
           {console.log("Failed to add found item");}

    } catch(err) 
             {console.log("Error:",err);}
    
};
 

//________________________________
const deleteItem=async(id)=>{    //Delete -if success- Call Get all details again

 
    try {

        const res=await fetch(`https://lost2found-3l2n.onrender.com/api/found/${id}`,
                                        {method:"DELETE",
                                        headers:
                                            {Authorization:`Bearer ${token}`}
                                        //body-not needed
                                       }
                            );

        //AUTH PROBLEM❌
        if(res.status===401)     // If token is invalid/expired, logout
                    {logout();
                    return;}
        
        //SUCCESSFUL✅
        if(res.ok)       // If deletion was successful
               {getFoundItems();}   //update the page
        
        //OTHER PROBLEM❌
        else 
            {console.log("Failed to delete found item");}

    } catch(err) 
             {console.log("Error:",err);}
    
};
 

//__________________________________________________________________________________________________
return (

 
    <div className="found-page">

        <div className="found-container">

            <div className="found-header">

                <h1>Found Items</h1>

                <button
                    className="found-back-button"
                    onClick={()=>navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </div>

            <div className="found-report-card">

                <h2>Report Found Item</h2>

                <form onSubmit={addFoundItem}>

                    <div className="found-form-group">

                        <label>Item Name</label>

                        <input
                            type="text"
                            placeholder="Example: Black Wallet"
                            value={itemName}
                            onChange={(e)=>setItemName(e.target.value)}
                            required
                        />

                    </div>

 

                    <div className="found-form-group">

                        <label>Location</label>

                        <input
                            type="text"
                            placeholder="Example: Library"
                            value={location}
                            onChange={(e)=>setLocation(e.target.value)}
                            required
                        />

                    </div>

                    <div className="found-form-group">

                        <label>Date</label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e)=>setDate(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="found-submit-button"
                    >
                        Report Found Item
                    </button>

                </form>

            </div>

            <div className="found-section">

                <h2>All Found Items</h2>

                {/* If there are no items, show this message */}
                {items.length===0 &&       //value + data type
                                (<div className="found-empty">
                                    No found items reported yet.
                                </div>
                               )
                }

                <div className="found-grid">

                    {items.map((item)=>(

                        <div
                            className="found-card"
                            key={item.id}        // key helps React identify each item uniquely
                        >

                            <h3>{item.itemName}</h3>

                            <p>
                                <strong>Category:</strong> {item.category}
                            </p>

                            <p>
                                <strong>Location:</strong> {item.location}
                            </p>

                            <p>
                                <strong>Date:</strong> {item.date}
                            </p>

                            <p>
                                <strong>Reported by:</strong> {item.username}
                            </p>

                            <p>
                                <strong>Email:</strong> {item.email}
                            </p>

                            {/* Show Delete button ONLY if this item belongs to
                                the currently logged-in user */}

                            {item.email===loggedInEmail && (

                                <button
                                    className="found-delete-button"
                                    onClick={()=>deleteItem(item.id)}
                                >
                                    Delete
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    </div>
);


}

export default FoundItems;
