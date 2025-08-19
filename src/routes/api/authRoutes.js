import express from "express";
import * as authController from "../../controllers/api/authController/authController.js";
import * as authValidation from "../../utils/validation/api/auth.js";
import authenticate from "../../middlewares/authenticate/authenticate.js";
import validateRequest from "../../middlewares/validateRequest/validateRequest.js";
import { doubleCsrfProtection } from "../../utils/csrf/csrfConfig.js";

const router = express.Router();

export default router;
