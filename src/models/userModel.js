import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: {
            type: String,
            default: "",
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, default: "" },
        avatar: { type: String, default: "" },
        country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
        timeZone: { type: String },
        gender: { type: String, enum: ["male", "female"] },
        uId: { type: String }, // unique id for user from firebase
        userType: {
            type: String,
            require: true,
            default: "guest",
            enum: ["guest", "user"],
        },
        status: {
            type: String,
            enum: ["block", "active", "delete", "deletePending"],
            default: "active",
        },
        activationCode: { type: String, default: "" },
        language: { type: String, enum: ["ar", "en"], default: "ar" },
        isNotify: { type: Boolean, enum: [true, false], default: true },
        notifyCount: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },
        dataCompleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
