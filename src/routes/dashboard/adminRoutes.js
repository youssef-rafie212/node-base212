import express from "express";

import { adminController } from "../../controllers/dashboard/index.js";
import { adminValidation } from "../../validation/dashboard/index.js";
import {
    authenticateAdmin,
    validateRequest,
    authorize,
} from "../../middlewares/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";

const router = express.Router();

router.post(
    "/create-new-admin",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    adminValidation.validateCreateAdmin,
    validateRequest,
    adminController.createAdmin
);

router.get(
    "/get-all-admins",
    authenticateAdmin,
    authorize,
    adminController.getAllAdmins
);

router.get(
    "/get-admin",
    authenticateAdmin,
    authorize,
    adminValidation.validateGetAdminById,
    validateRequest,
    adminController.getAdmin
);

router.patch(
    "/update-admin",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    adminValidation.validateUpdateAdmin,
    validateRequest,
    adminController.updateAdmin
);

router.delete(
    "/delete-admin",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    adminValidation.validateDeleteAdminById,
    validateRequest,
    adminController.deleteAdmin
);

router.patch(
    "/toggle-block-admin",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    adminValidation.validateToggleBlockAdminById,
    validateRequest,
    adminController.toggleBlockAdmin
);

export default router;
