import { Country } from "../../models/index.js";

// check if country exists
export const validateCountryExists = async (countryId) => {
    try {
        const country = await Country.findById(countryId);
        return country;
    } catch (error) {
        console.error("Error checking if country exists:", error);
        throw error;
    }
};
