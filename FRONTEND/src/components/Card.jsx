import React, { useEffect, useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { LiaComments } from "react-icons/lia";
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import DetailsComment from './DetailsComment';
import socket from '../socket';

async function addLikes(data){
socket.emit(`newlikes`,data)
}

async function removeLikes(data){
  socket.emit(`removelikes`,data)
}

function Card({ele}) {
  const selector=useSelector((state)=>state.auth.userData)
  const navigate=useNavigate()
  const [likes,setlikes]=useState(ele?.likes)
  const [isCommentCliked,setCommentCliked]=useState("")
  const [isLiked,setliked]=useState(ele?.isLiked)
  const [commentsCount,setcommentsCount]=useState(ele?.commentCount)

  const commentClikedFn=(id)=>{
    if(isCommentCliked==id)
    {
      setCommentCliked("")
    }
    else
    {
      setCommentCliked(id)
    }
  }

 useEffect(() => {
  const listener = (data) => {
    console.log(data)
    if (data.post_id === ele?._id) {
      setlikes(data?.likesCount); 
    }
  };

  socket.on(`likes_${ele?._id}`, listener);

  // Cleanup on unmount
  return () => {
    socket.off(`likes_${ele?._id}`, listener);
  };
}, [ele?._id]);



  return (
    <div className='w-full group bg-white shadow-lg rounded-md shadow-gray-200 border-2 border-gray-100 flex flex-col' key={ele?._id}>
            <div className='w-full  flex justify-between p-3 gap-2'>
               <div className='w-full flex '> 
                   <div className='w-full flex gap-2 '>
                     <img src={ele?.ownerProfile} className='rounded-full w-12 h-12 cursor-pointer' alt="" onClick={()=>{navigate(`viewprofile/${ele?.owner_id}`)}} />
                     <div className='flex flex-col gap-0 p-1'>
                      <h4 className='text-[14px] font-semibold line-clamp-1'>{ele?.ownerUsername}</h4>
                     <span className='text-[12px] text-gray-500'>1m</span>
                     </div>
                   </div>
                   <div className='flex justify-center flex-col'>
                     
                   </div>
               </div>
                <div className='w-full   flex py-2 justify-end'> 
                   <HiOutlineDotsHorizontal/>
               </div>
            </div>
            <div className=' flex-grow flex p-2  rounded-lg'>
             <img src={ele?.photo}alt="" className=' w-full h-[240px] md:h-[360px]  object-fill rounded-lg' />
            </div>
            <div className='w-full px-3 py-3 flex flex-col gap-5 '>
              <div>
               <p className='text-gray-800 text-[12px] text-justify l line-clamp-2 font-medium'>{ele?.captions}</p> 
              </div>
              <hr className='w-full  rounded-md ' />
               <div className='w-full  flex justify-start gap-1 '>
{
isLiked?
(<button onClick={(e)=>{
  removeLikes({post_id:ele?._id})
  setliked(false)
}}>
  <HiHeart size={20} className={`text-red-500`} />
</button>):
(<button onClick={(e)=>{
  addLikes({post_id:ele?._id})
   setliked(true)
}

}>
  <HiOutlineHeart size={20}/>
</button>)}
<span className='text-slate-600 text-sm mr-2'>{likes

} likes</span>
<button className='flex gap-1' onClick={(e)=>{
  commentClikedFn(ele?._id)
}}>
  <LiaComments size={20}/>
<span className='text-slate-600 text-sm'>{commentsCount

} comments</span>
</button>
            </div>
            {
              isCommentCliked==ele._id?<DetailsComment id={ele._id} setcommentsCount={setcommentsCount} />:(<div></div>)
            }

            </div>
          </div>
  )
}

export default Card