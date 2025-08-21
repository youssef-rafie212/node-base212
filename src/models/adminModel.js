import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        password: { type: String, default: "" },
        avatar: { type: String, default: "default.png" },
        language: { type: String, enum: ["ar", "en"], default: "ar" },
        status: {
            type: String,
            enum: ["block", "active", "delete"],
            default: "active",
        },
        isAdmin: { type: Boolean, default: false },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        theme: { type: String, enum: ["light", "dark"], default: "dark" },
    },
    { timestamps: true, versionKey: false }
);

// pre save hook to hash the password before saving
adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// method to compare passwords with the hashed password
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
