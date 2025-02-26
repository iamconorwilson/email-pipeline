import { Liquid as LiquidRender } from 'liquidjs';
import { join, basename } from 'path';
import { filters, tags } from '../plugins/liquid/index.js';
import { getData } from '../functions/getData.js';
import { task } from '../functions/task.js';

class Liquid {
  constructor(context) {
    this.LiquidRender = LiquidRender;
    //directories
    this.buildDir = context.dir.dest;
    this.sourceDir = context.dir.src;
    this.dataDir = context.dir.data || join(this.sourceDir, 'data');

    this.srcGlob = this.sourceDir + '/!(_*).liquid';

    //environment
    this.contentBlocksDir = context.liquid?.contentBlocksDir || join(this.sourceDir, 'contentBlocks');

    this.init = this.init.bind(this);
    this.render = this.render.bind(this);
  }

  init() {
    return { render: this.render };
  }

  async render() {

    await task('Liquid Render', async (utils) => {

      let { getFiles, readFromFile, writeFile } = utils;

      let files = await getFiles(this.srcGlob);

      if (!files.length) {
        throw new Error('Liquid Render: No files found in source directory');
      }

      let data = getData(this.dataDir);

      const engine = new LiquidRender({
        root: this.sourceDir,
        extname: '.liquid',
        globals: data
      });

      for (const [name, func] of Object.entries(filters)) {
        engine.registerFilter(name, func);
      }

      for (const [name, obj] of Object.entries(tags)) {
        engine.registerTag(name, obj);
      }


      for await (const file of files) {

        let fileName = basename(file, '.liquid') + '.html';

        let fileString = await readFromFile(file);

        let string = await engine.parseAndRender(fileString);

        await writeFile(this.buildDir, fileName, string);

      };

    });
  }
}

export default Liquid;