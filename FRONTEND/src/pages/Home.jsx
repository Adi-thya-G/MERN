import React, { useEffect, useState } from 'react'
import {  MdNotificationsNone } from 'react-icons/md';
import Card from '../components/Card.jsx';
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineChat, } from 'react-icons/hi';
import { RiHome4Line } from "react-icons/ri";
import {  useDispatch, useSelector } from 'react-redux';
import { setSocketId } from '../store/authSlice.js';
import { useNavigate } from "react-router";
import { home } from '../lib/api.js';
import socket from '../socket'
import Loading from '../components/Loading.jsx';


function Home() {
  const [response,setresponse]=useState([])
  const [loading,setLoading]=useState(false)
  const selector=useSelector((state)=>state.auth.socket_id)
  const navigate=useNavigate()
  console.log(selector)

 useEffect(()=>{
  setLoading(true)
  home().then((res)=>{
    
    setresponse(res?.data?.data)
    setLoading(false)
  })
 },[])

  if(loading)
       return <Loading/>
  else
     return (
   
   <div className='w-full h-screen flex flex-col md:justify-center '>
     <div className='w-full h-full  bg-white  md:w-[600px] lg:w-[900px] md:mx-auto' >
        <div className='fixed w-full bg-white md:w-[600px] lg:w-[900px]'>
           <div className='flex gap-4 p-3 justify-between '>
          <h3 className='bg-gradient-to-tr from-blue-600  to-purple-700 bg-clip-text text-[17px] text-transparent font-serif'>Snapchat</h3>
          <span className=' rounded-full p-2 bg-zinc-100 relative flex justify-center'>
            <span className='bg-red-400 w-4 h-4 absolute right-1  -top-1 rounded-full text-white text-[10px] text-center'>15</span>
            <MdNotificationsNone size={24}  className='border-1 border-blue-400 text-gray-700 '/></span>
          
         </div>
         <div className='flex gap-3 p-2 overflow-x-auto scrollbar-hide pb-6 '>
  <div className=' p-0.5 flex-shrink-0  flex justify-center bg-green-400 rounded-full'>
           <div className=' p-0.5 flex justify-center items-end bg-white rounded-full relative'>
             
              <img src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D " className='rounded-full w-[60px] h-[60px]' alt="" />
             <span className='w-[25px] h-[25px] absolute flex bg-green-500 right-0 -bottom-1 rounded-full border-[1.9px] justify-center border-white text-gray-900 font-semibold'>+</span>

              
           </div>
           
          </div>
          {
            [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}].map((ele)=>(<div className=' p-0.5 flex-shrink-0  flex justify-center bg-green-400 rounded-full'>
           <div className=' p-0.5 flex justify-center bg-white rounded-full'>
             <div>
              <img src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D " className='rounded-full w-[60px] h-[60px]' alt="" />
             </div>
           </div>
          </div>))
          }
        
         

         </div>
        </div>
         <div className='p-2 pt-44 bg-gray-50 overflow-y-auto flex flex-col gap-3  pb-16'>
          {
           response?.map((ele)=>(
            <Card ele={ele}/>
           ))
          }
         
         </div>
         <div className='fixed bottom-0 bg-white w-full md:w-[600px] lg:w-[900px] h-12 rounded-b-md flex p-3 gap-3 justify-between'>
          <button onClick={()=>{
            navigate("/profile")

          }}>
          <span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500 bg-slate-50'>< FaRegUser color='black' /></span></button>
         
          <button
          onClick={(e)=>navigate("/chat")}
          ><span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500'><  HiOutlineChat className= ' text-2 text-gray-900'/></span>
                  </button>
                    
<button onClick={(e)=>navigate("/")}>

  <span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500'> <RiHome4Line className= ' text-xl text-gray-900'/></span>
</button>
                     <span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500'>< IoSettingsOutline className= ' text-xl text-gray-900'/></span>
                  
         </div>
   
     </div>

   </div>
   



  )
}

export default Home