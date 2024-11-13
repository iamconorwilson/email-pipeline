
import { basename } from 'path';
import { task } from '../functions/task.js';

class vanillaHtml {
    constructor(context) {
        //directories
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;

        this.srcGlob = this.sourceDir + '/!(_*).html';

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render };
    }

    async render() {

        await task('HTML Passthrough', async (utils) => {

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

export default vanillaHtml;