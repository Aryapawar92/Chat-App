"use client";

import React, { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

const space = Space_Grotesk({ subsets: ["latin"] });

function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState({ username: "" });
  const router = useRouter();

  // Get user details
  const getDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/getUserDetails",
        data
      );

      setName(response.data.user.username);
      setEmail(response.data.user.email);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  // Add friend
  const [isFriend, setIsFriend] = useState(false);

  const addFriend = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/addFriend",
        { username: data.username }
      );

      if (response.data.alreadyFriend) {
        setIsFriend(true); // ✅ Set state to show "Already Friends"
      } else {
        setIsFriend(false);
        console.log(response.data.message); // ✅ Friend added successfully
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const goToChat: React.MouseEventHandler = async () => {
    router.push("/chat");
  };

  return (
    <div
      className={`${space.className} flex justify-center items-center bg-black text-white h-screen w-screen`}
    >
      <div className="h-[50vh] w-[50vh] border border-white rounded-xl">
        <h1 className="items-center justify-center flex p-2">Add Friend</h1>
        <div className="items-center justify-center flex gap-4">
          <input
            type="text"
            value={data.username}
            placeholder="Enter friend's username"
            className="p-2 mt-4 border border-white rounded-xl"
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 mt-4 border border-white rounded-xl hover:bg-white cursor-pointer hover:text-black"
            onClick={getDetails}
          >
            Enter
          </motion.button>
        </div>
        <div className="items-center justify-center flex flex-col m-6">
          <h2 className="mt-2 font-bold">Info</h2>
          <p className="mt-2">Name: {name}</p>
          <p className="mt-2">Email: {email}</p>
          {isFriend ? (
            <p className="mt-2 text-green-400">Already Friends</p>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="mt-6 p-2 border border-white rounded-xl cursor-pointer hover:bg-white hover:text-black"
              onClick={addFriend}
            >
              Add Friend
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={goToChat}
            className="mt-6 p-2 border border-white rounded-xl cursor-pointer hover:bg-white hover:text-black"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Page;
