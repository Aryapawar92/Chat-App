"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const space = Space_Grotesk({ subsets: ["latin"] });

interface DecodedToken {
  _id: string;
}

function Page() {
  const router = useRouter();

  const [friends, setFriends] = useState<{ _id: string; username: string }[]>(
    []
  );

  const [text, setText] = useState("");

  const [messages, setMessages] = useState<
    { senderId: string; message: string }[]
  >([]);
  const [selectedFriendId, setSelectedFriendId] = useState("");

  const [chatName, setChatName] = useState("");
  const [image, setImage] = useState(
    "https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}"
  );

  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await axios.get("http://localhost:3000/api/users/token", {
          withCredentials: true,
        });
        console.log("Token data:", token.data.user._id);

        setLoggedInUserId(token.data.user._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Fix for mobile browser vh issues
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onLogout: React.MouseEventHandler = async () => {
    try {
      await axios.get("http://localhost:3000/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const goToAddFriend: React.MouseEventHandler = () => {
    router.push("/chat/addfriend");
  };

  useEffect(() => {
    // Fetch friends when the component mounts
    async function fetchFriends() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/friends"
        );
        setFriends(response.data.friends);
      } catch (error) {
        console.log("Error fetching friends:", error);
      }
    }

    fetchFriends();
  }, []);

  const getInfo = async (friendUserName: string, friendId: string) => {
    setSelectedFriendId(friendId); // Update selected friend

    setChatName(friendUserName);
    setImage(
      `https://api.dicebear.com/7.x/identicon/svg?seed=${friendUserName}`
    );

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/messages/${friendId}`
      );

      if (Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      } else {
        setMessages([]); // Prevent undefined errors
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      setMessages([]);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/sendMessages/${selectedFriendId}`,
        { message }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className={`${space.className} flex w-full overflow-hidden h-screen bg-black`}
    >
      {/* Left Sidebar with Gradient Border on the Right */}
      <div className="relative w-[30%] h-[100%]">
        {/* Gradient Border (Right Side) */}
        <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-pink-500 via-red-500 to-yellow-500"></div>

        {/* Sidebar Content */}
        <div className=" bg-black p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl text-white">Chat App</h1>
            <button
              className="text-md text-white bg-blue-400 py-2 px-4 rounded-2xl  hover:bg-blue-600"
              onClick={onLogout}
            >
              Logout
            </button>
            <button
              className="text-md text-white bg-blue-400 flex-wrap py-2 px-4 rounded-2xl hover:bg-blue-600 flex items-center justify-center"
              onClick={goToAddFriend}
            >
              Add
            </button>
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
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="flex flex-row p-2 hover:bg-gray-600 hover:cursor-pointer"
                //onClick={() => router.push(`/chat/${friend._id}`)}
                onClick={() => getInfo(friend.username, friend._id)}
              >
                <img
                  src="https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}"
                  alt={friend.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col ml-2">
                  <h1 className="text-white">{friend.username}</h1>
                  <p className="text-gray-400">Click to chat</p>
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
            <img src={image} alt="" className="w-12 h-12 rounded-full" />
            <div className="ml-2 flex flex-col">
              <h3>{chatName}</h3>
              {/* <h4 className="text-green-400 text-sm">Online</h4> */}
            </div>
          </div>

          {/* Bottom Border */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
        </div>
        <div className="flex flex-col overflow-y-auto p-4 h-[80vh]">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isCurrentUser = msg.senderId === loggedInUserId;

              return (
                <div
                  key={index}
                  className={`chat ${
                    isCurrentUser ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble min-h-[40px] flex items-center ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message || "Test message"}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No messages yet</p>
          )}
        </div>

        {/* Input Section */}
        <div className="flex flex-row p-2 absolute bottom-0 w-[70%]">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here"
            className="w-full p-2 border border-gray-400 rounded-md bg-black bottom-0"
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer hover:bg-blue-700"
            onClick={() => sendMessage(text)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
