import {createSlice} from '@reduxjs/toolkit'

 const initialState={
  status:false,
  userData:null,
  currentRouter:null,
  socket_id:null,
  size:false
 }

 const authSlice=createSlice(
  {
    name:"auth",
    initialState,
    reducers:{
      authLogin:(state,action)=>{
        state.status=true
        state.userData=action.payload
      },
      currentRouterFn:(state,action)=>{
        state.currentRouter=action.payload
      },
      setSocketId:(state,action)=>{
        state.socket_id=action.payload
      },
      setSize:(state,action)=>{
        state.size=action.payload
      }

      

    }
  }
 )
 export const{ authLogin ,currentRouterFn ,setSocketId,setSize}=authSlice.actions

 export default authSlice.reducer