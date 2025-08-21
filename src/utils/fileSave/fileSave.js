import path from "path";
import sharp from "sharp";

class FileSave {
    constructor(folder) {
        this.folder = folder;
    }
    async save(buffer, name, type = "png", width = 450, height = 400) {

        const filename = FileSave.filename(name, type);

        const filepath = this.filepath(filename);

        sharp.cache(false);

        await sharp(buffer)
        .withMetadata({orientation: 1})
        .resize(width, height, {
            kernel: sharp.kernel.lanczos2,
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .rotate()
        .toFile(filepath);
        return filename;
    }

    static filename(name, type) {
        return (name === 'logo' || name === 'backgroundLogin' || name.startsWith('country')) ? name + `.${type}` : "image" + Math.floor(Math.random() * 100) + Date.now() + `.${type}`;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`);
    }

}

export default FileSave;