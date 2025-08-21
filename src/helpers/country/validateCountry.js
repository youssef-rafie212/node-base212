import Country from "../../models/countryModel.js";

export const validateCountryExists = async (countryId) => {
    try {
        const country = await Country.findById(countryId);
        return country;
    } catch (error) {
        console.error("Error checking if country exists:", error);
        throw error;
    }
};
