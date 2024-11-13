
import fs from 'fs';

import { log, processLog } from './logger.js';


const displayError = (name, error, filePath) => {
    let l;
    let c;
    let message;

    let localPath = filePath.replace(process.cwd(), '');

    if (name !== 'sassRender' && name !== 'nunjucksRender'){
        log(`Error rendering ${localPath} - ${error}`, 'error') 
        return;
    } 
    
    if (name === 'sassRender') {
        l = error.span.start.line;
        c = error.span.start.column;
        message = error.sassMessage;
    }

    if (name === 'nunjucksRender') {
        let njkMsg = error.message;
        let lineMatch = njkMsg.match(/Line (\d+)/);
        l = lineMatch[1] - 2;
        let columnMatch = njkMsg.match(/Column (\d+)/);
        c = columnMatch[1];
        //get message from end of string and capitalize first letter
        message = njkMsg.substring(njkMsg.lastIndexOf(']') + 4)
        message = message.charAt(0).toUpperCase() + message.slice(1);
    }

    //get the line from the file
    let file = fs.readFileSync(filePath, 'utf-8');
    let lines = file.split('\n');
    let errorLine = lines[l-1].replace(/(\r\n|\n|\r)/gm, '').replace(/\s\s+/g, ' ');

    // 

    processLog.error(`Error rendering ${localPath}`, 'error');
    console.error(`Line: ${l}, Column: ${c} | ${errorLine}`);
    console.error(message);

    process.exit(1);
}

export { displayError };