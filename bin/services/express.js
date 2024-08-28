import express, { static as serveStatic } from 'express';
import serveIndex from 'serve-index';
import connectLiveReload from 'connect-livereload';
import ip from 'ip';
import chalk from 'chalk';
import { render } from 'serve-index-custom-directory'
import qrcode from 'qrcode-terminal';
import open from 'open';
const { address } = ip;


import { log } from '../functions/logger.js';

const app = express();

class Express {
    constructor(context) {
        this.express = express;
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.port = context.server?.port ?? 3030;
        this.qrcode = context.server?.qrCode ?? true;
        this.openBrowser = context.server?.openBrowser ?? false;
        this.customMiddleware = context.server?.middleware ?? [];

        this.portHunting = false;

        this.init = this.init.bind(this);
    }

    init() {
        app.use(connectLiveReload({ port: 35729 }));
        app.use(serveStatic(this.buildDir));
        const customRender = (locals, callback) => {
            const title = "Email Pipeline";
            render(locals, callback, title);
        }

        app.use(serveIndex(this.buildDir, { template: customRender, icons: true }));

        if (this.customMiddleware.length > 0) {
            this.customMiddleware.forEach((middleware) => {
                app.use(middleware);
            })
        }

        //if port in use, log to console and increment port number


        app.listen(this.port, async () => {
            if (this.portHunting) log(`Using available port ${this.port}`, 'info');
            await serverLog(this.port, this.qrcode, this.openBrowser);
            this.portHunting = false;
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                if (!this.portHunting) log(`Port ${this.port} is in use. Finding next available port...`, 'warn');
                this.port++;
                this.portHunting = true;
                this.init();
            } else {
                log(err, 'error');
                process.exit(1);
            }
        })

        app.port = this.port;

        return app;
    }
}


const serverLog = async (port, qr, openlocal) => {
    let local = `http://localhost:${port}`;
    let ext = `http://${address()}:${port}`;

    log(`${chalk.bold('Development server started')}`)

    console.log(
        `------------------------------------
${chalk.blue('Local')}: ${local}
${chalk.blue('Network')}: ${ext}
------------------------------------`
    )

    if (qr) {
        qrcode.generate(ext, { small: true }, (qrcode) => {
            console.log(qrcode);
        })
    }
    if (openlocal) {
        await open(local);
    }
}




export default Express;