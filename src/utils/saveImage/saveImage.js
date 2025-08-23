import path from "path";
import sharp from "sharp";

// this class handles file (image) saving operations
class SaveImage {
    constructor(folder) {
        this.folder = folder;
    }

    // save file
    async save(buffer, name, type = "png", width = 500, height = 500) {
        // generate unique filename
        const filename = SaveImage.filename(name, type);

        // generate file path
        const filepath = this.filepath(filename);

        // disable sharp caching
        sharp.cache(false);

        // process image and save it
        await sharp(buffer)
            .withMetadata({ orientation: 1 })
            .resize(width, height, {
                kernel: sharp.kernel.lanczos2,
                fit: sharp.fit.cover,
                position: "center",
            })
            .rotate()
            .toFile(filepath);

        return filename;
    }

    // generate unique filename
    static filename(name, type) {
        return name === "logo" ||
            name === "backgroundLogin" ||
            name.startsWith("country")
            ? name + `.${type}`
            : "image" +
                  Math.floor(Math.random() * 100) +
                  Date.now() +
                  `.${type}`;
    }

    // generate file path
    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`);
    }
}

export default SaveImage;
