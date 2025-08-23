import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { type: String },
    isAdmin: { type: Boolean, enum: [true, false], default: false },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
    permissions: [{ type: String }],
});

const Role = mongoose.model("Role", roleSchema);

export default Role;