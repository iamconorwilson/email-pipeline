import chalk from 'chalk';
import ora from 'ora';

const colors = {
    error: {
        color: chalk.red,
        message: 'ERROR'
    },
    warn: {
        color: chalk.yellow,
        message: 'WARN'
    },
    info: {
        color: chalk.blue,
        message: 'INFO'
    },
    success: {
        color: chalk.green,
        message: 'SUCCESS'
    },
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
        const msgType = colors[type];
        console.log(`[${chalk.magentaBright('email-pipeline')}] ${msgType.color(msgType.message)}: ${message}`);
    } else {
        console.log(`[${chalk.magentaBright('email-pipeline')}] ${message}`);
    }

    if (spinner) {
        spinner.start(); // Restart the spinner if it was previously running
        previousSpinner = true;
    }
};

const processLog = {
    start: (message) => {
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
    },
    update: (message) => {
        if (!spinner) return console.log(message);
        spinner.text = `[${chalk.magentaBright('email-pipeline')}] ${message}`;
        previousSpinner = true;
    },
    complete: (message) => {
        if (!spinner) return console.log(message);
        spinner.succeed(`[${chalk.magentaBright('email-pipeline')}] ${message}`);
        previousSpinner = true;
    },
    error: (message) => {
        if (!spinner) return console.error(message);
        let msgType = colors['error'];
        spinner.fail(`[${chalk.magentaBright('email-pipeline')}] ${msgType.color(msgType.message)}: ${message}`);
        previousSpinner = true;
    }
}

export { log, processLog };