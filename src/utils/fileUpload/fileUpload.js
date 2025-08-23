import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import SaveImage from "../fileSave/fileSave.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// build upload path
const getUploadPath = (dir, filename = "") =>
    path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "assets",
        "uploads",
        dir,
        filename
    );

// handle multiple files based on config
export const uploadMultipleFiles = async (req, filesConfig) => {
    try {
        const results = {};

        for (const config of filesConfig) {
            const { type, name, width, height, dir } = config;

            const fileArray = req.files?.[name];
            const files = Array.isArray(fileArray)
                ? fileArray
                : fileArray
                ? [fileArray]
                : [];

            if (!files.length) {
                results[name] = [];
                continue;
            }

            const uploaded = [];
            for (const file of files) {
                const uploadedFile = await uploadAnyFile(
                    { files: { [name]: file } },
                    type,
                    dir,
                    name,
                    width,
                    height
                );
                uploaded.push(uploadedFile);
            }

            results[name] = uploaded;
        }

        return results;
    } catch (error) {
        console.error("Multiple file upload error:", error);
        throw error;
    }
};

// general handler for any file type (single file)
export const uploadAnyFile = async (
    request,
    type,
    dir,
    name,
    width,
    height
) => {
    try {
        switch (type) {
            case "image":
                return await handleUploadImage(
                    request,
                    dir,
                    name,
                    width,
                    height
                );
            case "pdf":
                return await handleUploadPdf(request, dir, name);
            case "video":
                return await handleUploadVideo(request, dir, name);
            case "audio":
                return await handleUploadAudio(request, dir, name);
            case "excel":
                return await handleUploadExcel(request, dir, name);
            case "txt":
                return await handleUploadTxt(request, dir, name);
            case "record":
                return await handleUploadRecord(request, dir, name);
            default:
                throw new Error("Unsupported file type.");
        }
    } catch (error) {
        console.error("File upload error:", error);
        throw error;
    }
};

// single image upload
export const handleUploadImage = async (req, dir, name, width, height) => {
    const file = req.files?.[name];
    if (!file || !file.size) throw new Error("No image file provided.");

    const imageSaver = new SaveImage(getUploadPath(dir));

    return await imageSaver.save(
        file.data,
        file.name,
        path.extname(file.name).slice(1).toLowerCase(),
        width,
        height
    );
};

// generic file save handler
const saveFile = async (file, dir, prefix, allowedExtensions = []) => {
    if (!file || !file.size) throw new Error("No file provided.");

    const ext = path.extname(file.name).toLowerCase().replace(".", "");
    if (allowedExtensions.length && !allowedExtensions.includes(ext)) {
        throw new Error(
            `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`
        );
    }

    const fileName = `${prefix}${Math.floor(
        Math.random() * 100
    )}${Date.now()}.${ext}`;
    const uploadPath = getUploadPath(dir, fileName);

    await file.mv(uploadPath);
    return fileName;
};

// specific handlers
export const handleUploadPdf = (req, dir, name) =>
    saveFile(req.files[name], dir, "pdf", ["pdf"]);
export const handleUploadVideo = (req, dir, name) =>
    saveFile(req.files[name], dir, "video", ["mp4"]);
export const handleUploadAudio = (req, dir, name) =>
    saveFile(req.files[name], dir, "audio", ["mp3"]);
export const handleUploadExcel = (req, dir, name) =>
    saveFile(req.files[name], dir, "excel", ["xlsx"]);
export const handleUploadTxt = (req, dir, name) =>
    saveFile(req.files[name], dir, "txt", ["txt"]);
export const handleUploadRecord = (req, dir, name) =>
    saveFile(req.files[name], dir, "record", ["wav"]);
