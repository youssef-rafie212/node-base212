import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        linkAndroid: { type: String, default: "" },
        linkApple: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        appTitle: {
            ar: { type: String, default: "" },
            en: { type: String, default: "" },
        },
        codeGenerate: { type: Boolean, enum: [true, false], default: true },
        code: { type: String, default: "" },
        dashboardSecretToken: { type: String, default: "" }, // dashboard secret token to access the dashboard login page
        version: { type: String }, // version
    },
    { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
