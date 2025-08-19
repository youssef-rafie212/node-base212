import * as codeGeneration from "../../utils/generateCode/generateCode.js";
import sendEmail from "../../services/nodemailer/sendEmail.js";
import sendSMS from "../../services/sendSMS/sendSMS.js";
import i18n from "i18n";

export const sendVerificationByEmail = async (
    email,
    subjectKey,
    textKey,
    htmlKey
) => {
    const otp = codeGeneration.generateOtp();
    const emailData = {
        to: email,
        subject: i18n.__(subjectKey, { otp }),
        text: i18n.__(textKey, { otp }),
        html: i18n.__(htmlKey, { otp }),
    };
    await sendEmail(emailData);
    return otp;
};

export const sendVerificationBySMS = async (phoneNumber, messageKey) => {
    const otp = codeGeneration.generateOtp();
    await sendSMS(phoneNumber, i18n.__(messageKey, { otp }));
    return otp;
};
