const fs = require('fs');

console.log(process.platform);
console.log(process.env);

console.log(installDir());
console.log(fs.statSync(installDir()));

function installDir() {
    if (process.platform.toLowerCase().startsWith('win')) {
        return process.env.APPDATA + '\\Adobe\\CEP\\extensions';
    } else {
        return process.env.HOME + '/Library/Application Support/Adobe/CEP/extensions';
    }
}