import React, { useEffect, useState } from 'react'
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineChat, } from 'react-icons/hi';
import { RiHome4Line } from "react-icons/ri";
import { FaPaperPlane } from 'react-icons/fa';
import {Outlet, useNavigate } from 'react-router'
import { currentRouterFn } from '../store/authSlice';
import {useSelector,useDispatch} from 'react-redux'
import socket from '../socket';
import {getAllFriends,searchFunction} from '../lib/api'
import NoDataFound from '../components/NoDataFound';
function Chat() {
  const [friendsList,setFriendsList]=useState([])
  const [search,setsearch]=useState("")
  const navigate=useNavigate()
  const size=useSelector((state)=>state?.auth?.size)

  useEffect(()=>{
    getAllFriends().then((res)=>{
      setFriendsList(res?.data?.data)
      console.log(res)
    })
  },[])
  

const helper = async (element) => {
  setFriendsList((pre) =>
    pre.map((ele) =>
      ele?._id === element?._id
        ? { ...ele, unreadCount: 0 }
        : ele
    )
  );

  navigate(`${element?._id}`);
};
const searchHelper=async(e)=>{
  try {
    console.log('se')
    let response= await searchFunction(e.target.value)
   
    
     setFriendsList(response?.data?.data)
    
  } catch (error) {
    console.log(error)
  }
}






  return (
    <div className='w-full h-full flex justify-center items-center'>
      
      <div className='w-full  h-screen gap-2  p-1 rounded-md grid grid-cols-1 sm:grid-cols-[4fr,5fr] md:grid-cols-[3fr,5fr] lg:grid-cols-[2fr,5fr]'>
        <div className={` w-full p-1  h-full ${size&&"hidden"} bg-white shadow-md shadow-slate-300 border-2 border-gray-300 rounded-md overflow-y-auto `}>
        <div className='flex flex-col h-screen'>
           <div className='flex justify-center py-3'>
           <h3 className='bg-gradient-to-tr from-blue-600  to-purple-700  bg-clip-text text-xl text-transparent font-serif'>Snapchat</h3>
         </div>
         <div className='flex justify-center p-3 w-full'>
           <input type="search" name="" id="" className='outline-none outline-2 shadow-md shadow-slate-200 outline-slate-400 w-full rounded-xl px-2 py-2' placeholder='Search ...' value={search} onChange={(e)=>{
            setsearch(e.target.value)
            searchHelper(e)

           }}/>
         </div>
         <div className='p-1 flex flex-col gap-2 flex-grow '>
         {
          friendsList.length>0?(
             friendsList?.map((element)=>(
            
               <div className='w-full flex justify-between p-3 cursor-pointer hover:bg-gray-200 rounded-md border-2 border-gray-200 shadow-md shadow-slate-200'
               key={element?._id}
               onClick={(e)=>{
                 helper(element)
               }}
               >
                  <div className='w-full flex justify-between'>
                    <img src={element?.profile} alt="" className='rounded-full object-cover w-14 h-14'/>
                    <div className=' w-full pl-2 gap-2 flex flex-col'>
                      <div className='w-full flex justify-between gap-2'>
                        <h4 className='text-[17px] font-serif text-gray-800 line-clamp-1'>{element?.username}</h4>
                      {element?.unreadCount!=0&&<span className=' bg-green-700 p-1.5  rounded-full'><h4 className='text-[11px]  text-white'>{element?.unreadCount}</h4></span>}
                      </div>
                      <p className='line-clamp-1 text-[13px] text-gray-500'>{element?.bio}</p>
                    </div>
                  </div>
               </div>
        
          ))
          ):(
            <NoDataFound/>
          )
         }
          </div>
        </div>
          <div className='sticky -bottom-1 w-full  bg-white   h-12 rounded-b-md flex p-3 gap-3 justify-between'>
                    <span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500 bg-slate-50'>< FaRegUser color='black' /></span>
                   
                    <span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500'><  HiOutlineChat className= ' text-2 text-gray-900'/></span>
                            
                              <button className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500'onClick={()=>{
                                
                                navigate("/")
                              }}
                              
                              > <RiHome4Line className= ' text-xl text-gray-900'/></button>
                               <span className='w-8 h-8 p-1 rounded-full flex justify-center border-2 border-gray-500'>< IoSettingsOutline className= ' text-xl text-gray-900'/></span>
                            
          </div>
        </div>
   <Outlet />

      </div>

    </div>
  )
}

export default Chat