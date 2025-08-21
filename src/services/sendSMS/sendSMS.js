import axios from "axios";

// send sms to a phone number
const sendSMS = async (to, message) => {
    try {
        // validate the sms configuration
        if (
            !process.env.SMS_API_URL ||
            !process.env.SMS_USER ||
            !process.env.SMS_SECRET_KEY
        ) {
            return false;
        }

        // remove "+966" prefix if present
        const cleanedTo = to.startsWith("+966") ? to.replace("+966", "") : to;

        // construct request url
        const requestUrl = `${process.env.SMS_API_URL}/?secret_key=${
            process.env.SMS_SECRET_KEY
        }&user=${process.env.SMS_USER}&to=${encodeURIComponent(
            cleanedTo
        )}&message=${encodeURIComponent(message)}&sender=${encodeURIComponent(
            process.env.SMS_SENDER
        )}&test=${process.env.SMS_TEST_MODE === "true" ? 1 : 0}`;

        // send the sms
        const response = await axios.get(requestUrl, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        return false;
    }
};

export default sendSMS;
