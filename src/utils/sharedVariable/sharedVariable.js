import dotenv from "dotenv";

dotenv.config();

export const address =
    process.env.NODE_ENV === "development"
        ? process.env.ADDRESS_DEVELOPMENT || "http://127.0.0.1:3000"
        : process.env.ADDRESS_PRODUCTION || "https://base.com";
export const usersImage = "/assets/uploads/users/";
export const brandImage = "/assets/uploads/brands/";
export const supervisorsImage = "/assets/uploads/users/supervisors/";
export const settingImage = "/assets/uploads/logo/";
export const socialImage = "/assets/uploads/socialMedia/";
export const countryImage = "/assets/uploads/country/";
export const paymentImage = "/assets/uploads/payment/";
export const chatImage = "/assets/uploads/chat/images/";
export const chatAudio = "/assets/uploads/chat/audios/";
export const allPermissions = [
    {
        id: "1",
        parent: "/settings",
        titleEn: "settings",
        titleAr: "الاعدادات",
        child: [
            {
                titleEn: "get settings",
                titleAr: "عرض الاعدادات",
                route: "/get-settings",
            },
            {
                titleEn: "update settings",
                titleAr: "تحديث الاعدادات",
                route: "/update-settings",
            },
        ],
    },
    {
        id: "2",
        parent: "",
        titleEn: "authentication",
        titleAr: "التحقق",
        child: [
            {
                titleEn: "logout",
                titleAr: "تسجيل الخروج",
                route: "/logout",
            },
        ],
    },
];
