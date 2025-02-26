import { existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname, basename } from 'path';
import { log } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const state = [];

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
    const services = readdirSync(join(__dirname, '../services'));
    for (const service of services) {
        await getService(service, options, 'services');
    }

    // import all renderers
    const renderers = readdirSync(join(__dirname, '../renderers'));
    for (const renderer of renderers) {
        await getService(renderer, options, 'renderers');
    }


    // set html renderer based on config, else use nunjucks as default
    if (options.htmlRenderer && state[options.htmlRenderer]) {
        state.htmlRenderer = state[options.htmlRenderer];
    } else {
        log('No HTML renderer selected', 'warn');
        state.htmlRenderer = state.vanillaHtml;
    }

    // set css renderer based on config, else use vanillaCss as default
    if (options.cssRenderer && state[options.cssRenderer]) {
        state.cssRenderer = state[options.cssRenderer];
    } else {
        log('No CSS renderer selected', 'warn');
        state.cssRenderer = state.vanillaCss;
    }

    return state;
}

const getService = async (file, options, rootDir) => {

    if (!file.endsWith('.js')) return;
    const fileName = file.replace('.js', '');
    const { default: Service } = await import(join(__dirname, `../${rootDir}/${file}`));
    const instance = new Service(options, state);
    if (instance.init) {
        let func = await instance.init();
        state[fileName] = func;
    } else {
        state[fileName] = instance;
    }
}

export { init };