import express from "express";

import { roleController } from "../../controllers/dashboard/index.js";
import { roleValidation } from "../../validation/dashboard/index.js";
import {
    authenticateAdmin,
    validateRequest,
    authorize,
} from "../../middlewares/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";

const router = express.Router();

router.post(
    "/create-role",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    roleValidation.validateCreateRole,
    validateRequest,
    roleController.createRole
);

router.get("/get-all-roles", authenticateAdmin, roleController.getAllRoles);

router.get(
    "/get-role",
    authenticateAdmin,
    authorize,
    roleValidation.validateGetRole,
    validateRequest,
    roleController.getRole
);

router.patch(
    "/update-role-name",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    roleValidation.validateUpdateRoleName,
    validateRequest,
    roleController.updateRoleName
);

router.delete(
    "/delete-role",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    roleValidation.validateDeleteRole,
    validateRequest,
    roleController.deleteRole
);

router.get(
    "/get-all-permissions",
    authenticateAdmin,
    authorize,
    roleController.getAllPermissions
);

router.post(
    "/add-permissions-to-role",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    roleValidation.validateAddPermissionsToRole,
    validateRequest,
    roleController.addPermissionsToRole
);

router.delete(
    "/remove-permissions-from-role",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    roleValidation.validateRemovePermissionsFromRole,
    validateRequest,
    roleController.removePermissionsFromRole
);

export default router;
