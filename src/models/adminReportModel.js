import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        message: { type: String, default: "" },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            require: true,
        },
        typeMethod: { type: String, default: "" },
        url: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Report", reportSchema);
