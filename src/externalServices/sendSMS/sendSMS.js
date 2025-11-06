import axios from "axios";
import { AuthenticaConfig } from "../../../config/index.js";

// send sms to a phone number
const sendSMS = async (phoneNumber, otp) => {
    try {
        // Ensure phone number has proper format with country code
        let formattedPhone = phoneNumber;

        // If phone doesn't start with +, add Saudi Arabia country code
        if (!phoneNumber.startsWith("+")) {
            // Remove any leading zeros and add +966 (Saudi Arabia)
            formattedPhone = `+966${phoneNumber.replace(/^0+/, "")}`;
        }

        console.log(`Sending OTP to: ${formattedPhone}`);

        const requestData = {
            method: "sms",
            phone: formattedPhone,
            template_id: 31, // Use the template_id from the example
            fallback_email: "youssefelbosaty3@gmail.com",
            otp: otp,
        };

        console.log("Request data:", requestData);

        const response = await axios.post(
            "https://api.authentica.sa/api/v2/send-otp",
            requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Authorization": AuthenticaConfig.apiKey,
                },
                timeout: 10000, // 10 second timeout
            }
        );

        return response.data;
    } catch (error) {
        return false;
    }
};

export default sendSMS;
