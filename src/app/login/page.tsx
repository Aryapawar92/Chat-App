"use client";

import React from "react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";

const space = Space_Grotesk({ subsets: ["latin"] });

function Login() {
  const router = useRouter();

  return (
    <div
      className={`${space.className} h-screen flex justify-center items-center bg-black text-white`}
    >
      {/* Gradient border wrapper */}
      <div className="p-[3px] rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-[25%]">
        {/* Content container */}
        <div className="flex flex-col justify-center items-center w-full h-full bg-black rounded-lg p-6">
          <h1 className="text-3xl font-bold justify-start mb-6">Chat App</h1>
          <h1 className="mb-4 text-lg font-bold">Login</h1>
          <input
            className="w-full p-2 m-2 border text-white border-gray-400 rounded-md bg-black"
            placeholder="Enter your email"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded-md bg-black"
            placeholder="Enter your password"
          />
          <button className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:cursor-pointer">
            Login
          </button>
          <span className="mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-500 hover:cursor-pointer"
              onClick={() => router.push("/signup")}
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
