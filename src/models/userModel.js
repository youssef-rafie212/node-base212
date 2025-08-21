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
        type: {
            type: String,
            require: true,
            default: "User",
            enum: ["User"],
        },
        status: {
            type: String,
            enum: ["block", "active", "delete", "deletePending"],
            default: "active",
        },
        activationCode: { type: String, default: "" },
        activationExpiresAt: { type: Date },
        language: { type: String, enum: ["ar", "en"], default: "ar" },
        isNotify: { type: Boolean, enum: [true, false], default: true },
        notifyCount: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },
        dataCompleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// pre save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// pre find hook to populate wanted fields
userSchema.pre(/^find/, function (next) {
    this.populate("country");
    next();
});

// method to compare passwords with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
