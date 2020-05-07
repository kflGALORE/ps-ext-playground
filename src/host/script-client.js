const fs = require('fs');
const $ = {};

evalScript();
console.log($);

function evalScript() {
    eval(fs.readFileSync('../../dist/host/script.bundle.js').toString());

    $._script = {};


    /*
    Object.getOwnPropertyNames(script).forEach(propertyName => {
        var property = script[propertyName];
        if (typeof property === 'function') {
            $._script[propertyName] = property;
        }
    });

     */

    var scriptPropertyNames = Object.getOwnPropertyNames(script);
    for (var i = 0; i < scriptPropertyNames.length; i++) {
        var scriptPropertyName = scriptPropertyNames[i];
        var scriptProperty = script[scriptPropertyName];
        if (typeof scriptProperty === 'function') {
            $._script[scriptPropertyName] = scriptProperty;
        }
    }
}