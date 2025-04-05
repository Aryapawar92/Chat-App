import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/message.models";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

interface DecodedToken extends JwtPayload {
  _id: string;
}

export async function GET(request: NextRequest) {
  try {
    // Extract receiverId from request URL
    const { pathname } = request.nextUrl;
    const pathParts = pathname.split("/");
    const receiverIdString = pathParts[pathParts.length - 1];

    if (!mongoose.isValidObjectId(receiverIdString)) {
      return NextResponse.json(
        { error: "Invalid receiver ID" },
        { status: 400 }
      );
    }

    const receiverId = new mongoose.Types.ObjectId(receiverIdString);

    // Extract token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.TOKEN_SECRET!
      ) as DecodedToken;
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (
      !decodedToken ||
      !decodedToken._id ||
      !mongoose.isValidObjectId(decodedToken._id)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(decodedToken._id);

    // Fetch conversation messages
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
