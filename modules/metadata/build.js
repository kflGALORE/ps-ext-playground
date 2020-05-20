const metadata = 'metadata';
const csxs = 'CSXS';
const root = './';
const env = require('../../build');

const path = require('path');
const handlebars = require('handlebars');
const chalk = require('chalk');

try {
    renderTemplate(env.src(metadata, 'manifest.xml.hbs'), env.dist(csxs, 'manifest.xml'));
    renderTemplate(env.src(metadata, '.debug.hbs'), env.dist(root, '.debug'));
} catch (e) {
    console.error(e.message);
    process.exit(1);
}

function renderTemplate(templateFile, targetFile) {
    const template = handlebars.compile(env.file.read(templateFile));
    env.file.write(targetFile, template(env.config));

    console.log(
        chalk.green(`${path.relative(env.dist(root), targetFile)} [rendered]`) +
        ` [from: ${path.basename(templateFile)}]`
    );
}