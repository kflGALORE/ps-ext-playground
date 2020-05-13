var global = $;

function Logger() {}

Logger.prototype.date = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var hours = date.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    var millis = date.getMilliseconds();
    return '[' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + millis + ']';
};

Logger.prototype.level = function(level) {
    return '[' + level.toUpperCase() + ']';
}

Logger.prototype.log = function (level, msg, error) {
    try {
        var logFile = new File(Folder.temp + '/' + new File($.fileName).parent.parent.name + '.log');
        logFile.open("a");
        logFile.writeln(this.date() + ' ' + this.level(level) + ' ' + msg);
        if (error) {
            var errorDescription = '  [' + error.fileName + ':' + error.line + '] ' + error.message;
            logFile.writeln(errorDescription);

            var errorStack = undefined;
            if (error.stack) {
                errorStack = error.stack;
            } else {
                errorStack = $.stack;
            }
            if (errorStack) {
                logFile.writeln('  Stack:');
                logFile.writeln(errorStack.replace(/^(.*)/gm, '    $1'));
            }
        }
        logFile.close();
    } catch (e) {
        alert('Could not write to log file: ' + e);
    }
};

Logger.prototype.info = function(msg) {
    this.log('INFO', msg);
};

Logger.prototype.error = function(msg, error) {
    this.log('ERROR', msg, error);
};

(function() {
    var baseDir = new File($.fileName).parent;
    var self = new File(baseDir.fullName + '/bootstrap.js');
    if (self.exists) {
        $._log = new Logger();

        // Load polyfills
        // ... for some reason I don't (yet) understand, the loading of polyfills cannot be extracted to a function
        try {
            var polyfills = new File(baseDir.fullName + '/polyfills.js');
            $.evalFile(polyfills.fullName);
        } catch (error) {
            $._log.error('Polyfills could not be loaded', error);
            throw error;
        }

        evalScriptBundle(baseDir);
    }

    function evalScriptBundle(baseDir) {
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
            $._log.error('Script bundle could not be evaluated', error);
            throw error;
        }
    }
})();


