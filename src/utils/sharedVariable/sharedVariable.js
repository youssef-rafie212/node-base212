import dotenv from "dotenv";

dotenv.config();

export const address =
    process.env.NODE_ENV === "development"
        ? process.env.ADDRESS_DEVELOPMENT || "http://127.0.0.1:3000"
        : process.env.ADDRESS_PRODUCTION || "https://base.com";
export const usersImage = "/assets/uploads/users/";
export const brandImage = "/assets/uploads/brands/";
export const supervisorsImage = "/assets/uploads/supervisors/";
export const settingImage = "/assets/uploads/logo/";
export const socialImage = "/assets/uploads/socialMedia/";
export const countryImage = "/assets/uploads/country/";
export const paymentImage = "/assets/uploads/payment/";
export const chatImage = "/assets/uploads/chat/images/";
export const chatAudio = "/assets/uploads/chat/audios/";
export const allPermissions = [
    {
        id: "1",
        parent: "/roles",
        titleEn: "roles",
        titleAr: "الأدوار",
        child: [
            {
                titleEn: "get roles",
                titleAr: "عرض الادوار",
                route: "/get-all-roles",
            },
            {
                titleEn: "get role",
                titleAr: "عرض دور",
                route: "/get-role",
            },
            {
                titleEn: "update role name",
                titleAr: "تحديث اسم الادوار",
                route: "/update-role-name",
            },
            {
                titleEn: "delete role",
                titleAr: "حذف دور",
                route: "/delete-role",
            },
            {
                titleEn: "add permissions to role",
                titleAr: "اضافة صلاحيات للادوار",
                route: "/add-permissions-to-role",
            },
            {
                titleEn: "remove permissions from role",
                titleAr: "حذف صلاحيات من الادوار",
                route: "/remove-permissions-from-role",
            },
            {
                titleEn: "get all permissions",
                titleAr: "عرض جميع الصلاحيات",
                route: "/get-all-permissions",
            },
            {
                titleEn: "create role",
                titleAr: "اضافة دور",
                route: "/create-role",
            },
        ],
    },
];
