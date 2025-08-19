const mongoose = require("mongoose");
let notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" }, // receiver
        notifyId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "notifyRef",
        }, // notifyId is sender
        userRef: { type: String, enum: ["User", "Admin"], required: true },
        notifyRef: { type: String, enum: ["User", "Admin"], required: true },
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
        status: { type: String, enum: ["seen", "unseen"], default: "unseen" },
        data: {},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
