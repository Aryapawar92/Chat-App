"use client";

import React, { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import axios from "axios";

const space = Space_Grotesk({ subsets: ["latin"] });

function Login() {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    // Fix for mobile browser vh issues
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onLogin = async () => {
    try {
      const response = await axios.post("/api/users/login", data, {
        withCredentials: true,
      });
      setStatus(response.status);
      router.push("/chat");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div
      className={`${space.className} flex justify-center items-center h-screen   bg-black text-white overflow-hidden`}
    >
      {/* Gradient border wrapper */}
      <div className="p-[3px] rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-[25%] max-h-fit">
        {/* Content container */}
        <div className="flex flex-col justify-center items-center w-full bg-black rounded-lg p-4">
          <h1 className="text-3xl font-bold justify-start mb-6">Chat App</h1>
          <h1 className="mb-4 text-lg font-bold">Login</h1>
          <input
            className="w-full p-2 mb-4 border text-white border-gray-400 rounded-md bg-black"
            placeholder="Enter your email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            className="w-full p-2 border border-gray-400 rounded-md bg-black"
            placeholder="Enter your password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {status === 404 && <p className="text-red-500">User not found</p>}
          {status === 401 && (
            <p className="text-red-500">Invalid credentials</p>
          )}
          {status === 200 && (
            <p className="text-green-500">Login successful!</p>
          )}

          <button
            className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:cursor-pointer"
            onClick={onLogin}
          >
            Login
          </button>
          <span className="mt-4">
            New to this App?{" "}
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
