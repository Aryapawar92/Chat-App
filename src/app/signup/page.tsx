"use client";

import React from "react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";

const space = Space_Grotesk({ subsets: ["latin"] });
function Login() {
  const router = useRouter();

  return (
    <div
      className={` ${space.className} h-screen flex justify-center items-center bg-black text-white`}
    >
      <div className="p-[3px] rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-[25%]">
        <div className="flex flex-col justify-center items-center w-full h-full bg-black rounded-lg p-6">
          <h1 className="text-3xl font-bold justify-start mb-6">Chat App</h1>
          <h1 className="mb-4 text-lg font-bold">Sign Up</h1>
          <input
            className="w-full p-2  border border-gray-400 rounded-md"
            placeholder="Enter your username"
          />
          <input
            className="w-full p-2 m-2 border border-gray-400 rounded-md"
            placeholder="Enter your email"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your password"
          />
          <button className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:cursor-pointer">
            Sign Up
          </button>
          <span className="mt-4">
            Already have an account ?{" "}
            <span
              className="text-blue-500 hover:cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Sign In
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
