import initId from "../../utils/initIds/initId.js";
import makeDir from "../../utils/makeDir/makeDir.js";
import { removeFile } from "../../utils/fileDelete/fileDelete.js";
import { uploadAnyFile } from "../../utils/fileUpload/fileUpload.js";

// handle user avatar upload
export const uploadAvatar = async (
    req,
    data,
    isUpdate = false,
    updateId = null,
    oldAvatarName = null
) => {
    // generate a new id if not provided
    const id = isUpdate ? updateId : initId();

    // check if the file is provided first
    if (req.files?.avatar) {
        // create directory if it does not exist
        const dir = makeDir(`users/${id}`);

        // upload the image
        const image = await uploadAnyFile(
            req,
            "image",
            dir,
            "avatar",
            500,
            500
        );

        // assign the image name to the data object
        data.avatar = image; 

        // remove old avatar if it exists
        if (isUpdate) {
            removeFile(oldAvatarName, "users", updateId);
        }
    }
    
    return id;
};
