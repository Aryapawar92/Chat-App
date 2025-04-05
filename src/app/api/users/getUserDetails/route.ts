import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";
import { connectDB } from "@/db/dbConfig";

connectDB();

interface userDetails {
  username: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { username }: userDetails = body;

    if (!username) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sendUser = {
      username: user.username,
      email: user.email,
    };

    return NextResponse.json({ user: sendUser }, { status: 200 });
  } catch (error) {
    console.error("Error getting user details:", error);
    return NextResponse.json(
      { error: "Error getting user details" },
      { status: 500 }
    );
  }
}
