import chalk from 'chalk';
import ora from 'ora';

const colors = {
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.blue,
    success: chalk.green,
};

let spinner;
let previousSpinner = false;
let debug = process.argv.includes('--debug');

const log = (message, type) => {
    if (previousSpinner) {
        spinner.stop(); // Stop the spinner before logging
        previousSpinner = false;
    }

    if (type && type in colors) {
        console.log(`[${chalk.magentaBright('email-pipeline')}] ${colors[type](type.toUpperCase())}: ${message}`);
    } else {
        console.log(`[${chalk.magentaBright('email-pipeline')}] ${message}`);
    }

    if (spinner) {
        spinner.start(); // Restart the spinner if it was previously running
        previousSpinner = true;
    }
};

const start = (message) => {
    if (previousSpinner && !debug) {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine();
    }

    const text = `[${chalk.magentaBright('email-pipeline')}] ${message}`;


    spinner = ora({
        text: text,
        spinner: 'dots'
    }).start();

    previousSpinner = true;
}

const update = (message) => {
    spinner.text = `[${chalk.magentaBright('email-pipeline')}] ${message}`;
    previousSpinner = true;
}

const complete = (message) => {
    spinner.succeed(`[${chalk.magentaBright('email-pipeline')}] ${message}`);
    previousSpinner = true;
}

const error = (message) => {
    spinner.fail(`[${chalk.magentaBright('email-pipeline')}] ${message}`);
    previousSpinner = true;
}

const processLog = {
    start,
    complete,
    error,
    update
}

export { log, processLog };