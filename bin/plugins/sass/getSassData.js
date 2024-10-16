import path from "path";
import fs from "fs";

const parseJsonToSass = (data, parentKey = '') => {
    let sassVars = '';
    for (const key in data) {
        if (typeof data[key] === 'object') {
            parseJson(data[key], `${parentKey}${key}-`);
        } else {
            //if data[key] contains a colon, wrap it in quotes
            if (data[key].includes(':')) {
                data[key] = `"${data[key]}"`;
            }
            sassVars += `$${parentKey}${key}: ${data[key]};\n`;
        }
    }
    return sassVars;
}

class getSassData {
    constructor(options) {
        this.canonicalize = this.canonicalize.bind(this);
        this.load = this.load.bind(this);

        this.dataDir = (options && options.dataDir) ? options.dataDir : '';

    }
    canonicalize(url) {
        if (!url.endsWith('.json')) return null;

        if (url.startsWith('https//') || url.startsWith('http://')) {
            return null
        }

        const dataDir = (url.startsWith('./')) ? '' : this.dataDir;

        const filePath = path.resolve(dataDir, url);

        if (!fs.existsSync(filePath)) return null;

        return new URL(`file://${filePath}`);

    }
    load(canonicalUrl) {

        let jsonString = fs.readFileSync(canonicalUrl, 'utf-8');

        // read the contents of the JSON file
        const jsonData = JSON.parse(jsonString);

        // convert the JSON data to SASS variables
        let sassVars = parseJsonToSass(jsonData);

        return {
            contents: sassVars,
            syntax: 'scss'
        }
    }
}


export { getSassData };