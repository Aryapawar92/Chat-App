import mongoose, { Document } from "mongoose";

interface IConversation extends Document {
  members: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Conversation: mongoose.Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
