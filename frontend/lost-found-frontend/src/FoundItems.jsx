import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

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

        const res=await fetch("http://localhost:8081/api/found",{
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

        const res=await fetch("http://localhost:8081/api/found",{
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

        const res=await fetch(`http://localhost:8081/api/found/${id}`,{
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

    <div style={{
        maxWidth:"700px",
        margin:"40px auto",
        padding:"20px",
        fontFamily:"Arial"
    }}>

        <h1>Found Items</h1>

        <button onClick={()=>navigate("/dashboard")}>
            Back to Dashboard
        </button>

        <hr />

        <h2>Report Found Item</h2>

        <form onSubmit={addFoundItem}>

            <div style={{marginBottom:"15px"}}>

                <label>Item Name</label>

                <br />

                <input
                    type="text"
                    placeholder="Example: Black Wallet"
                    value={itemName}
                    onChange={(e)=>setItemName(e.target.value)}
                    required
                    style={{
                        width:"100%",
                        padding:"10px",
                        marginTop:"5px",
                        boxSizing:"border-box"
                    }}
                />

            </div>

            <div style={{marginBottom:"15px"}}>

                <label>Category</label>

                <br />

                <input
                    type="text"
                    placeholder="Example: Accessories"
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                    required
                    style={{
                        width:"100%",
                        padding:"10px",
                        marginTop:"5px",
                        boxSizing:"border-box"
                    }}
                />

            </div>

            <div style={{marginBottom:"15px"}}>

                <label>Location</label>

                <br />

                <input
                    type="text"
                    placeholder="Example: Library"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                    required
                    style={{
                        width:"100%",
                        padding:"10px",
                        marginTop:"5px",
                        boxSizing:"border-box"
                    }}
                />

            </div>

            <div style={{marginBottom:"15px"}}>

                <label>Date</label>

                <br />

                <input
                    type="date"
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                    required
                    style={{
                        padding:"10px",
                        marginTop:"5px"
                    }}
                />

            </div>

            <button type="submit">
                Report Found Item
            </button>

        </form>

        <hr />

        <h2>All Found Items</h2>

        {items.length===0 && (
            <p>No found items reported yet.</p>
        )}

        {items.map((item)=>(

            <div
                key={item.id}
                style={{
                    border:"1px solid #ccc",
                    padding:"15px",
                    marginBottom:"15px"
                }}
            >

                <h3>{item.itemName}</h3>

                <p>Category: {item.category}</p>

                <p>Location: {item.location}</p>

                <p>Date: {item.date}</p>

                <p>Reported by: {item.username}</p>

                <p>Email: {item.email}</p>

                {item.email===loggedInEmail && (

                    <button onClick={()=>deleteItem(item.id)}>
                        Delete
                    </button>

                )}

            </div>

        ))}

    </div>

);

}

export default FoundItems;