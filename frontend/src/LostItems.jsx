import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

import "./Items.css";


function LostItems() {
    // Stores all lost items received from the backend
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

// GETLOSTITEMS -> ADD + DELETE

//______________________________
    const getLostItems=async()=>{             //Has to be called after adding||removing 

        try {

            const res=await fetch("https://lost2found-3l2n.onrender.com/api/lost",
                                        {headers:{
                                                Authorization:`Bearer ${token}`
                                                }
                                        //method default=get
                                        //kondu varathuku BODY ethuvum kuduka vendam
                                         }
                                 );
  
            //AUTH PROBLEM❌
            if(res.status===401)   // // If token is invalid/expired, backend returns 401 Unauthorized
                            {logout(); 
                            return;}
            //SUCCESSFUL✅
            else if(res.ok)             // If item was successfully added
                 {const data=await res.json();
                 // Store all received lost items in the items state  to update the UI
                 setItems(data);}

            //OTHER PROBLEM
            else 
                {console.log("Failed to get lost items");}

        } catch(err) 
                  {console.log("Error:",err);}

        
    };
    
//_____________________________________________________________________________________________________________
    //When the LostItems page opens for the first time, useEffect calls getLostItems() to get all items from the database.

    // useEffect runs automatically when this component first loads
    useEffect(()=>{ getLostItems(); },[]);
     // [] means: run only once when the component first loads

//________________________________

    // When we submit a form, the browser automatically reloads the page by default
    // We use the event object (e) to prevent that default behavior
    const addLostItem=async(e)=>{   //sending data-event

        e.preventDefault();

        try {

            const res=await fetch("https://lost2found-3l2n.onrender.com/api/lost",
                                        {   method:"POST",
                                            headers:
                                                  {"Content-Type":"application/json",   //tells the backend:
                                                                                        //"The data I am sending in the request body is JSON."
                                                                                        //if not  sending any data as body -no needed
                                                    Authorization:`Bearer ${token}`
                                                  },
                                            body:JSON.stringify(
                                                                {itemName:itemName,  //// in html -button onChange={(e)=>setname(e.target.value)}
                                                              
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

                getLostItems();}     // Get the updated list of lost items from database
             
            //OTHER PROBLEM❌
            else 
               {console.log("Failed to add lost item");}

            

        } catch(err) 
                 {console.log("Error:",err);}

        
    };
//________________________________
    const deleteItem=async(id)=>{    //Delete -if success- Call Get all details again

        try {

            const res=await fetch(`https://lost2found-3l2n.onrender.com/api/lost/${id}`,
                                            {method:"DELETE",
                                            headers:
                                                {Authorization:`Bearer ${token}`}
                                                //vo
                                            }
                                 );
            //AUTH PROBLEM❌
            if(res.status===401)     // If token is invalid/expired, logout
                        {logout();
                        return;}
            
            //SUCCESSFUL✅
            if(res.ok)       // If deletion was successful
                   {getLostItems();}   //update the page
            
            //OTHER PROBLEM❌
            else 
                {console.log("Failed to delete lost item");}

            

        } catch(err) 
                 {console.log("Error:",err);}

        
    };
//__________________________________________________________________________________________________
    return (

        <div className="items-page">

            <div className="items-container">

                <div className="items-header">

                    <h1>Lost Items</h1>

                    <button
                        className="back-button"
                        onClick={()=>navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>

                </div>

                <div className="report-card">

                    <h2>Report Lost Item</h2>

                    <form onSubmit={addLostItem}>

                        <div className="form-group">

                            <label>Item Name</label>

                            <input
                                type="text"
                                placeholder="Example: Black Wallet"
                                value={itemName}
                                onChange={(e)=>setItemName(e.target.value)}
                                required
                            />

                        </div>

 

                        <div className="form-group">

                            <label>Location</label>

                            <input
                                type="text"
                                placeholder="Example: Library"
                                value={location}
                                onChange={(e)=>setLocation(e.target.value)}
                                required
                            />

                        </div>

                        <div className="form-group">

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
                            className="form-submit"
                        >
                            Report Lost Item
                        </button>

                    </form>

                </div>

                <div className="items-section">

                    <h2>All Lost Items</h2>
                   
                     {/* If there are no items, show this message */}
                    {items.length===0 &&       //value + data type
                                    (<div className="empty-message">
                                        No lost items reported yet.
                                    </div>
                                    )
                    }

                    <div className="items-grid">

                        {items.map((item)=>(

                            <div
                                className="item-card"
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
                                                                    className="delete-button"
                                                                    onClick={()=>deleteItem(item.id)}
                                                                >
                                                                    Delete
                                                                </button>

                                                               )
                                }

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default LostItems;