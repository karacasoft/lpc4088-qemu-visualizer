const exec = require('child_process').exec;

exec("npm run start");
console.log("wow");
exec("node ./wait-for-react.js");