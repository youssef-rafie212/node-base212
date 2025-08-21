import initId from "../../utils/initIds/initId.js";
import makeDir from "../../utils/makeDir/makeDir.js";
import { uploadAnyFile } from "../../utils/fileUpload/fileUpload.js";

export const uploadAvatar = async (req, data, id = null) => {
    id = id || initId();
    if (req.files?.avatar) {
        const dir = makeDir(`users/${id}`);
        const image = await uploadAnyFile(
            req,
            "image",
            dir,
            "avatar",
            500,
            500
        );
        data.avatar = image;
    }
    return id;
};
