const root = './';
const env = require('../build');

const rimraf = require('rimraf');

rimraf.sync(env.dist(root));