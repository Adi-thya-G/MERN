import React, { useEffect, useState } from "react";
import { HiOutlineChat } from "react-icons/hi";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { MdUploadFile } from "react-icons/md";
import { useSelector } from "react-redux";
import {useNavigate } from 'react-router'
import { getAllPost } from "../lib/api";
import {followAndUnfollow,count} from '../lib/api'
import Notification from './Notification';
function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const [data, setdata] = useState(null);
  const [expand, setexpand] = useState(false);
  const [post,setpost]=useState([])
  const [counter,setcounter]=useState({})
  const [response,setresponse]=useState(null)
  const navigate=useNavigate()
  const expandfn = () => {
    setexpand((pre) => !pre);
  };

  const followAndUnfollowFn=async(id)=>{

    
   try {
    let res= await followAndUnfollow(userData?._id)
    setresponse({
      className:"text-green-400 bg-green-100",
      message:"user followed successfuly",
      success:true
     })
    
   } catch (error) {
    setresponse({
        className:"text-red-500 bg-red-100 ",
        message:error?.response?.data?.message,
        success:false
      })
     
   }
  }

  useEffect(() => {
    setdata(userData);
    count(userData?._id).then((res)=>{
      setcounter(res.data?.data)
      console.log(res)
    })
     
  }, [userData]);
  
  useEffect(()=>{
    getAllPost().then((res)=>{
      setpost(res?.data?.data)
    })
  },[])

  return (
    <div className="h-full  w-full flex flex-col scrollbar-hide  ">
       {response!=null?<Notification className={response?.className}
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
            <span className="flex justify-center">{counter?.followers}</span>
            <h6>Followers</h6>
          </div>

          <div className="">
            <span className="flex justify-center">{counter?.followings}</span>
            <h6>Followering</h6>
          </div>
          <div className="">
            <span className="flex justify-center">{counter?.post}</span>
            <h6>Post</h6>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center py-7">
        <div className="flex gap-3">
          <button className="bg-sky-600 text-white px-5 py-2 rounded-lg" onClick={()=>{
            followAndUnfollowFn(userData?.id)
          }}>
            Follow
          </button>
          <button className="border-2 p-2 border-gray-200 rounded-lg" onClick={()=>{
            navigate("/chat")
          }}>
            <HiOutlineChat size={24} color="blue" />
          </button>
        </div>
      </div>

      <div className="w-full p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4 ">
        <div className="w-full bg-white shadow-md shadow-slate-300 border-2 border-slate-300 h-52 md:h-80 rounded-md relative flex flex-col justify-center items-center group" onClick={()=>{
             navigate("/postupload")
        }}>
          <div className="p-3 bg-slate-200 rounded-full cursor-pointer" >
            <MdUploadFile size={40} className="text-purple-800" />
          </div>
          <span>Upload Post</span>
        </div>

        {post?.map((element) => (
          <div className="w-full bg-white h-52 md:h-80 shadow-lg border-gray-100 shadow-gray-300
          rounded-md relative flex flex-col justify-center group" key={element?._id}>
            <img
              src={element?.photo}
              alt=""
              className="w-full object-center rounded-md h-full"
            />
            <div className="absolute flex-col justify-center  right-1 hidden group-hover:flex">
              <div className="bg-red-100 p-2 rounded-full inline-block">
                <HiOutlineHeart size={20} className="text-red-500" />
              </div>
              <span className="text-gray-400 text-sm flex justify-center">{element?.likesCount}</span>

              <div className="w-full inline-block mt-2 p-2 bg-purple-100 rounded-full">
                <HiOutlineChat size={20} />
              </div>
              <span className="text-gray-400 text-sm flex justify-center" >{element?.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
