import React, { useState } from 'react'
import { MdOutlineKey } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { resetToken } from '../lib/api';
import Success from '../components/Success';
import { Flex, Spin } from 'antd';
function ForgetEmail() {
  const navigate=useNavigate()
  const [email,setemail]=useState("")
  const [success,setsuccess]=useState(false)
  const[loadign,setloading]=useState(false)
  const submit=async(e)=>{
   try {
    e.preventDefault()
    setloading(true)
    let res=await resetToken({email})
    setloading(false)
    setsuccess(true)
   } catch (error) {
    
   }
  }
  return (
    <div className={`w-full h-screen flex justify-center place-items-start pt-32 ${loadign&&"bg-gray-200"}`}>
     {
       loadign&&
        (
<Flex 
  align="center" 
  justify="center" 
  gap="middle" 
  className="absolute inset-0 bg-transparent"
>
  <Spin size="large" />
</Flex>

        )
     }

      { 
        success?
        <Success message={"Link is send to your email"}/>:
       (
       
        
      <div className={`flex flex-col justify-center gap-4   `}>
       <div className='w-full flex justify-center'>
         <MdOutlineKey size={32} className=''/>
       </div>
       <div className='flex flex-col justify-center gap-2 '>
         <h2 className='text-2xl flex justify-center w-full font-semibold font-serif '>Forgot your password</h2>
        <p className='text-xs break-words'>A link is send to your email to help reset password</p>
       </div>

       <form className='flex flex-col gap-4' onSubmit={submit} >
         <div className='flex flex-col gap-1'>
          <label htmlFor="">Email</label>
         <input type="text" value={email} onChange={(e)=>setemail(e.target.value)} placeholder='Enter your email' className='outline-none border-2 border-gray-600 p-2 rounded-md' />
         </div>
         <input type="submit" value="Reset password" className='w-full p-2 bg-blue-600 text-white rounded-md cursor-pointer' />
         <div className='w-full flex justify-center'>
            <button className='flex gap-1.5 place-items-center cursor-pointer hover:bg-gray-100 p-3' onClick={()=>navigate("/login")}><FaArrowLeftLong className='' />Back to login</button>
         </div>
       </form>
       </div>
        
        
       )}
    
    </div>
  )
}

export default ForgetEmail