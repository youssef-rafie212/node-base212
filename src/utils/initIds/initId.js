import mongoose from "mongoose";

const initId = () => {
    const id = new mongoose.Types.ObjectId();
    return id;
};

export default initId;
