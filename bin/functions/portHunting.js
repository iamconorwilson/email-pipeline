import net from 'net';

const isPortAvailable = async (port) => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                reject(err);
            }
        });
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port);
    }
    );
}

const checkPort = async (port) => {
    const portAvailable = await isPortAvailable(port);
    if (portAvailable) {
        return port;
    } else {
        return checkPort(port + 1);
    }
}

export { isPortAvailable, checkPort };