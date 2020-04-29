const path = require('path');
const fs = require('fs');

const project = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json')).toString());
const namespace = 'kflgalore.ps.ext';

module.exports = {
    namespace: namespace,
    id: namespace + '.' + project.name,
    name: 'Playground',
    version: project.version
};
