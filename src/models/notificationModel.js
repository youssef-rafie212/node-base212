import mongoose from "mongoose";

let notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" }, // receiver
        notify: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "notifyRef",
        }, // notifyId is sender
        userRef: {
            type: String,
            enum: ["User"],
            required: true,
        },
        notifyRef: {
            type: String,
            enum: ["User", "Admin"],
            required: true,
        },
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
