import { initId, makeDir, fileDelete, fileUpload } from "../../utils/index.js";

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
        const image = await fileUpload.uploadAnyFile(
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
            fileDelete.removeFile(oldAvatarName, "users", updateId);
        }
    }

    return id;
};
