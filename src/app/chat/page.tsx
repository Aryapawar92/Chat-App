"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const space = Space_Grotesk({ subsets: ["latin"] });

type ChatMessage = {
  senderId: string;
  message: string;
};

function Page() {
  const router = useRouter();

  const [friends, setFriends] = useState<{ _id: string; username: string }[]>(
    []
  );
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [chatName, setChatName] = useState("");
  const [image, setImage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch logged in user and initialize socket AFTER that
  useEffect(() => {
    const fetchUserAndInitSocket = async () => {
      try {
        const token = await axios.get("/api/users/token", {
          withCredentials: true,
        });

        const userId = token.data.user._id;
        setLoggedInUserId(userId);

        const newSocket = io("http://localhost:3001", {
          query: {
            userId: userId,
          },
        });

        setSocket(newSocket);

        newSocket.on("receive-message", (data) => {
          setMessages((prev) => [...prev, data]);
        });

        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserAndInitSocket();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("/api/users/friends");
        setFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const goToAddFriend = () => {
    router.push("/chat/addfriend");
  };

  const getInfo = async (friendUserName: string, friendId: string) => {
    setSelectedFriendId(friendId);
    setChatName(friendUserName);
    setImage(
      `https://api.dicebear.com/7.x/identicon/svg?seed=${friendUserName}`
    );

    try {
      const response = await axios.get(`/api/users/messages/${friendId}`);
      setMessages(
        Array.isArray(response.data.messages) ? response.data.messages : []
      );
    } catch (error) {
      console.error("Error fetching chat:", error);
      setMessages([]);
    }
  };

  const sendMessage = async (message: string) => {
    if (!loggedInUserId || !selectedFriendId || !message.trim()) return;

    const data = {
      senderId: loggedInUserId,
      receiverId: selectedFriendId,
      message,
    };

    try {
      await axios.post(`/api/users/sendMessages/${selectedFriendId}`, {
        message,
      });

      if (socket) {
        socket.emit("send-message", data); // Send full data object
      }

      setMessages((prev) => [...prev, { senderId: loggedInUserId, message }]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className={`${space.className} flex w-full overflow-hidden h-screen bg-black`}
    >
      <div className="relative w-[30%] h-full">
        <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-pink-500 via-red-500 to-yellow-500" />
        <div className="bg-black p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl text-white">Chat App</h1>
            <div className="flex gap-2">
              <button
                className="text-sm text-white bg-blue-400 py-1 px-3 rounded-2xl hover:bg-blue-600"
                onClick={onLogout}
              >
                Logout
              </button>
              <button
                className="text-sm text-white bg-blue-400 py-1 px-3 rounded-2xl hover:bg-blue-600"
                onClick={goToAddFriend}
              >
                Add
              </button>
            </div>
          </div>
          <input
            type="text"
            className="w-full p-2 mb-4 border border-gray-400 rounded-md text-white bg-transparent"
            placeholder="Search"
          />
          <div
            className="flex flex-col overflow-y-auto"
            style={{ height: "80%" }}
          >
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="flex flex-row p-2 hover:bg-gray-600 cursor-pointer"
                onClick={() => getInfo(friend.username, friend._id)}
              >
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}`}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col ml-2">
                  <h1 className="text-white">{friend.username}</h1>
                  <p className="text-gray-400 text-sm">Click to chat</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[70%] h-full bg-black text-white flex flex-col">
        <div className="h-[10vh] w-full relative bg-black flex items-center p-4">
          <div className="flex items-center">
            <img
              src={image}
              alt={chatName}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-2">
              <h3 className="text-lg font-medium">{chatName}</h3>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
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
                    className={`chat-bubble min-h-[40px] max-w-[80%] px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No messages yet</p>
          )}
        </div>

        <div className="flex p-4 absolute bottom-0 w-[70%] bg-black">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here"
            className="w-full p-2 border border-gray-400 rounded-md bg-black text-white"
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
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
