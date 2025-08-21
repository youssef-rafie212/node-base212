import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import FileSave from "../fileSave/fileSave.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// general handler for any file type
export const uploadAnyFile = async (
    request,
    type,
    dir,
    name,
    width,
    height
) => {
    try {
        let file = "";
        if (type === "image") {
            file = await handleUploadAnyImage(
                request,
                dir,
                name,
                width,
                height
            );
        } else if (type === "pdf") {
            file = await handleUploadPdf(request, dir, name);
        } else {
            file = await handleVideo(request, dir, name, type);
        }
        return file;
    } catch (error) {
        console.error("File upload error:", error);
        throw error;
    }
};

// handle image uploads
export const handleUploadAnyImage = async (
    request,
    dir,
    imageName,
    width,
    height
) => {
    try {
        // define upload path
        let pathUpload = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "assets",
            "uploads",
            dir
        );

        // create fileSave instance
        let fileUpload = new FileSave(pathUpload);

        // initialize image processing results
        let results = [];

        if (request.files && request.files[imageName]) {
            // multiple images
            if (Array.isArray(request.files[imageName])) {
                for (const file of request.files[imageName]) {
                    const images = await fileUpload.save(
                        file.data,
                        file.name,
                        file.name.split(".").pop(),
                        width,
                        height
                    );
                    results.push(images);
                }
            } else {
                // single image
                const image = await fileUpload.save(
                    request.files[imageName].data,
                    request.files[imageName].name,
                    request.files[imageName].name.split(".").pop(),
                    width,
                    height
                );
                results.push(image);
            }
        }

        // return results
        return Array.isArray(results) && results.length > 1
            ? results
            : results[0];
    } catch (error) {
        console.error("Image upload error:", error);
        throw error;
    }
};

// handle video uploads
export const handleVideo = async (request, dir, name, type) => {
    try {
        // check if the file exists in the request
        if (!request.files || !request.files[name]) {
            throw new Error("No video file provided.");
        }

        // get the file from the request
        const file = request.files[name];

        // generate a unique file name
        const fileName =
            "video" + Math.floor(Math.random() * 100) + Date.now() + `.${type}`;

        // define the upload path
        const uploadPath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "assets",
            "uploads",
            dir,
            fileName
        );

        // move the file to the specified upload path
        await file.mv(uploadPath);

        // return the uploaded file name
        return fileName;
    } catch (error) {
        console.error("Video upload error:", error);
        throw error;
    }
};

// handle pdf uploads
export const handleUploadPdf = async (req, dir, name) => {
    try {
        // get the file from request
        const file = req.files[name];

        // generate a unique file name
        const fileName =
            "pdf" + Math.floor(Math.random() * 100) + Date.now() + ".pdf";

        // define the upload path
        const uploadPath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "assets",
            "uploads",
            dir,
            fileName
        );

        // move the file to the upload path
        await file.mv(uploadPath);

        // return the file name if upload is successful
        return fileName;
    } catch (error) {
        console.error("File upload error:", error);
        throw error;
    }
};
