import React from 'react'
import { IoKeyOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
function Forget() {
  return (
    <main className='w-full h-screen flex justify-center items-center p-1 '>
      <div className='w-[400px]    '>
        <div className=' p-2'>
          <div className='w-full '>
         <div className='flex justify-center'>
 <IoKeyOutline color='purple' className='w-10 h-10 bg-purple-100 rounded-full p-2'/>
         </div>
          <h3 className='flex justify-center text-slate-900 text-[27px] font-serif'>Set new password</h3>
          <p className='text-[14px] flex justify-center font-sans  text-slate-700 sm:text-[13px] md:text-sm p-3 max-w-xs text-center mx-auto'>Your new password must be different from your previously used password.</p>
          </div>
          <form className='flex flex-col p-3 gap-6'>
            <div className='flex flex-col gap-3'>
              <label htmlFor="" className='text-[15px] text-slate-800 font-semibold '>Password</label>
             <input type="password" placeholder='Enter password' className=' outline-2 outline p-2 rounded-md outline-gray-600 placeholder:text-[16px]' />
          </div>
          <div className='flex flex-col gap-3'>
              <label htmlFor="" className='text-[15px] text-slate-800 font-semibold'>Confirm password</label>
             <input type="password" placeholder='Enter confirm password' className=' outline-2 outline p-2 rounded-md outline-gray-600 placeholder:text-[16px]' />
          </div>
          <div className='w-full flex justify-center p-2'>
            <button className='text-white bg-purple-500 w-5/6 p-3 rounded-md'>Reset password</button>
          </div>
          </form>
          <div className='w-full flex justify-center py-3'>
            <button className='text-gray-800 font-medium text-[14px] flex   '><span className='py-1 px-2'><FaArrowLeft/></span> Back to login</button>

          </div>

        </div>
         
      </div>
    </main>
  )
}

export default Forget