import inlineCss from 'inline-css';
import { basename, join } from 'path';
import { readFromFile } from '../functions/fileUtils.js';
import { task } from '../functions/task.js';

class CssInline {
    constructor(context, services) {
        this.inlineCss = inlineCss;
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;

        this.srcGlob = this.buildDir + '/*.html';

        this.port = services.express.port ?? 3030;

        this.inlineOpts = {
            url: `http://localhost:${this.port}`,
            applyStyleTags: false,
            removeStyleTags: false,
            applyLinkTags: true,
        }

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }

    embedCSS(htmlContent) {
        const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']((?!http:\/\/|https:\/\/)[^"']+)["'][^>]*data-embed[^>]*>/gi;
        let match;
        while ((match = linkRegex.exec(htmlContent)) !== null) {
            const href = match[1];
            const cssFilePath = join(this.buildDir, href);
            const cssContent = readFromFile(cssFilePath);
            const styleTag = `<style>\n${cssContent}\n</style>`;
            htmlContent = htmlContent.replace(match[0], styleTag);
        }
        return htmlContent;
    }

    async render() {
        await task('Inline CSS', async (utils) => {
            let { getFiles, readFromFile, writeFile } = utils;

            let files = await getFiles(this.srcGlob);

            for await (const file of files) {
                let fileString = await readFromFile(file);
                let fileName = basename(file);

                //embed css in link tags with data-embed attribute
                fileString = this.embedCSS(fileString);

                //inline remaining link tags
                await this.inlineCss(fileString, this.inlineOpts).then((html) => {fileString = html});

                await writeFile(this.buildDir, fileName, fileString);
            };
        });
    }
}

export default CssInline;