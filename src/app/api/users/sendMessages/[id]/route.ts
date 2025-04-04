import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/user.models";
import Conversation from "@/models/conversation.models";
import Message from "@/models/message.models";

interface DecodedToken extends JwtPayload {
  _id: string;
}

export async function POST(request: NextRequest) {
  try {
    const url = request.url;
    const pathParts = url.split("/");
    const receiverId = new mongoose.Types.ObjectId(
      pathParts[pathParts.length - 1]
    );

    const body = await request.json();
    const { message } = body;

    const token = request.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as DecodedToken;
    if (!decodedToken || !decodedToken._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = new mongoose.Types.ObjectId(decodedToken._id);

    // ✅ Check if the receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // ✅ Find or create a conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }

    // ✅ Create and save the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      conversationId: conversation._id,
      message,
    });
    await newMessage.save();

    // ✅ Update conversation with new message
    conversation.messages.push(
      new mongoose.Types.ObjectId(newMessage._id as string)
    );
    await conversation.save();

    // ✅ Update user conversations if not already present
    await User.updateOne(
      { _id: senderId, conversations: { $ne: conversation._id } },
      { $push: { conversations: conversation._id } }
    );

    await User.updateOne(
      { _id: receiverId, conversations: { $ne: conversation._id } },
      { $push: { conversations: conversation._id } }
    );

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Error sending message" },
      { status: 500 }
    );
  }
}
