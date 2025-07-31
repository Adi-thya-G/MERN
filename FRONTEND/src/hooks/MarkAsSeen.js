import { markAsSeen } from "../lib/api"
export const useMarkAsSeen=(id,timeout=10000)=>{


setTimeout(() => {
markAsSeen(id).then((res)=>{
  console.log(res)
return res
})
.catch((error)=>{
  console.log(error)
  return error
})
}, timeout);
}