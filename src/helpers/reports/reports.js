import { Report } from "../../models/index.js";

// store a new report for admin actions
const createReport = async (adminId, message, typeMethod, url) => {
    await Report.create({
        admin: adminId,
        message: message,
        typeMethod: typeMethod,
        url: url,
    });
};

export default createReport;
