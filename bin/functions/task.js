import { resolve as _resolve } from 'path';
import * as utils from './fileUtils.js';
import { displayError } from '../functions/errors.js';
import { log, processLog } from '../functions/logger.js';


const task = async (name, func) => {
  const start = process.hrtime.bigint();

  processLog.update(`Running ${name}`);
  try {
    await func(utils);
    const end = process.hrtime.bigint();
    const time = Math.round(Number(end - start) / 1000000, 2);
    processLog.update(`Finished ${name} in ${time}ms`);

    if (process.argv.includes('--debug')) {
      log(`Finished ${name} in ${time}ms`, 'info');
    }
  } catch (e) {
    throw e; // Re-throw the error for higher-level error handling
  }
};



export { task };