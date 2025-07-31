import React, { useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import { RxCrossCircled } from "react-icons/rx";
import { RxPinRight } from 'react-icons/rx'; "react-icons/rx"
import { FaCheckCircle } from "react-icons/fa";
function Notification({
  message,className,setresponse,success
  
}) {
  
  const submit=()=>{
    setresponse(null)
  }

  useEffect(()=>{
    const timer=setInterval(submit,10000)
    return()=> clearInterval(timer)
  },[])

  return (
    <div className={`absolute z-40 flex justify-between border-2  top-4 right-4 gap-2   min-w-80 md:min-w-[400px] px-3 py-2 rounded-lg ${className}`}>
      <div>
       {
        success?(<  FaCheckCircle   size={20}/>):( <RxCrossCircled size={20}/>)
       }
      </div>
      {message}
      <div className='cursor-pointer' onClick={submit}>
        <RxCross2 size={20} />
      </div>
    </div>
  )
}

export default Notification