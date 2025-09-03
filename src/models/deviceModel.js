import mongoose from "mongoose";

const devicesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        fcmToken: { type: String, require: true, default: "" },
        deviceType: {
            type: String,
            require: true,
            enum: ["ios", "android", "web"],
            default: "android",
        },
    },
    { timestamps: true }
);

const Device = mongoose.model("Device", devicesSchema);

export default Device;
