import express, { static as serveStatic } from 'express';
import serveIndex from 'serve-index';
import connectLiveReload from 'connect-livereload';
import ip from 'ip';
import chalk from 'chalk';
import { render } from 'serve-index-custom-directory'
import qrcode from 'qrcode-terminal';
import open from 'open';
import livereload from 'livereload';
const { address } = ip;

import { checkPort } from '../functions/portHunting.js';
import { log } from '../functions/logger.js';


class Express {
    constructor(context) {
        this.express = express;
        this.livereload = livereload;
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.port = context.server?.port ?? 3030;
        this.lrPort = 35729;
        this.qrcode = context.server?.qrCode ?? true;
        this.openBrowser = context.server?.openBrowser ?? false;
        this.customMiddleware = context.server?.middleware ?? [];

        this.init = this.init.bind(this);
    }

    async init() {

        const app = this.express();

        // LiveReload server
        this.lrPort = await checkPort(this.lrPort);

        const lrServer = this.livereload.createServer({port: this.lrPort});

        // Express server
        app.use(connectLiveReload({ port: this.lrPort }));
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
        
        this.port = await checkPort(this.port);

        app.listen(this.port, async () => {
            log(`Using available port ${this.port}`, 'info');
            await serverLog(this.port, this.qrcode, this.openBrowser);
        }).on('error', (err) => {
                log(err, 'error');
                process.exit(1);
        })

        app.port = this.port;

        return {app: app, livereload: lrServer};
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