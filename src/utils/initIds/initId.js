import mongoose from "mongoose";

// initialize a new objectId
const initId = () => {
    const id = new mongoose.Types.ObjectId();
    return id;
};

export default initId;
