import { mkdir, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { globby } from 'globby';
import { log } from './logger.js';

const getFiles = async (src) => {
    return await globby(src);
}

const readFromFile = (path) => {
    return readFileSync(path, 'utf-8');
}

const writeFile = async (path, fileName, data) => {
    mkdir(path, { recursive: true }, (err) => { if (err) return log(err, 'error'); });
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