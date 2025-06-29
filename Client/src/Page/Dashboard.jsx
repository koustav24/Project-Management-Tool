import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WebLayout from "../component/Layouts/WebLayout";
import { useDispatch } from "react-redux";
import { userNotExists } from "../redux/reducers/auth";

const Dashboard = () => {
  const dispatch=useDispatch();
  const [user, setUser] = useState(null);
  const navigate=useNavigate()


  useEffect(() => {
    const fetchy=async()=>{
      try {
        console.log(1)
        const {data}=await axios.get("http://localhost:3000/me", { 
          withCredentials: true,
          headers:{
            "Content-Type":"application/json",
        } 
      })  
      setUser(()=>data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchy();
    console.log(user)
  }, []);

  
  const handleLogout = async() => {

    try {
      await axios.post("http://localhost:3000/logout",{},{withCredentials: true })
      setUser(null);
      dispatch(userNotExists())    
      navigate("/signin ");
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div>
      <h1>DashyBoard</h1>
      {console.log(user)}
      {user ? (
        <>
          <h1>Welcome, {user.name}!</h1>
          <img src={user?.profilePic} alt="Profile" />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};

export default WebLayout()(Dashboard);
