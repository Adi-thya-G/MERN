import React, { useState } from 'react'
import { CiImageOn } from "react-icons/ci";
import { FaArrowLeft } from 'react-icons/fa'
import {useNavigate } from 'react-router'
import {uploadPost} from '../lib/api'
import Notification from './Notification';
function PostUpload() {
  const [ImgSrc,setImaSrc]=useState(null)
  const [post,setpost]=useState(null)
  const [bio,setbio]=useState("")
  const navigate=useNavigate()
  const [response,setresponse]=useState(null)
  const submit=async()=>{
    try {
      if(!post || post==null)
      {
         setresponse({
          className:"text-red-500 bg-red-100",
          message:"please upload file",
          success:true
         })
        return 
      }
     let res=  await uploadPost({file:post,caption:bio })
     setresponse({
      className:"text-green-400 bg-green-100",
      message:"file uploaded successfully",
      success:true
     })
    } catch (error) {
      setresponse({
        className:"text-red-500 bg-red-100 ",
        message:error?.response?.data?.message,
        success:false
      })
      console.log(error)
      
    }
    finally
    {
     setpost(null)
     setbio("")  
     setImaSrc(null)
    }
   
  }
  return (
   <div className='w-full h-screen flex flex-col justify-center items-center relative'>
     <div className='absolute  bg-neutral-200 left-1 top-1 p-4 rounded-full m-1 cursor-pointer' 
     onClick={()=>{
      navigate("/profile")
     }}
     >
 < FaArrowLeft size={32} className='text-sky-400'/>
     </div>
     {
      response?<Notification className={response?.className}
       message={response?.message} 
       setresponse={setresponse}
       success={response?.success}
       />:""
     }
     <div className='w-80 flex flex-col justify-center bg-white shadow-lg rounded-lg border-2 border-slate-200 shadow-gray-200 p-3 '>
      <h4 className='text-2xl w-full flex justify-center font-serif'>Upload Image</h4>
      <div className='w-full flex justify-center p-3'>
          <label htmlFor="image-upload" className="cursor-pointer " >
        {
          ImgSrc==null?(
            <CiImageOn size={150} className="text-purple-500 hover:scale-105 transition-transform" />
        
          ):(<div className='relative flex justify-center items-center'>
            <img src={ImgSrc} alt="" />
            <CiImageOn size={60} className="text-gray-700 top absolute hover:scale-105 transition-transform bg-transparent border-2 border-purple-400 p-2 rounded-full" />
          </div>
          )
        }
      </label>
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

    const imageUrl = URL.createObjectURL(file); // ✅ Temporary preview URL
   setImaSrc(imageUrl)
   setpost(file)
        }}
      />
      </div>
      
      <textarea
  rows={1}
  className="m-2 px-4 py-2 border border-purple-400 rounded-lg resize-none overflow-hidden  pr-5"
  placeholder="Post captions..."
  value={bio}
  onChange={(e)=>setbio(e.target.value)}
  onInput={(e) => {
    e.target.style.height = 'auto'; // reset height
    e.target.style.height = e.target.scrollHeight + 'px'; // auto grow
  }}
/>


<div className='flex justify-center m-4'>
  <button className=' border w-32 py-2 rounded-md bg-sky-500 text-white' onClick={submit}>Post</button>
</div>
     </div>
   </div>
  )
}

export default PostUpload