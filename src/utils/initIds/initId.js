import mongoose from "mongoose";

const initId = async () => {
    const id = new mongoose.Types.ObjectId();
    return id;
};

export default initId;
