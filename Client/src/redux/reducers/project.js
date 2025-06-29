import { createSlice } from "@reduxjs/toolkit"
import { getOrSaveFromLocalStorage } from "../../component/utility/features";


const initialState={
    notificationsCount:getOrSaveFromLocalStorage({key:'Notify',get:true,
        userId:localStorage.getItem("userId")}),
}

const projectSlice=createSlice({
    name:"project",
    initialState,
    reducers:{
        incNotifications:(state,action)=>{
            state.notificationsCount+=1;
            getOrSaveFromLocalStorage({key:'Notify',value:state.notificationsCount,
                userId:action.payload?.userId || localStorage.getItem("userId")})
            // localStorage.setItem("Notify",state.notificationsCount)
        },
        resetNotifications:(state,action)=>{
            state.notificationsCount=0;
            
            getOrSaveFromLocalStorage({key:'Notify',value:0,userId: action.payload?.userId || localStorage.getItem("userId")})
            // localStorage.setItem("Notify", "0");
        }
    }
})

export default projectSlice;

export const{incNotifications,resetNotifications}=projectSlice.actions;