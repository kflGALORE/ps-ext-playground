var global = $;

(function() {
    var baseDir = new File($.fileName).parent;
    var self = new File(baseDir.fullName + '/bootstrap.js');
    if (self.exists) {
        try {
            var polyfills = new File(baseDir.fullName + '/polyfills.js');
            $.evalFile(polyfills.fullName);
        } catch (error) {
            try {
                var logFile = new File(baseDir.fullName + '/log.txt');
                logFile.open("w");
                logFile.writeln('ERROR [polyfills]:' + error);
                logFile.close();
            } catch (lfe) {
                alert('ERROR writing log file [polyfills]:' + lfe);
            }
            alert('ERROR [polyfills]:' + getTypeOf(error) + ' ' + error + '\n' + error.stack);
        }

        try {
            var scriptBundle = new File(baseDir.fullName + '/script.bundle.js');
            $.evalFile(scriptBundle.fullName);

            $._script = {};

            Object.getOwnPropertyNames(script).forEach(function(scriptPropertyName) {
                var scriptProperty = script[scriptPropertyName];
                if (typeof scriptProperty === 'function') {
                    $._script[scriptPropertyName] = function() {
                        var result = scriptProperty.apply(null, arguments);
                        if (typeof result === 'object') {
                            return JSON.stringify(result);
                        }
                        return result;
                    };
                }
            });
        } catch (error) {
            var logFile = new File(baseDir.fullName + '/log.txt');
            logFile.open("w");
            logFile.writeln('ERROR [script.bundle]:' + JSON.stringify(error) + ': ' + error);
            logFile.close();
            alert('ERROR [script.bundle]:' + error);
        }
    }

    function getTypeOf(symbol) {
        if (typeof(symbol) === 'object') {
            return Object.prototype.toString.call(symbol);
        } else {
            return '[' + typeof(symbol) + ']';
        }
    }
})();
