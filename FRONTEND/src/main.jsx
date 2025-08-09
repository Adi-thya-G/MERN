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
import ProtectedRouter from './components/ProtectedRouter.jsx'
import ForgetEmail from './pages/ForgetEmail.jsx'
import ExpiredLink from './components/ExpiredLink.jsx'
const router=createBrowserRouter([{
  path:"/",
  element:<App/>,
  children:[{
    path:"",
    element:<ProtectedRouter>
      <Home/>
    </ProtectedRouter>,
   
  } ,{
      path:`/viewprofile/:id`,
      element:<ProtectedRouter>
        <ViewProfile/>
        </ProtectedRouter>
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
    element:<ProtectedRouter>
      <Chat/>
    </ProtectedRouter>,
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
    element:<ProtectedRouter>
      <PostUpload/>
    </ProtectedRouter>
  },
{
  path:"signup",
  element:<SignUp/>
},
{
 path:"forget-password-form",
 element:<ForgetEmail/>
},
{
path:"link-expired",
element:<ExpiredLink/>
},
{
  path:"setprofile",
  element:<ProtectedRouter>
    <SetProfile/>
  </ProtectedRouter>
}
]
}])
createRoot(document.getElementById('root')).render(
   <Provider store={store}>
     <RouterProvider router={router}/>
   </Provider>
  
)
