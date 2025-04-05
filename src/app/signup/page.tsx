"use client";

import React, { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import axios from "axios";

const space = Space_Grotesk({ subsets: ["latin"] });

function Login() {
  const router = useRouter();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onSignUp = async () => {
    if (data.password !== data.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError(null);

    // Remove confirmPassword before sending request

    try {
      await axios.post("/api/users/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      router.push("/login");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div
      className={` ${space.className} h-screen flex justify-center items-center bg-black text-white`}
    >
      <div className="p-[3px] rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-[25%]">
        <div className="flex flex-col justify-center items-center w-full h-full bg-black rounded-lg p-6">
          <h1 className="text-3xl font-bold justify-start mb-6">Chat App</h1>
          <h1 className="mb-4 text-lg font-bold">Sign Up</h1>
          <input
            className="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your username"
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
          <input
            className="w-full p-2 m-2 border border-gray-400 rounded-md"
            placeholder="Enter your email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            className="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <input
            className="w-full p-2 mt-2 border border-gray-400 rounded-md"
            placeholder="Confirm password"
            type="password"
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <button
            className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:cursor-pointer"
            onClick={onSignUp}
          >
            Sign Up
          </button>
          <span className="mt-4">
            Already have an account?{" "}
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
