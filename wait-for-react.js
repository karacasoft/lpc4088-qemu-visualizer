const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;

const tryConnection = () => client.connect({ port: port }, () => {
    client.end();

    if(!startedElectron) {
        console.log("Starting electron");
        startedElectron = true;
        const exec = require('child_process').exec;
        const el = exec('npm run electron');
        el.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        el.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    }
});

tryConnection();

client.on('error', (err) => {
    setTimeout(tryConnection, 2000);
});