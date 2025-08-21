import i18n from "i18n";

import * as codeGeneration from "../../utils/generateCode/generateCode.js";
import sendEmail from "../../services/nodemailer/sendEmail.js";
import sendSMS from "../../services/sendSMS/sendSMS.js";

// sends OTP verification by email
export const sendVerificationByEmail = async (
    email,
    subjectKey,
    textKey,
    htmlKey
) => {
    // generate a new OTP
    const otp = codeGeneration.generateOtp();

    // set the data to be sent in the email
    const emailData = {
        to: email,
        subject: i18n.__(subjectKey, { otp }),
        text: i18n.__(textKey, { otp }),
        html: i18n.__(htmlKey, { otp }),
    };

    // send the email
    await sendEmail(emailData);

    return otp;
};

// sends OTP verification by SMS
export const sendVerificationBySMS = async (phoneNumber, messageKey) => {
    // generate a new OTP
    const otp = codeGeneration.generateOtp();

    // send the SMS
    const smsResponse = await sendSMS(
        phoneNumber,
        i18n.__(messageKey, { otp })
    );

    return { otp, smsResponse };
};
