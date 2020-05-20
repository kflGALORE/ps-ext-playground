const root = './';

const env = require('../build');
const fse = require('fs-extra');

fse.copySync(env.dist(root), emptyInstallDir());

function emptyInstallDir() {
    let extensionsDir;
    if (process.platform.toLowerCase().startsWith('win')) {
        extensionsDir = process.env.APPDATA + '\\Adobe\\CEP\\extensions\\';
    } else {
        extensionsDir = process.env.HOME + '/Library/Application Support/Adobe/CEP/extensions/';
    }
    const installDir = extensionsDir + env.config.id;

    fse.emptyDirSync(installDir);

    return installDir;
}