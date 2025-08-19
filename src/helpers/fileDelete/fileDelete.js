import path from "path";
import fs from "fs";
import { __dirname } from "../../utils/path/path.js";

export const removeFile = (name, type, otherLink) => {
    if (
        name !== "male.png" &&
        name !== "female.png" &&
        name !== "default.png"
    ) {
        if (type === "users") {
            fs.unlink(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "public",
                    "assets",
                    "uploads",
                    type,
                    otherLink,
                    name
                ),
                (err) => {
                    if (err) console.log(err);
                }
            );
        } else {
            fs.unlink(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "public",
                    "assets",
                    "uploads",
                    type,
                    name
                ),
                (err) => {
                    if (err) console.log(err);
                }
            );
        }
    }
};

export const removeFolder = (dir) => {
    try {
        if (
            fs.existsSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "public",
                    "assets",
                    "uploads",
                    dir
                )
            )
        ) {
            fs.rm(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "public",
                    "assets",
                    "uploads",
                    dir
                ),
                { recursive: true, force: true },
                (error) => error
            );
        }
    } catch (error) {
        console.log(error);
    }
};
