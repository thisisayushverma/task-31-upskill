import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();
    const [user,setUser] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const fetchData = async ()=>{
        const token = localStorage.getItem("auth-key");
        if(!token){
            navigate('/login')
            return;
        }

        const userData = await fetch(`${backendUrl}/home`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':token
            }
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            setUser(data.user)
        })

    }
    useEffect(()=>{
        fetchData()
    },[])
  return (
    <div>
      <h1>
        Your are on main page
      </h1>
      {
        user && (
            <div>
                <h1>{user.name}</h1>
                <h1>{user.email}</h1>
            </div>
        )
      }
    </div>

  )
}

export default Main
