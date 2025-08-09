import React, { useState } from "react";
import socialmedia from "../assets/socialmedia.jpg";
import { login } from "../lib/api";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import  {useDispatch,useSelector} from 'react-redux'
import { authLogin } from "../store/authSlice";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import socket from "../socket";
function Login() {
  const [loginFiled, setloginFiled] = useState("");
  const [password, setpassword] = useState("");
  const [response, setresponse] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const submitform = async () => {
    setloading(true);
    await login({
      loginFiled,
      password,
    })
      .then((res) => {
        setloading(false);
        setresponse({
          className: "text-sm text-green-400",
          data: res?.data?.message,
        });
        dispatch(authLogin(res?.data?.data))
        setTimeout(() => {
         socket.connect();
           }, 200); // 150-300ms is usually safe
        navigate("/")
      })
      .catch((err) => {
        setresponse({
          className: "text-sm text-red-500",
          data: err?.response?.data?.message,
        });
      })
      .finally(() => {
        setloading(false);
      });
  };
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-1">
      <div className=" w-full  md:h-[700px] bg-white shadow-lg shadow-slate-200 rounded-lg md:w-[900px] grid grid-cols-1 justify-center md:grid-cols-[2fr,2.5fr] p-2 border-2 gap-2 border-stone-200 mt-3">
        <div className="w-full flex-col">
          <div className=" flex flex-col flex-row-2 justify-start  p-3 gap-6 md:mb-5">
            <h2 className="text-[30px] font-serif font-semibold text-blue-400 ">
              Snapnest
            </h2>
            <p className="py-3 font-serif text-center">
              Welcome Back Sign in to your account to continue your language
              journey
            </p>
          </div>
          <p className={`${response?.className} w-full flex justify-center`}>
            {" "}
            {response?.data}
          </p>
          <div className="   p-1 w-full grid gap-5">
            <div className="w-full  grid  gap-3">
              <label htmlFor="" className="font-serif">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full p-2.5 border-2 border-blue-300  outline-2 outline-blue-500 rounded-md"
                value={loginFiled}
                onChange={(e) => {
                  setloginFiled(e.target.value);
                }}
              />
            </div>

            <div className="w-full  grid flex-row gap-3">
              <label htmlFor="" className="font-serif">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-2.5 border-2 outline-2 border-blue-300 outline-blue-500 rounded-md "
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
              />
              <h4 className="flex justify-end">
                <Link to={"/forget-password-form"} className="text-sky-300 hover:text-sky-500"> Forget password</Link>
                 
              
              </h4>
            </div>
            <div className="w-full flex flex-col gap-6 justify-center">
              <button
                className=" w-full p-2 flex justify-center gap-3 text-xl font-serif  bg-sky-300 text-stone-100 rounded-md "
                onClick={(e) => {
                  submitform();
                }}
              >
                Login
                {loading && (
                  <Flex align="center" gap="middle">
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{ fontSize: 20, color: "white" }}
                          spin
                        />
                      }
                    />
                  </Flex>
                )}
              </button>
              <hr className="w-full" />
              <button className=" w-full p-2 text-xl font-serif  bg-sky-300 text-stone-100 rounded-md ">
                Google
              </button>
              <p className="flex justify-center py-3">
                Don't have an account?{"  "}
                   <Link to={"/signup"} className="px-2 text-sky-500 underline">
                   Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:grid  ">
          <img src={socialmedia} alt="" className="h-full" />
        </div>
      </div>
    </div>
  );
}

export default Login;
