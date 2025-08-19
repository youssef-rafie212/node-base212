import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "userRef",
            required: true,
        },
        userRef: {
            type: String,
            enum: ["User", "Admin"],
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const UserToken = mongoose.model("UserToken", userTokenSchema);

export default UserToken;
