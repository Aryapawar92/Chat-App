import mongoose, { Document, Types } from "mongoose";

interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message: mongoose.Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
