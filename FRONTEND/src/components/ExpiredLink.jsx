import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router';
function ExpiredLink() {
  const navigate=useNavigate()
  return (
    <div className="w-full  h-screen flex justify-center items-center">
  <div className=" w-72 md:w-[500px]  bg-white shadow-md shadow-gray-400 rounded-md border-2 border-gray-200 p-6 flex flex-col items-center gap-3">
    
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-12 h-12"
    >
      {/* Yellow Face */}
      <circle cx="12" cy="12" r="9" fill="#FFD93B" />
      
      {/* Sad mouth */}
      <path
        d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318"
        stroke="black"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Eyes */}
      <circle cx="9.375" cy="9.75" r="0.75" fill="black" />
      <circle cx="14.625" cy="9.75" r="0.75" fill="black" />
    </svg>

    <p className="text-gray-800 font-medium">Sorry, link has expired</p>
    <div className='w-full flex justify-center'>
      <button className='p-2 bg-blue-500 text-white rounded-md flex gap-3 place-items-center'
      onClick={(e)=>navigate("/login")}>
      < FaArrowLeftLong/>
      Go to login</button>

    </div>
  </div>
</div>

  )
}

export default ExpiredLink