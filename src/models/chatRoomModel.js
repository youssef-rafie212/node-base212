import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
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

// static method to find or create chat room between two users
chatRoomSchema.statics.findOrCreateChatRoom = function (user1Id, user2Id) {
    return this.findOne({
        participants: { $all: [user1Id, user2Id] },
        status: "active",
    }).then((chatRoom) => {
        if (chatRoom) {
            return chatRoom;
        }
        // Create new chat room
        return this.create({
            participants: [user1Id, user2Id],
        });
    });
};

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

// method to delete chat room
chatRoomSchema.methods.delete = function () {
    this.status = "deleted";
    return this.save();
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
