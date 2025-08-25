import i18n from "i18n";

import { Admin } from "../../models/index.js";
import { apiError } from "../../utils/index.js";

// middleware for admin routes to make sure the current admin have the right permissions
const authorize = async (req, res, next) => {
    try {
        // find admin by id
        const admin = await Admin.findById(req.sub.id).populate("role");
        if (!admin || admin.status !== "active") {
            return res.status(403).send(apiError(403, i18n.__("forbidden")));
        }

        // get admin permissions
        const adminPermissions = admin.role.permissions || [];

        // get the current request URL, ignoring query parameters
        const urlWithoutQueryParams = req.url.split("?")[0];

        // segment the URL
        const urlSegments = urlWithoutQueryParams.split("/");

        // sanitize the URL
        const sanitizedUrl = urlSegments
            .map((segment) => (segment.length === 24 ? ":id" : segment)) // Replace MongoDB ObjectIds
            .join("/");

        // check if the admin has permission for the requested URL
        if (!adminPermissions.includes(sanitizedUrl)) {
            return res.status(403).send(apiError(403, i18n.__("forbidden")));
        }

        next();
    } catch (error) {
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export default authorize;
