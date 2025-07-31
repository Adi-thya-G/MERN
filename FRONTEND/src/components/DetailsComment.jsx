import React, { useEffect, useState } from "react";
import { DetailedComments } from "../lib/api";
import { useNavigate } from "react-router";
import socket from '../socket/'
function DetailsComment({ id ,setcommentsCount}) {
  const [addComment, setcomment] = useState("");
  const [response,setresponse]=useState([{}])
  const navigate=useNavigate()

  useEffect(() => {
    DetailedComments(id).then((res)=>{
      setresponse(res?.data?.data)
     console.log(res)
    })
  },[]);
  

  const comments=async(comments)=>{
    let data={
      post_id:id,
      comments:comments
    }
    socket.emit("newcomments",data)
    setcomment("")
    }
  
    useEffect(()=>{
      socket.on(`comments_${id}`,(data)=>{
        setresponse((pre)=>[...pre,data])
        setcommentsCount((pre)=>pre+1)
      })
      return ()=>{
         socket.on(`comments_${id}`,(data)=>{
   
      })
      }
    },[])
  

  return (
    <div className="w-full h-60 md:h-80 overflow-auto scrollbar-hide  " >
      {
        /* user add comments */
      }
      <div className="w-full  relative flex flex-col justify-end  ">
        <textarea
          name=""
          id=""
          className="w-full -z-1 border-2 scrollbar-hide border-gray-200 outline-none p-2 placeholder:text-gray-400 rounded-md bg-gray-100 text-gray-600"
          placeholder="Add comment..."
          value={addComment}
          onChange={(e) => {
            if (
              addComment.length < 150 ||
              e.target.value.length < addComment.length
            )
              setcomment(e.target.value);
          }}
          onInput={(e) => {
            e.target.style.height = "auto"; // reset height
            e.target.style.height = e.target.scrollHeight + "px"; // auto grow
          }}
        ></textarea>
        <div className="absolute   -bottom-6 right-1 ">
          <span className="text-sm">{addComment.length}/150</span>
        </div>
        <div className="absolute -bottom-9">
          <button className="bg-orange-500 text-white p-1 px-3 rounded-2xl " onClick={()=>comments(addComment)}>Submit</button>
        </div>
      </div>

      {
      // comments display
      }
      <div className="flex flex-col gap-2 justify-center p-1 mt-11">

        {
         response.map((ele)=>(
            <div className="flex flex-col bg-white shadow-sm shadow-gray-400 borde-2 border-gray-600 rounded-md" >
          <div className="flex gap-4 justify-start place-items-center p-2 relative">
            <img src={ele?.profile} alt="" className="w-12 h-12 rounded-full" onClick={()=>navigate(`/viewprofile/${ele?.user_id}`)}/>
            <h2 className="" >{ele?.username}</h2>  
            <span className="text-gray-400 text-[12px] absolute top-1 right-1">{ele?.createdAt?.split("T")[0]}</span> 
          </div>
          <div className="w-full pl-3 py-2">
            <p className="text-gray-600 text-[12px]">{ele?.comments}</p>

          </div>

        </div>
          ))
        }

      </div>
    </div>
  );
}

export default DetailsComment;
