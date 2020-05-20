const root = './';
const env = require('../build');
const fse = require('fs-extra');

fse.emptyDirSync(env.dist(root));