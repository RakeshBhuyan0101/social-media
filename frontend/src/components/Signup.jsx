import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  /*
  1 -> Spread Operator (`...input`): This creates a shallow copy of the existing `input` object. This is important because it ensures that we maintain the previous state while updating only the specific property that has changed.

	2 ->	Dynamic Property Key (`e.target.name`): This uses the name of the input field (accessed via `e.target.name`) as a key in the new object. This allows the function to update the correct property in the `input` state based on which input field triggered the change event.

	3 -> 	New Value (`e.target.value`): This sets the value of the specified property to whatever the user has typed into that input field.
  */
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        input, //  This is the payload containing user registration information.
        {
          headers: {
            "Content-Type": "application/json", // Specifies that the request body format is JSON.
          },
          withCredentials: true, //Indicates that cookies should be sent with the request, which can be important for authentication or session management.
        }
      );
      if (res.data.success) {
        navigate('/login')
        toast.success(res.data.message);
        setInput ( {
          username: "",
          email: "",
          password: ""
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
        onSubmit={signupHandler}
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
          <span className="">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent"
          />
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

        <Button type="submit"> Signup </Button>
        <span> already have an accout ? <Link to = '/login' className="text-blue-600">Login</Link> </span>
      </form>

    </div>
  );
}

export default Signup;
