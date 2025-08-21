import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

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
