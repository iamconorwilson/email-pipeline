#!/usr/bin/env node

import { log, processLog } from './functions/logger.js';
import { init } from './functions/init.js';
import { setOpts } from './functions/setOpts.js';
import { formatDate } from './functions/formatDate.js';
import debounce from 'debounce';

const debug = process.argv.includes('--debug');
if (debug) log('Debug mode enabled', 'info');

let options = await setOpts();

let state = await init(options);

let watch = state.watch;
let reload = state.express.livereload;

const run = async () => {

    processLog.start('Running build...');
    const startTime = new Date();


    try {

        await state.cssRenderer.render();

        await state.postcss.render();

        await state.passthrough.render();

        await state.htmlRenderer.render();

        await state.inlinecss.render();

        await state.cleanhtml.render();

        reload.refresh('*');

        const endTime = new Date();
        const duration = (endTime - startTime) / 1000;
        processLog.complete(`Build complete in ${duration.toFixed(2)}s at ${formatDate(endTime)}`);

    } catch (error) {
        processLog.error(`Build failed: ${error}`);
        process.exit(1);
    }

}

const debouncedRun = debounce(run, 500);
watch.on('add', debouncedRun).on('change', debouncedRun)

run();

