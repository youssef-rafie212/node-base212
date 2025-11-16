import { Country } from "../../models/index.js";

// check if country exists
export const validateCountryExists = async (countryId) => {
    try {
        if (!countryId) return false;
        const country = await Country.findById(countryId);
        return country !== null;
    } catch (error) {
        console.error("Error checking if country exists:", error);
        throw error;
    }
};
