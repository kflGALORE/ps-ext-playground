var global = $;

import {Logger} from './logger';

(function() {
    // @ts-ignore
    var baseDir = new File($.fileName).parent;
    // @ts-ignore
    var self = new File(baseDir.fullName + '/bootstrap.js');
    if (self.exists) {
        $._log = new Logger();

        // Load polyfills
        // ... for some reason I don't (yet) understand, the loading of polyfills cannot be extracted to a function
        try {
            // @ts-ignore
            var polyfills = new File(baseDir.fullName + '/polyfills.js');
            $.evalFile(polyfills.fullName);
        } catch (error) {
            $._log.error('Polyfills could not be loaded', error);
            throw error;
        }

        evalScriptBundle(baseDir);
    }

    function evalScriptBundle(baseDir: string) {
        // @ts-ignore
        //const logFile = new File(Folder.temp + '/' + new File($.fileName).parent.parent.name + '.log');
        //alert('logFile: ' + logFile.fullName);
        //alert('userData: ' + Folder.userData); ->  ~/Library/Application\ Support/
        try {
            // @ts-ignore
            var scriptBundle = new File(baseDir.fullName + '/script.bundle.js');
            $.evalFile(scriptBundle.fullName);

            $._script = {};

            Object.getOwnPropertyNames(script).forEach(function(scriptPropertyName) {
                var scriptProperty = script[scriptPropertyName];
                if (typeof scriptProperty === 'function') {
                    $._script[scriptPropertyName] = function() {
                        try {
                            var result = scriptProperty.apply(null, arguments);
                            if (typeof result === 'object') {
                                return JSON.stringify(result);
                            }
                            return result;
                        } catch (error) {
                            error.fileName = scriptBundle.fullName;
                            $._log.error(scriptPropertyName + 'could not be executed', error);
                            throw error;
                        }
                    };
                }
            });
        } catch (error) {
            $._log.error('Script bundle could not be evaluated', error);
            throw error;
        }
    }
})();


