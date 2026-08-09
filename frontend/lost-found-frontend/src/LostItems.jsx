import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

function LostItems() {

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

    const getLostItems=async()=>{

        try {

            const res=await fetch("http://localhost:8081/api/lost",{
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

                console.log("Failed to get lost items");

            }

        } catch(err) {

            console.log("Error:",err);

        }
    };

    useEffect(()=>{
        getLostItems();
    },[]);

    const addLostItem=async(e)=>{

        e.preventDefault();

        try {

            const res=await fetch("http://localhost:8081/api/lost",{
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

                getLostItems();

            } else {

                console.log("Failed to add lost item");

            }

        } catch(err) {

            console.log("Error:",err);

        }
    };

    const deleteItem=async(id)=>{

        try {

            const res=await fetch(`http://localhost:8081/api/lost/${id}`,{
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

                getLostItems();

            } else {

                console.log("Failed to delete lost item");

            }

        } catch(err) {

            console.log("Error:",err);

        }
    };

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

                            <label>Category</label>

                            <input
                                type="text"
                                placeholder="Example: Accessories"
                                value={category}
                                onChange={(e)=>setCategory(e.target.value)}
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

                    {items.length===0 && (
                        <div className="empty-message">
                            No lost items reported yet.
                        </div>
                    )}

                    <div className="items-grid">

                        {items.map((item)=>(

                            <div
                                className="item-card"
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
                                        className="delete-button"
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

export default LostItems;