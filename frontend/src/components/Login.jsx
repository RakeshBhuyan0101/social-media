import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/AtuthSlice.js";

function Login() {

    const [input , setInput] = useState ({
        email : "",
        password : ""
    })
    
    const [loading , setLoading] = useState()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const changeEventHandler = (e) => {
        setInput( {... input , [e.target.name] : e.target.value} )
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
          const res = await axios.post(
            "http://localhost:3000/api/v1/user/login",
            input, //  This is the payload containing user registration information.
            {
              headers: {
                "Content-Type": "application/json", // Specifies that the request body format is JSON.
              },
              withCredentials: true, //Indicates that cookies should be sent with the request, which can be important for authentication or session management.
            }
          );
          if (res.data.success) {
            dispatch(setAuthUser(res.data.user))
            navigate('/')
            toast.success(res.data.message);
            setInput({
              email : "",
              password : ""
            })
            
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className=" shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center text-gray-600">
            {" "}
            Signup to see phots and videos of your friends{" "}
          </p>
        </div>

        <div>
          <span className="">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent"
          />
        </div>

        <div>
          <span className="">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent"
          />
        </div>

        <Button type="submit" > Login </Button>
        <span> Doesn't have an account ?  <Link to= "/signup" className="text-blue-600" > signup </Link> </span>
      </form>
    </div>
  )
}

export default Login