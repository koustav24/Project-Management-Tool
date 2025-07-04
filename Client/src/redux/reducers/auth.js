import {createSlice} from '@reduxjs/toolkit'

const initialState={
    user:null,
    isAdmin:false,
    loader:true,
}

const AuthSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        userExists:(state,action)=>{
            state.user=action.payload;
            state.loader=false
        },
        userNotExists:(state)=>{
            state.user=null;
            state.loader=false;
        }
    }
})

export default AuthSlice;

export const{userExists,userNotExists}=AuthSlice.actions;