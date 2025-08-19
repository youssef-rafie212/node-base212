import apiError from "../../helpers/api/apiError.js";
import Admin from "../../models/adminModel.js";

const authorize = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.sub.id).populate("role");
        if (!admin) {
            return res.send(apiError(403, i18n.__("forbidden")));
        }

        const adminPermissions = admin.role.permissions || [];

        const urlWithoutQueryParams = req.url.split("?")[0];
        const urlSegments = urlWithoutQueryParams.split("/");
        const sanitizedUrl = urlSegments
            .map((segment) => (segment.length === 24 ? ":id" : segment)) // Replace MongoDB ObjectIds
            .join("/");

        if (!adminPermissions.includes(sanitizedUrl)) {
            return res.send(apiError(403, i18n.__("forbidden")));
        }

        next();
    } catch (error) {
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export default authorize;
