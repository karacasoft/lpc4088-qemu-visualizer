const exec = require('child_process').exec;

exec("npm run start");
const wfr = exec("node ./wait-for-react.js");
wfr.stdout.on('data', (data) => {
    console.log(data.toString());
});

wfr.stderr.on('data', (data) => {
    console.log(data.toString());
});