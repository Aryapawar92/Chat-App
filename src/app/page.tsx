"use client";

import React from "react";
import { Space_Grotesk } from "next/font/google";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const space = Space_Grotesk({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const goToLogin: React.MouseEventHandler = () => {
    router.push("/login");
  };

  return (
    <div
      className={` ${space.className} flex flex-col justify-center items-center h-screen bg-black text-white`}
    >
      <motion.h1 whileInView={{}} className="text-7xl m-4">
        Chat App
      </motion.h1>
      <h4 className="text-2xl m-2">by Arya Pawar</h4>
      <h3 className="text-2xl m-2">Talk to Anyone. Anywhere. Anytime</h3>
      <button
        className="p-2 mt-4 border border-white rounded-xl hover:bg-white hover:text-black cursor-pointer"
        onClick={goToLogin}
      >
        Get Started
      </button>
    </div>
  );
}
