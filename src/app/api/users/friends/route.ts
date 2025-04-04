import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@/db/dbConfig";
import mongoose from "mongoose";

connectDB();

interface decodedToken extends JwtPayload {
  _id: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as decodedToken;

    if (!decodedToken || !decodedToken._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(decodedToken._id);

    const user = await User.findById(userId).populate("friends", "username");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ friends: user.friends }, { status: 200 });
  } catch (error) {
    console.error("Error getting friends:", error);
    return NextResponse.json(
      { error: "Error getting friends" },
      { status: 500 }
    );
  }
}
