import path from "path";
import FileSave from "../fileSave/fileSave.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

// General handler for any file type
export const uploadAnyFile = async (
    request,
    type,
    dir,
    name,
    width,
    height
) => {
    let file = "";
    if (type === "image") {
        file = await handleUploadAnyImage(request, dir, name, width, height);
    } else if (type === "pdf") {
        file = await handleUploadPdf(request, dir, name);
    } else {
        file = await handleVideo(request, dir, name, type);
    }
    return file;
};

export const handleUploadAnyImage = async (
    request,
    dir,
    imageName,
    width,
    height
) => {
    // Define upload path
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
    let fileUpload = new FileSave(pathUpload);

    // Initialize image processing result
    let results = [];

    // Handle Express File Upload
    if (request.files && request.files[imageName]) {
        // Multiple images
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
            // Single image
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

    // Handle Multer
    else if (request.file || request.files) {
        if (Array.isArray(request.files)) {
            for (let i = 0; i < request.files.length; i++) {
                const images = await fileUpload.save(
                    request.files[i].buffer,
                    request.files[i].originalname,
                    request.files[i].originalname.split(".").pop(),
                    width,
                    height
                );
                results.push(images);
            }
        } else {
            // Single image
            const image = await fileUpload.save(
                request.file.buffer,
                request.file.originalname,
                request.file.originalname.split(".").pop(),
                width,
                height
            );
            results.push(image);
        }
    }

    // Return results
    return Array.isArray(results) && results.length > 1 ? results : results[0];
};

export const handleVideo = async (request, dir, name, type) => {
    try {
        // Check if the file exists in the request
        if (!request.files || !request.files[name]) {
            throw new Error("No video file provided.");
        }

        // Get the file from the request
        const file = request.files[name];

        // Generate a unique file name
        const fileName =
            "video" + Math.floor(Math.random() * 100) + Date.now() + `.${type}`;

        // Define the upload path
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

        // Move the file to the specified upload path
        await file.mv(uploadPath);

        // Return the uploaded file name
        return fileName;
    } catch (err) {
        console.error("Video upload error:", err); // Log error for debugging

        // Throw error to be handled in the calling function
        throw new Error("Failed to upload video file");
    }
};

export const handleUploadPdf = async (req, dir, name) => {
    try {
        // Get the file from request
        const file = req.files[name];

        // Generate a unique file name
        const fileName =
            "pdf" + Math.floor(Math.random() * 100) + Date.now() + ".pdf";

        // Define the upload path
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

        // Move the file to the upload path
        await file.mv(uploadPath);

        // Return the file name if upload is successful
        return fileName;
    } catch (err) {
        console.error("File upload error:", err); // Log the error for debugging

        // Throw a specific error to handle it in higher layers
        throw new Error("Failed to upload PDF file");
    }
};
