import React, { useEffect } from 'react'
import {setSize} from '../store/authSlice'
import { useDispatch, useSelector } from "react-redux";
function MessageHome() {
  const dispatch=useDispatch()
  useEffect(()=>{
     dispatch(setSize(false))
  },[])
  return (
    <div className=' f w-full h-full p-1 hidden  sm:flex sm:flex-col  bg-gray-100  rounded-md overflow-y-auto justify-center place-items-center'>
     
        <div className='bg-gray-100 relative flex flex-col justify-center'>
          <div className='flex justify-center place-items-center  relative'>
            <h3 className='absolute -left-7 bottom-40 bg-gradient-to-tr from-blue-600  to-purple-700 text-transparent bg-clip-text text-2xl px-3 bg-'>Snapnest</h3>
          
            <img src="https://res.cloudinary.com/dlq5v0js5/image/upload/v1752516155/IconOnly_Transparent_hfwffe.png" alt=""  className='bg-clip-content 
           w-80 h-80 lg:w-72 lg:h-72 xl:w-80 px-2 xl:h-80
          '/>
          </div>
         <div className='absolute bottom-24 px-4'>
          <h6 className='text-gray-600'>Chat it. Snap it. Post it.</h6>
         </div>
        </div>
   
           </div>
  )
}

export default MessageHome