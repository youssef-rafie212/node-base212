import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
    {
        chatRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatRoom",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        messageType: {
            type: String,
            enum: ["text"],
            default: "text",
        },
        status: {
            type: String,
            enum: ["active", "deleted"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// pre hook to set the last message and last message at fields in the chat room of this message
chatMessageSchema.pre("save", async function (next) {
    if (this.isNew) {
        const ChatRoom = mongoose.model("ChatRoom");
        await ChatRoom.findByIdAndUpdate(this.chatRoom, {
            lastMessage: this._id,
            lastMessageAt: this.createdAt || new Date(),
        });
    }
    next();
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;
