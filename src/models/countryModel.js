import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
    {
        name: {
            ar: { type: String },
            en: { type: String },
        },
        image: { type: String },
    },
    { timestamps: true }
);

const Country = mongoose.model("Country", countrySchema);

export default Country;
