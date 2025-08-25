import mongoose from "mongoose";

let notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // receiver
        notifyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }, // notifyId is sender
        content: { type: String, default: "" },
        title: {
            ar: { type: String, default: "" },
            en: { type: String, default: "" },
        },
        message: {
            ar: { type: String, default: "" },
            en: { type: String, default: "" },
        },
        key: {
            type: String,
            enum: [
                "admin",
                "block",
                "delete",
                "permission",
                "message",
                "friendRequest",
            ],
            default: "admin",
        }, // to know mobile action
        data: {},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
