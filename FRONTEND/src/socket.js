import {io} from 'socket.io-client'
const socket = io("https://mern-moof.onrender.com", {
   
  withCredentials: true
});

export default socket