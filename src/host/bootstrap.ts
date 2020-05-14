var global = $;

class Logger {

    info(msg: string): void {
        this.log('INFO', msg);
    }

    error(msg: string, error: Error): void {
        this.log('ERROR', msg, error);
    }

    private log(level: string, msg: string, error?: Error): void {
        try {
            // @ts-ignore
            const logFile = new File(Folder.temp + '/' + new File($.fileName).parent.parent.name + '.log');
            logFile.open("a");
            logFile.writeln('[' + this.date() + '] [' + level + '] ' + msg);
            if (error) {
                // @ts-ignore
                const errorDescription = '  [' + error.fileName + ':' + error.line + '] ' + error.message;
                logFile.writeln(errorDescription);

                let errorStack = undefined;
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
    }

    private date(): string {
        const date = new Date();

        return date.getFullYear() +
            '-' + this.pad(date.getMonth() + 1) +
            '-' + this.pad(date.getDate()) +
            'T' + this.pad(date.getHours()) +
            ':' + this.pad(date.getMinutes()) +
            ':' + this.pad(date.getSeconds()) +
            '.' + date.getMilliseconds();
    }

    private pad(num: number): string {
        if (num < 10) {
            return '0' + num;
        }
        return '' + num;
    }
}


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


