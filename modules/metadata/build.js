const metadata = 'metadata';
const csxs = 'CSXS';
const ext = require('../../ps-ext');

ext.handlebars.renderTemplate(ext.src(metadata, 'manifest.xml.hbs'), ext.dist(csxs, 'manifest.xml'));
ext.handlebars.renderTemplate(ext.src(metadata, '.debug.hbs'), ext.distRoot('.debug'));