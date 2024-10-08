import { promises as fs } from "fs";
import { sep as pathSep } from 'path';
import { task } from "./task.js";
import { log } from "./logger.js";

const removeFiles = async (dir) => {

    await task('Remove Existing Files', async (utils) => {
        const paths = await utils.getFiles(dir);

        const directories = await Promise.all(paths.map(async (path) => {
            const stats = await fs.stat(path);
            return stats.isDirectory() ? path : null;
        })).then((dirs) => dirs.filter((dir) => dir !== null));

        directories.sort((a, b) => b.split(pathSep).length - a.split(pathSep).length);

        const files = paths.filter((path) => !directories.includes(path));

            for (const file of files) {
                try {
                    await fs.unlink(file);
                } catch (error) {
                    log(`Error removing file: ${file} - ${error}`, 'warn');
                }
            }

            for (const directory of directories) {
                try {
                    await fs.rmdir(directory);
                } catch (error) {
                    log(`Error removing directory: ${directory} - ${error}`, 'warn');
                }
            }
        



    });




};

export { removeFiles };