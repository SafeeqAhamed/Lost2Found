import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

import "./Items.css";

function FoundItems() {

    const [items,setItems]=useState([]);
    const [itemName,setItemName]=useState("");
    const [category,setCategory]=useState("");
    const [location,setLocation]=useState("");
    const [date,setDate]=useState("");

    const navigate=useNavigate();

    const token=localStorage.getItem("token");
    const loggedInEmail=localStorage.getItem("email");

    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        navigate("/login");
    };

    const getFoundItems=async()=>{

        try {

            const res=await fetch("https://lost2found-3l2n.onrender.com/api/found",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });

            if(res.status===401) {
                logout();
                return;
            }

            if(res.ok) {

                const data=await res.json();

                setItems(data);

            } else {

                console.log("Failed to get found items");

            }

        } catch(err) {

            console.log("Error:",err);

        }
    };

    useEffect(()=>{
        getFoundItems();
    },[]);

    const addFoundItem=async(e)=>{

        e.preventDefault();

        try {

            const res=await fetch("https://lost2found-3l2n.onrender.com/api/found",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                },
                body:JSON.stringify({
                    itemName:itemName,
                    category:category,
                    location:location,
                    date:date
                })
            });

            if(res.status===401) {
                logout();
                return;
            }

            if(res.ok) {

                setItemName("");
                setCategory("");
                setLocation("");
                setDate("");

                getFoundItems();

            } else {

                console.log("Failed to add found item");

            }

        } catch(err) {

            console.log("Error:",err);

        }
    };

    const deleteItem=async(id)=>{

        try {

            const res=await fetch(`https://lost2found-3l2n.onrender.com/api/found/${id}`,{
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });

            if(res.status===401) {
                logout();
                return;
            }

            if(res.ok) {

                getFoundItems();

            } else {

                console.log("Failed to delete found item");

            }

        } catch(err) {

            console.log("Error:",err);

        }
    };

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

                            <label>Category</label>

                            <input
                                type="text"
                                placeholder="Example: Accessories"
                                value={category}
                                onChange={(e)=>setCategory(e.target.value)}
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

                    {items.length===0 && (
                        <div className="found-empty">
                            No found items reported yet.
                        </div>
                    )}

                    <div className="found-grid">

                        {items.map((item)=>(

                            <div
                                className="found-card"
                                key={item.id}
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