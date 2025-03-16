"use client";

import React from "react";
import { Space_Grotesk } from "next/font/google";

const space = Space_Grotesk({ subsets: ["latin"] });

function Page() {
  return (
    <div className={`${space.className} flex h-screen bg-black`}>
      {/* Left Sidebar with Gradient Border on the Right */}
      <div className="relative w-[30%] h-[100vh]">
        {/* Gradient Border (Right Side) */}
        <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-pink-500 via-red-500 to-yellow-500"></div>

        {/* Sidebar Content */}
        <div className="h-full bg-black p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl text-white">Chat App</h1>
            <h2 className="text-lg text-white pr-6 hover:cursor-pointer">
              Logout
            </h2>
          </div>
          <input
            type="text"
            className="w-full p-2 my-4 border border-gray-400 rounded-md text-white bg-transparent"
            placeholder="Search"
          />
          {/* Chat List */}
          <div
            className="flex flex-col overflow-y-auto"
            style={{ height: "80%" }}
          >
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-row p-2 hover:bg-gray-600 hover:cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col ml-2">
                  <h1 className="text-white">John Doe</h1>
                  <p className="text-gray-400">Hello</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="w-[70%] h-[100vh] bg-black text-white flex flex-col">
        {/* Top Header Section */}
        <div className="h-[10vh] w-[100%] relative bg-black flex items-center p-2">
          <div className="flex flex-row p-2">
            <img
              src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=880&q=80"
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-2 flex flex-col">
              <h3>John Doe</h3>
              <h4 className="text-green-400 text-sm">Online</h4>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
        </div>
        <div className="flex flex-col overflow-y-auto">
          <div className="chat chat-start">
            <div className="chat-bubble ">What kind of nonsense is this</div>
          </div>

          <div className="chat chat-end">
            <div className="chat-bubble ">Calm down, Anakin.</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="flex flex-row p-2 absolute bottom-0 w-[70%]">
          <input
            type="text"
            placeholder="Type your message here"
            className="w-full p-2 border border-gray-400 rounded-md bg-black bottom-0"
          />
          <button className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
