import fs from "fs";
import path from "path";
import { __dirname } from "../../utils/path/path.js";

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
