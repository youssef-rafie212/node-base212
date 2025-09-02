import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        ar: { type: String },
        en: { type: String },
    },
    isAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
    permissions: [{ type: String }],
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
