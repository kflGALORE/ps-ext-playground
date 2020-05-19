try {
    const path = require('path');
    const fs = require('fs');
    const handlebars = require('handlebars');

    const psExtensionConfig = require('../../ps-ext.config.js');

    const distDir = path.resolve(__dirname, '../../dist2');
    const moduleDir = path.resolve(__dirname, '.');

    render(template('src/manifest.xml.hbs'), path.resolve(distDir, 'CSXS/manifest.xml'));
    render(template('src/.debug.hbs'), path.resolve(distDir, '.debug'));

    function render(template, targetFile) {
        const targetDir = path.dirname(targetFile);
        if (! fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, {recursive: true});
        }

        fs.writeFileSync(targetFile, template(psExtensionConfig));
    }

    function template(file) {
        return handlebars.compile(fs.readFileSync(path.resolve(moduleDir, file)).toString());
    }

} catch (e) {
    console.error(e.message);
    process.exit(1);
}