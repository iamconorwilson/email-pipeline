import { existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname, basename } from 'path';
import { log } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const services = [];

const init = async (options) => {

    //if data directory is not set, set it to the default
    if (!options.dir.data) {
        options.dir.data = join(options.dir.src, 'data');
    }

    //check if build directory exists, if not, create it
    if (!existsSync(options.dir.dest)) {
        mkdirSync(options.dir.dest);
    }

    //check if css directory exists, if not, create it
    if (!existsSync(join(options.dir.dest, 'css'))) {
        mkdirSync(join(options.dir.dest, 'css')); 
    }

    // set environment based on --env flag
    options.env = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'prod';
    log(`Environment set to '${options.env}'`, 'info');

    // import all services
    const files = readdirSync(join( __dirname, '../services'));
    for await (const file of files) {
        if (file.endsWith('.js')) {
            const fileName = basename(file, '.js');
            const { default: Service } = await import(join(__dirname, `../services/${file}`));
            const instance = new Service(options, services);
            if (instance.init) {
                let func = await instance.init();
                services[fileName] = func;
            }
        }
    }

    // set html renderer based on config, else use nunjucks as default
    if (options.htmlRenderer && services[options.htmlRenderer]) {
        services.htmlRenderer = services[options.htmlRenderer]; 
    } else {
        log('No html renderer found, using nunjucks as default', 'warn');
        services.htmlRenderer = services.nunjucks;
    }

    return services;
}

export { init };