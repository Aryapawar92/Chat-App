import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/db/dbConfig";

connectDB();

// Define DecodedToken interface
interface DecodedToken extends JwtPayload {
  _id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username }: { username: string } = body;

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as DecodedToken;
    if (!decodedToken || !decodedToken._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Safely convert user ID
    const userId = mongoose.Types.ObjectId.createFromHexString(
      decodedToken._id
    );

    // Find the logged-in user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the friend by username
    const friend = await User.findOne({ username });
    if (!friend) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    // Type assertion to specify _id type
    const friendId = new mongoose.Types.ObjectId(friend._id as string);

    // Check if already friends
    if (user.friends.some((f) => f.toString() === friendId.toString())) {
      return NextResponse.json(
        { message: "Friend already added", alreadyFriend: true }, // ✅ Send extra field
        { status: 200 }
      );
    }

    // Add friend
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    return NextResponse.json(
      { message: "Friend added successfully", alreadyFriend: false }, // ✅ Send extra field
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json({ error: "Error adding friend" }, { status: 500 });
  }
}
