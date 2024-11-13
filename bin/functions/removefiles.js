import { task } from "./task.js";
import { rimraf } from "rimraf";
import { promises as fs } from "fs";

const removeFiles = async (dir) => {
    await task('Remove Existing Files', async (utils) => {
        await rimraf(dir);
        await fs.mkdir(dir, { recursive: true });
    });
};

export { removeFiles };