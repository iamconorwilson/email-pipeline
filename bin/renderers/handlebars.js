import handlebars from 'handlebars';
import { join, basename } from 'path';

import { getData, getPartials, getHelpers } from '../functions/getData.js';
import { task } from '../functions/task.js';

class Handlebars {
    constructor(context) {
        this.handlebars = handlebars;
        //directories
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.dataDir = context.dir.data || join(this.sourceDir, 'data');

        this.srcGlob = this.sourceDir + '/!(_*).hbs';

        //environment
        this.partialsDir = context.handlebars?.partialsDir || join(this.sourceDir, 'partials');
        this.helpersDir = context.handlebars?.helpersDir || join(this.sourceDir, 'helpers');

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render };
    }

    async render() {
        
            await task('Handlebars Render', async (utils) => {
                
                let { getFiles, readFromFile, writeFile } = utils;

                let files = await getFiles(this.srcGlob);

                if (!files.length) {
                    throw new Error('Handlebars Render: No files found in source directory');
                }

                let data = getData(this.dataDir);
                let partials = getPartials(this.partialsDir);
                let helpers = getHelpers(this.helpersDir);
                
                for await (const file of files) {
                    
                    let fileName = basename(file, '.hbs') + '.html';
                    
                    let fileString = await readFromFile(file);

                    let template = this.handlebars.compile(fileString);

                    let string = template(data, {partials, helpers});

                    await writeFile(this.buildDir, fileName, string);
                    
                };
                
            });
    }
}

export default Handlebars;