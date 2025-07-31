import React,{useEffect, useState} from 'react'
import { HiOutlineChat } from "react-icons/hi";
import { useNavigate, useParams } from 'react-router';
import {profile,followAndUnfollow} from '../lib/api'
import Notification from './Notification';
function ViewProfile() {
     const [expand, setexpand] = useState(false);
     const[data,setdata]=useState({})
     const [response,setresponse]=useState(null)
     const {id}=useParams()
      

     const navigate=useNavigate()
   const expandfn = () => {
    setexpand((pre) => !pre);

   
  };

   const followAndUnfollowFn=async(id)=>{
     try {
      let res= await followAndUnfollow(id)
      setresponse({
        className:"text-green-400 bg-green-100",
        message:res?.data?.message,
        success:true
       })
        setdata((pre)=>({...pre,
          is_following:res?.data?.data==null?false:true}))
          console.log(data)
     } catch (error) {
      setresponse({
          className:"text-red-500 bg-red-100 ",
          message:error?.response?.data?.message,
          success:false
        })
       
     }
    }
   useEffect(()=>{
    console.log(id)
      profile(id).then((res)=>setdata(res?.data?.data))
      
    },[])
  return (
     <div className="h-full  w-full flex flex-col scrollbar-hide  ">
        {response!=null?
        <Notification className={response?.className}
       message={response?.message} 
       setresponse={setresponse}
       success={response?.success}
       />:""
     }
     
      <div className="w-full flex justify-center relative">
        <img
          src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "
          className="w-full sm:h-[400px] md:h-[300px] lg:h-[350px] 
          "
          alt=""
        />

        <div className="bg-white w-28 h-28  md:w-32 md:h-32 lg:w-36 lg:h-36  2xl:w-48 2xl:h-48  rounded-full absolute -bottom-12 lg:-bottom-16  p-1">
          <img
            src={data?.profile}
            className="w-full h-full object-cover rounded-full
          "
            alt=""
          />
        </div>
      </div>
      <div className="w-full flex  pt-16 justify-center ">
        <div className="w-full flex flex-col sm:w-[400px] gap-3">
          <h3 className="w-full flex justify-center">{data?.username}</h3>

          <div className="relative p-2 sm:px-4">
            <p
              className={`text-[13px]  text-gray-700 flex justify-center  ${
                expand ? "" : "line-clamp-2  "
              }`}
            >
              {data?.bio}
              <span
                className="text-[13px] absolue -bottom-1 z-10  absolute text-sky-400 right-3 cursor-pointer "
                onClick={expandfn}
              >
                {expand ? "less" : "more"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full  flex justify-center py-3">
        <div className=" flex gap-6  ">
          <div className="">
            <span className="flex justify-center">{data?.follower_count}</span>
            <h6>Followers</h6>
          </div>

          <div className="">
            <span className="flex justify-center">{data?.following_count}</span>
            <h6>Followering</h6>
          </div>
          <div className="">
            <span className="flex justify-center">{data?.post_count}</span>
            <h6>Post</h6>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center py-7">
        <div className="flex gap-3">
          <button className="bg-sky-600 text-white px-5 py-2 rounded-lg" onClick={()=>{
            followAndUnfollowFn(data?._id)
          }}>
            {data?.is_following?
            "Unfollow":"Follow"  
          }
          </button>
          <button className="border-2 p-2 border-gray-200 rounded-lg" onClick={()=>{
            navigate(`/chat/${data?._id}`)
          }}>
            <HiOutlineChat size={24} color="blue" />
          </button>
        </div>
      </div>

     
    </div>
  )
}

export default ViewProfile