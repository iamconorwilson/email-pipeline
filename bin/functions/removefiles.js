import { task } from "./task.js";
import { rimrafSync } from "rimraf";

const removeFiles = async (dir) => {
    await task('Remove Existing Files', async (utils) => {
        const paths = await utils.getFiles(dir);
        rimrafSync(paths);
    });
};

export { removeFiles };