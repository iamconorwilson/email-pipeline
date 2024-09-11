import { mkdir, readFile, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { glob } from 'glob';
import { log } from './logger.js';

const getFiles = async (src) => {
    return await glob(src);
}

const readFromFile = (path) => {
    return readFileSync(path, 'utf-8');
}

const writeFile = (path, fileName, data) => {
    mkdir(path, { recursive: true }, (err) => {
        if (err) {
            log(err, 'error');
        }
    });

    writeFileSync(`${path}/${fileName}`, data);
}

const findCommonRoot = (paths) => {
    let common = dirname(paths[0]);

    paths.forEach((path) => {
        let current = dirname(path);

        while (!current.startsWith(common)) {
            common = dirname(common);
        }
    });

    return common;
}




export { getFiles, readFromFile, writeFile, findCommonRoot };