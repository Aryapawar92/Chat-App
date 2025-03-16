import React from "react";
import { Space_Grotesk } from "next/font/google";

const space = Space_Grotesk({ subsets: ["latin"] });

function Login() {
  return (
    <div
      className={` ${space.className} h-screen flex justify-center items-center`}
    >
      <div className="flex flex-col justify-center items-center w-[25%] h-[50%] border border-black p-4">
        <h1 className="text-3xl font-bold justify-start mb-6">Chat App</h1>
        <h1 className="mb-4 text-lg font-bold">Login</h1>
        <input
          className="w-full p-2 m-2 border border-gray-400 rounded-md"
          placeholder="Enter your email"
        />
        <input
          className="w-full p-2 border border-gray-400 rounded-md"
          placeholder="Enter your password"
        />
        <button className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:cursor-pointer">
          Login
        </button>
        <span className="mt-4">
          Already have an account ?{" "}
          <span className="text-blue-500 hover:cursor-pointer">Sign In</span>
        </span>
      </div>
    </div>
  );
}

export default Login;
