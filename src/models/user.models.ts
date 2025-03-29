import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  forgetPasswordToken?: string | null;
  forgetPasswordTokenExpiry?: Date | null;
  accessToken?: string | null;
  accessTokenExpiry?: Date | null;
  refreshToken?: string | null;
  refreshTokenExpiry?: Date | null;
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[]; // Change from Set to array
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    forgetPasswordToken: { type: String, default: null },
    forgetPasswordTokenExpiry: { type: Date, default: null },
    accessToken: { type: String, default: null },
    accessTokenExpiry: { type: Date, default: null },
    refreshToken: { type: String, default: null },
    refreshTokenExpiry: { type: Date, default: null },
    friends: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    friendRequests: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
