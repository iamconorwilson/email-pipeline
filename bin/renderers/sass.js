import * as sass from 'sass';
import { basename } from 'path';

import { task } from '../functions/task.js';
import { getSassData } from '../plugins/sass/getSassData.js';

class Sass {
    constructor(context) {
        this.sass = sass;
        this.buildDir = context.dir.dest;
        this.dataDir = context.dir.data;
        this.sourceDir = context.dir.src;

        this.sassOpts = context.sass?.customOpts;

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }
    async render() {
        await task('Sass Render', async (utils) => {
            let { getFiles, readFromFile, writeFile } = utils;
            
            let files = await getFiles(this.sourceDir + '/sass/!(_*).scss');

            if (!files.length) { 
                throw new Error('Sass Render: No files found in source directory');
            }
            
            for (const file of files) {
                let outputStyle = 'compressed';
                let fileName = basename(file, '.scss') + '.css';

                const fileString = await readFromFile(file);

                const opts = this.sassOpts ?? { style: outputStyle, importers: [ new getSassData({ dataDir: this.dataDir }) ] };
        
                let string;

                try {
                    string = this.sass.compileString(fileString, opts).css;
                } catch (error) {
                    throw new Error(`Sass Render: ${error}`);
                }

                await writeFile(this.buildDir + '/css', fileName, string);
            }
        });
    }
}

export default Sass;