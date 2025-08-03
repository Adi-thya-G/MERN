import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router'

function MessageNotification({notification,setnotification,timeout}) {
 
  const navigate=useNavigate()
 
  // it is helper fn 
  const helper=()=>{
   setnotification(null)
  }


  useEffect(()=>{
      const timer=setInterval(helper,timeout)
      return()=> clearInterval(timer)
    },[])


    // navigate to specific message id:

  return (
 
    <div
    className={`${
      'animate-enter' 
    } max-w-md w-full bg-white shadow-lg  fixed z-50 right-2 top-2 rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  >
    <div className="flex-1 w-0 p-4"  onClick={()=>{
    helper()
    navigate(`chat/${notification?.sender}`)}}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <img
            className="h-10 w-10 rounded-full"
            src={notification?.user[0]?.profile}
            alt='user profile'
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {notification?.user[0]?.username}
          </p>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">
            {notification?.message}
          </p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() =>{ setnotification(null)}}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button>
    </div>
  </div>

  )
}

export default MessageNotification