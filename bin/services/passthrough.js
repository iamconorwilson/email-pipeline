import { basename, dirname } from 'path';
import { copyFile, mkdir } from 'fs';
import { task } from '../functions/task.js';

class Passthrough {
    constructor(context) {
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.passthrough = context?.passthrough || [];

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }

    async render() {


        if (this.passthrough.length === 0) {
            resolve();
            return;
        }

        for await (const passthrough of this.passthrough) {

            const { src, dest } = passthrough;

            await task(`Passthrough [${src}]`, async (utils) => {

                let files = await utils.getFiles(src);

                for await (const file of files) {

                    //create the destination directory if it doesn't exist
                    mkdir(dest, { recursive: true }, (err) => {
                        if (err) throw err;
                    });

                    copyFile(file, dest + "/" + basename(file), (err) => {
                        if (err) throw err;
                    });

                }
            });
        }

    }
}

export default Passthrough;