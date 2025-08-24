import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
    {
        // for group rooms only
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "userRef",
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "userRef",
                required: true,
            },
        ],
        userRef: {
            type: String,
            required: true,
            enum: ["User"],
        },
        roomType: {
            type: String,
            enum: ["direct", "group"],
            default: "direct",
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatMessage",
            default: null,
        },
        lastMessageAt: {
            type: Date,
            default: null,
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: new Map(),
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

// method to get the other participant
chatRoomSchema.methods.getOtherParticipant = function (currentUserId) {
    return this.participants.find(
        (participant) => !participant.equals(currentUserId)
    );
};

// method to increment unread count for a user
chatRoomSchema.methods.incrementUnreadCount = function (userId) {
    const currentCount = this.unreadCount.get(userId.toString()) || 0;
    this.unreadCount.set(userId.toString(), currentCount + 1);
    return this.save();
};

// method to reset unread count for a user
chatRoomSchema.methods.resetUnreadCount = function (userId) {
    this.unreadCount.set(userId.toString(), 0);
    return this.save();
};

// method to archive chat room
chatRoomSchema.methods.archive = function () {
    this.status = "archived";
    return this.save();
};

// method to delete chat room
chatRoomSchema.methods.delete = function () {
    this.status = "deleted";
    return this.save();
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
