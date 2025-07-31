import { Profiler, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from 'react-router'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Forget from './pages/Forget.jsx'
import Profile from './pages/Profile.jsx'
import Chat from './pages/Chat.jsx'
import PostUpload from './pages/PostUpload.jsx'
import{Provider} from 'react-redux'
import { store } from './store/store.js'
import ViewProfile from './pages/ViewProfile.jsx'
import Message from './pages/Message.jsx'
import MessageHome from './pages/MessageHome.jsx'
import SignUp from './pages/SignUp.jsx'
import SetProfile from './components/SetProfile.jsx'
const router=createBrowserRouter([{
  path:"/",
  element:<App/>,
  children:[{
    path:"",
    element:<Home/>,
   
  } ,{
      path:`/viewprofile/:id`,
      element:<ViewProfile/>
    }
  ,{
    path:"login",
    element:<Login/>
  },{
    path:"forget-password/:user",
    element:<Forget/>
  },{
    path:"profile",
    element:<Profile/>
  },{
    path:"chat",
    element:<Chat/>,
    children:[
      {
        path:"",
        element:<MessageHome/>
      },
      {
        path:":id",
        element:<Message/>
      }
    ]
  },{
    path:"postupload",
    element:<PostUpload/>
  },
{
  path:"signup",
  element:<SignUp/>
},
{
  path:"setprofile",
  element:<SetProfile/>
}
]
}])
createRoot(document.getElementById('root')).render(
   <Provider store={store}>
     <RouterProvider router={router}/>
   </Provider>
  
)
