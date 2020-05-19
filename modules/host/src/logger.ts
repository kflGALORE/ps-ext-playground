export class Logger {

    info(msg: string): void {
        this.log('INFO', msg);
    }

    error(msg: string, error: Error): void {
        this.log('ERROR', msg, error);
    }

    log(level: string, msg: string, error?: Error): void {
        try {
            // @ts-ignore
            const logFile = new File(Folder.temp + '/' + new File($.fileName).parent.parent.name + '.log');
            logFile.open("a");
            logFile.writeln('[' + date() + '] [' + level + '] ' + msg);
            if (error) {
                // @ts-ignore
                const errorDescription = '  [' + error.fileName + ':' + error.line + '] ' + error.message;
                logFile.writeln(errorDescription);

                let errorStack;
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
}

function date(): string {
    const date = new Date();

    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.' + date.getMilliseconds();
}

function pad(num: number): string {
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
}