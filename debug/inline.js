import { join } from 'path';
import { pathToFileURL } from 'url';
import { readFromFile } from '../bin/functions/fileUtils.js';
import inlineCss from 'inline-css';

import { promisify } from 'util';

const sourceDir = './test/dist/';

const sourcePath = pathToFileURL(sourceDir);

const inlineOpts =  {
    url: sourcePath.href,
    applyStyleTags: false,
    removeStyleTags: false,
    applyLinkTags: true,
}



const inlineCSS = async (htmlContent) => {

    // Embed CSS in link tags with data-embed attribute
    const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']((?!http:\/\/|https:\/\/)[^"']+)["'][^>]*data-embed[^>]*>/gi;
    let match;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
        const href = match[1];
        const cssFilePath = join(sourceDir, href);
        const cssContent = readFromFile(cssFilePath);
        const styleTag = `<style>\n${cssContent}\n</style>`;
        htmlContent = htmlContent.replace(match[0], styleTag);
    }

    let string = '';
    await inlineCss(htmlContent, inlineOpts).then((html) => {string = html});

    return string;
}

const content = `

<link rel="stylesheet" href="css/test.css" data-embed>

<link rel="stylesheet" href="css/test.css">

<h1>Test</h1>

`

console.log(await inlineCSS(content));