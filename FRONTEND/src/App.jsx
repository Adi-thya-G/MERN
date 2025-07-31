import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {getCurrentUser,newAccessToken} from './lib/api'
import socket from './socket'
import { axiosInstance } from './lib/axios'
import { Outlet } from 'react-router'
import { useDispatch } from 'react-redux'
import { authLogin,setSocketId } from './store/authSlice'
import { useNavigate } from 'react-router'
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import MessageNotification from './components/MessageNotification'

function App() {
   const navigate=useNavigate()
   const dispatch=useDispatch()
   const [loading, setLoading] = useState(true)
   const [notification,setnotification]=useState(null)

useEffect(() => {
  const initAuth = async () => {
    try {
      const res = await getCurrentUser()
      dispatch(authLogin(res.data.data))
    } catch {
      try {
        await newAccessToken()
        const res = await getCurrentUser()
        dispatch(authLogin(res.data.data))
      } catch {
       
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }
  initAuth()
   function connection()
    {console.log(socket.id)
      dispatch(setSocketId(socket.id))
    }

    socket.on('connect',connection)

    return ()=>{
      socket.off('connect',connection)
    }

  
},[])

const notificationHelper=async(data)=>{
 setnotification(data)
}

useEffect(()=>{
socket.on('message_Notification',notificationHelper)

return ()=>socket.off('message_Notification',notificationHelper)

},[])
if (loading) return <div className="w-full h-full flex justify-center items-center"> <Flex align="center" gap="middle">
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{ fontSize: 20, color: "white" }}
                          spin
                        />
                      }
                    />
                  </Flex></div>

return <div className='relative'>
{
  notification&&(
    <MessageNotification 
  notification={notification} 
  setnotification={setnotification} 
  timeout={10000} 
  
  />
  )
}
<Outlet />
  
</div>

}

export default App
