import { createContext, useContext, useMemo } from "react";
import { Outlet } from "react-router-dom";
import io from 'socket.io-client'

const SocketContext=createContext();

const getSocket=()=>useContext(SocketContext)

const SocketProvider=(({children})=>{
    const socket=useMemo(()=>io("http://localhost:3000",{withCredentials:true})
    ,[])

    return(
        <SocketContext.Provider value={socket}>
            {children}
            <Outlet />
        </SocketContext.Provider>
    )

})

export {getSocket,SocketProvider}