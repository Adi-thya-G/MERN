import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
function ProtectedRouter({children}) {
  const authStatus=useSelector((state)=>state?.auth?.status)
  const navigate=useNavigate()
  if(authStatus)
    return children
  else
    navigate("/login")
}

export default ProtectedRouter