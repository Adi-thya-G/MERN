import React, { useEffect, useState ,useRef} from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {setSize} from '../store/authSlice'
import { getAllMessageId } from "../lib/api";
import { useParams } from "react-router";
import socket from "../socket";
import TypeingIndicator from "../components/TypeingIndicator";
import { FaCheck,  } from "react-icons/fa";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useMarkAsSeen } from "../hooks/MarkAsSeen";


const typeIndicator=(data)=>{
  socket.emit(`typeIndictor`,data)
}
function Message() {
  const [response,setresponse]=useState([])
  const dispatch = useDispatch();
  const [chatDetails, setchatDetails] = useState("");
  const [show,setshow]=useState(false)
   const chatRef = useRef(null);
   const[receiverData,setReceiverData]=useState({})
   const [typeing,settypeing]=useState(false)
  

 const submitMessage = async () => {
  try {
    const res = await socket.emitWithAck("receiver_message", {
      receiver: id,
      message: chatDetails,
    });

    console.log("Server response:", res);
  } catch (error) {
    console.error("Emit failed or timed out:", error);
  }
};

  const {id}=useParams()

  useEffect(()=>{
    function handler(data)
    {
     console.log("recieved",data)
      setresponse((pre)=>[data,...pre])
      setchatDetails("")
      useMarkAsSeen(id)
    }
    socket.on(id,handler)

    return ()=>{
      socket.off(id,handler)
    }
  },[])

  useEffect(()=>{
              chatRef.current?.scrollIntoView({ behavior: "smooth" });
  },[response])



  useEffect(()=>{
    getAllMessageId(id).then((res)=>{
      console.log(res)
     setresponse(res?.data?.data?.messages)
     setReceiverData(res?.data?.data?.receiverData)
     
    

    })
  },[id])

  function handleEvent() {
      if (window.innerWidth >= 640) {
        dispatch(setSize(false))
      }
      else
      {
       dispatch(setSize(true)) 
       setshow(true)
      }
    }


 const handleIsOnline=async(data)=>{
 setReceiverData((pre)=>({...pre,isOnline:data?.isOnline}))
 console.log(data)
 }   

 useEffect(()=>{
 socket.on(`${id}_isOnline`,handleIsOnline)

 return ()=>socket.off(`${id}_isOnline`,handleIsOnline)

 },[])
    
  useEffect(() => {
    handleEvent()
    window.addEventListener("resize", handleEvent);

    return () => {
      window.removeEventListener("resize", handleEvent);
    };
  }, []);

useEffect(()=>{
useMarkAsSeen(id)

},[])
useEffect(() => {
  const helper_Seen_Status = (data) => {
    // Assuming `data` is an array like [{ _id, status, seenAt }, ...]

    setresponse((prev) =>
      prev.map((msg) => {
        const updated = data.find(
          (item) => item._id.toString() === msg._id.toString()
        );
        return updated ? { ...msg, ...updated } : msg;
      })
    );
  };

  socket.on("seen_status", helper_Seen_Status);

  return () => {
    socket.off("seen_status", helper_Seen_Status);
  };
}, []);


useEffect(()=>{
  const helper=(data)=>{
   if(data.isTypeing)
   {
    settypeing(true)
   }
   else{
    settypeing(false)
   }
  }
  socket.on('typing_indicator',helper)

  return ()=>socket.off('typing_indicator',helper)
},[])





  return (
    <div className={` f w-full h-full p-1  ${show&&"flex"&&"flex-col"} sm:flex sm:flex-col  bg-gray-100  rounded-md overflow-y-auto`} >
      <div className="bg-white shadow-sm shadow-gray-100 sticky  w-full -top-1  h-16 rounded-lg mb-2 flex gap-4 items-center p-3">
        <div className="">
          <img
            src={receiverData?.profile}
            alt=""
            className="rounded-full object-fill  w-12 h-12"
          />
        </div>
        <div className="h-full w-full flex flex-col gap-1">
          <h2 className="font-serif">{receiverData?.username}</h2>
          <span className=" flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${receiverData?.isOnline ? " bg-green-400 " :"bg-orange-400"}  `}></div> {
              receiverData?.isOnline?"online":"offline"
            }
          </span>
        </div>
      </div>
      <div className=" flex-1 h-[90%] flex flex-col  " >
        <div className="flex-1 flex flex-col-reverse scrollbar-hide w-full h- p-4 overflow-y-auto  scroll-m-4 gap-8 " >
           <div  ref={chatRef}>{typeing?(<TypeingIndicator/>):""} </div>
          {response?.map((ele,index) => (
  <div key={index}>
    {ele.direction === "sent" ? (
      <div className="flex justify-end  " >
        <div className="min-w-20 max-w-60 h-full flex justify-end  bg-white shadow-sm shadow-slate-200 p-3 rounded-md md:min-w-min 
         md:max-w-[60%] gap-2">
          {ele.message}
           <span className="text-[10px] flex mt-auto ">{ele?.seenAt?.split("T")[1]?.split(":",2)?.join(":")}</span>
           { 
            ele?.status=="sent"?(
              <div className="relative px-2">
             <FaCheck size={10} fontWeight={200} className="bottom-0 text-gray-500 absolute"/>
           </div>
            ):(
               <div className="relative px-2">
                
             <RiCheckDoubleLine size={18} fontWeight={200} className="bottom-0 text-sky-500 absolute"/>
           </div>
            )
           }
         
        </div>
      </div>
    ) : (
      <div className="flex justify-start" key={index}>
        <div className="bg-orange-600 text-white min-w-20 max-w-60 h-full flex justify-start shadow-sm shadow-slate-200 p-3 rounded-md md:min-w-min md:max-w-[60%]">
          {ele.message}
        </div>
      </div>
    )}
  </div>
))}
       
        </div>
        <div className="sticky w-full z-10  bg-white bottom-0  flex gap-1 " >
          <div className="relative w-full flex justify-end">
            <textarea
              rows={1}
              value={chatDetails}
              className="w-full px-4 py-2 border rounded-lg resize-none overflow-hidden  pr-5"
              placeholder="Type your message..."
              onChange={(e) => {
                setchatDetails(e.target.value);
              }}
              onInput={(e) => {
                e.target.style.height = "auto"; // reset height
                e.target.style.height = e.target.scrollHeight + "px"; // auto grow
              }}
              onFocus={()=>{
                typeIndicator({
                   receiver: id,
                    isTypeing: true  // or false
              });

              }}
              onBlur={()=>{
                 typeIndicator({
                   receiver: id,
                 isTypeing: false // or false
              });
              }}
            />
            <button
              className="absolute right-5 bottom-1 hover:bg-slate-200 p-2 rounded-full"
              onClick={submitMessage}
            >
              <FaPaperPlane size={18} className="text-sky-500    " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
