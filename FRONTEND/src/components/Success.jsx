import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
function Success({message}) {
  return (
   <div className=" w-72 md:w-[500px] h-min bg-white shadow-md shadow-gray-400 rounded-md border-2 border-gray-200 p-6 flex flex-col items-center gap-3">
       
    <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className="w-12 h-12"
>
  {/* Yellow Face */}
  <circle cx="12" cy="12" r="9" fill="#FFD93B" />

  {/* Proper Happy Mouth */}
  <path
    d="M8 14c1.5 2 6.5 2 8 0"
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


   
       <p className="text-gray-800 font-medium">{message}</p>
       
     </div>
  )
}

export default Success