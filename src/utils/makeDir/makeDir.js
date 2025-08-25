import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create a directory if it does not exist
const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(
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
            {
                recursive: true,
            }
        );
        return dir;
    }
};

export default makeDir;
