
import fs from 'fs';
import { basename } from 'path';
import { task } from '../functions/task.js';

class vanillaCss {
    constructor(context) {
        //directories
        this.buildDir = context.dir.dest + '/css';
        this.sourceDir = context.dir.src;

        this.srcGlob = this.sourceDir + '/css/!(_*).css';

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render };
    }

    async render() {

        await task('CSS Passthrough', async (utils) => {

            //make dir if it doesn't exist
            if (!fs.existsSync(this.buildDir)) {
                fs.mkdirSync(this.buildDir);
            }

            let { getFiles, readFromFile, writeFile } = utils;

            let files = await getFiles(this.srcGlob);

            for await (const file of files) {

                let fileName = basename(file);

                let fileString = await readFromFile(file);

                await writeFile(this.buildDir, fileName, fileString);
            };

        });
    }
}

export default vanillaCss;