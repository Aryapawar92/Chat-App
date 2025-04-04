import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user.models";

interface DecodedToken extends jwt.JwtPayload {
  _id: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    console.log("Token from cookie:", token);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as DecodedToken;

    if (!decodedToken || !decodedToken._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Decoded token:", decodedToken);

    const user = await User.findById(decodedToken._id).select("_id");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error getting user details:", error);
    return NextResponse.json(
      { error: "Error getting user details" },
      { status: 500 }
    );
  }
}
