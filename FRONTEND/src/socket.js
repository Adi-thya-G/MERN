import {io} from 'socket.io-client'
const socket = io("https://mern-six-psi.vercel.app", {
   
  withCredentials: true
});

export default socket