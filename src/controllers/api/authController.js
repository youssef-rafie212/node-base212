import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async signup(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.signup(data, req);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("successfulSignup"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async requestOtp(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.requestOtp(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("otpSent"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async localSignIn(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.localSignIn(data);

            if (response.error) {
                return res.status(401).send(apiError(401, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("successfulLogin"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async socialSignIn(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.socialSignIn(data);

            if (response.error) {
                return res.status(401).send(apiError(401, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("successfulLogin"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async verifyEmail(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.verifyEmail(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("userVerified"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async verifyPhone(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.verifyPhone(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("userVerified"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async completeData(req, res) {
        try {
            const data = req.validatedData;

            const { sub } = req;

            const response = await this.authService.completeData(
                data,
                sub,
                req
            );

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("userUpdated"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async signOut(req, res) {
        try {
            const { id } = req.sub;

            const response = await this.authService.signOut(id);

            if (response.error) {
                return res.status(401).send(apiError(401, response.error));
            }

            res.send(apiResponse(200, i18n.__("userSignedOut"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async resetPassword(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.resetPassword(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(
                    200,
                    i18n.__("passwordResetSuccessfully"),
                    response.data
                )
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async verifyResetOtp(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.verifyResetOtp(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("otpVerified"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }
}
