import React, { useState } from 'react'
import { Link } from 'react-router'
import { signup } from '../lib/api'
import Notification from './Notification'
function SignUp() {
  const [username,setusername]=useState("")
  const [password,setpassword]=useState("")
  const [email,setemail]=useState("")
 const [error,seterror]=useState(
  {
    username:"",
    email:"",
    password:""
  }
)
const [response,setresponse]=useState(null)
  const validation=()=>{
   if(!email||email.trim()==""){
      seterror((pre)=>({
        ...pre,email:"email is required"
      }))
      return
   }
   if(!username||username.trim()=="")
   {
     seterror((pre)=>({
        ...pre,username:"username is required"
      }))
      return
   }
   if(!password ||password.trim()=="")
   {
    seterror((pre)=>({
        ...pre,password:"password is required"
      }))
      return
   }
  }

 const submit=async()=>{
  try {
   validation()
  let response=await signup({username,email,password})
   setresponse({
      className:"text-green-400 bg-green-100",
      message:response?.data?.message,
      success:true
     })
  console.log(response)
  } catch (error) {
     setresponse({
        className:"text-red-500 bg-red-100 ",
        message:error?.response?.data?.message,
        success:false
      })
  }
 }

  const onchange=(e,setchange,fieldname)=>{
    setchange(e.target.value)
    seterror((pre)=>(
      {
        ...pre,
        
        [fieldname]:""
      }
    ))

  }
  return (
    <div className='w-full h-screen flex justify-center place-items-center p-2'>
      {
        response&&<Notification setresponse={setresponse} {...response} />
      }
      <div className='w-full p-2 px-5 mobile:w-[420px] mobile:px-8 h-[600px]   rounded-lg shadow-lg border-2 border-gray-300 shadow-gray-400 flex flex-col  
      gap-2 bg-gradient-to-r from-white to-purple-100 '>
        <div className='flex flex-col justify-center h-[120px] place-items-start  gap-2  '> 
          <h3 className='text-2xl font-serif font-medium text-gray-900 '>Sign Up</h3>
          <p className='text-[13px] text-gray-900'>Just a few things to get started</p>
         
        </div>
        <div className='flex flex-col gap-1 w-full h-[310px] '>
          <div className='flex flex-col gap-0.5 w-full h-[90px]'>
            <label htmlFor=" " className='text-sm  text-gray-900'>Email</label>
             <input type="text" className='w-full outline-none border-2 border-gray-400 rounded-lg  p-2 py-2.5' placeholder='Enter Email  Id'
             value={email}
             onChange={(e)=>onchange(e,setemail,"email")}
             
             />  
             <p className='text-red-300 text-sm'>{error?.email}</p>           
          </div>
          <div className={`flex flex-col gap-0.5 w-full h-[90px] `}>
            <label htmlFor=" " className='text-sm'>Username</label>
             <input type="text" className='w-full outline-none border-2 border-gray-400 rounded-lg  p-2  py-2.5'
             name='username'
             placeholder='Enter Username'
             value={username}
             onChange={(e)=>onchange(e,setusername,"username")}
             />  
              <p className='text-red-300 text-sm'>{error?.username}</p>             
          </div>
         <div className='flex flex-col gap-0.5 w-full h-[90px]'>
            <label htmlFor=" " className='text-sm'>Password</label>
             <input type="password" className='w-full outline-none border-2 border-gray-400 rounded-lg  p-2  py-2.5' placeholder='Enter Password'
             value={password}
              onChange={(e)=>onchange(e,setpassword,"password")}
             
             /> 
              <p className='text-red-300 text-sm'>{error?.password}</p>              
          </div>
        </div>
        <div className='h-[100px] flex flex-col gap-6'>
           <button className='p-3 rounded-md w-full bg-black text-white text-[18px]' onClick={(e)=>submit()}>Sign In</button>
           <div className='flex flex-col gap-2 place-items-center'>
            <hr className='w-full h-0.5  bg-gray-600' />
          <div className='flex gap-2'>

             <p className='text-[13px] text-gray-700'>Already have account ? </p>
             <Link className={`text-[13px] underline`} to={"/login"}>Sing In</Link>
          </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp