import {CSInterface, SystemPath} from '../../local_modules/csinterface'



export function bootstrap(): CSInterfaceAdapter {
    const csInterface = new CSInterface();
    const csInterfaceAdapter = new Proxy<any>(csInterface, {
        get: (target, prop) => {
            const propName = prop.toString();
            switch (propName) {
                case 'script':
                    return new Proxy({}, {
                        get: (target, scriptPropertyKey) => {
                            return (...args: any[]) => {
                                return new Promise((resolve, reject) => {
                                    try {
                                        csInterface.evalScript(scriptCall(scriptPropertyKey, args), result => {
                                            if (! result) {
                                                resolve(null);
                                            } else if ( result.startsWith('EvalScript error.')) {
                                                reject(new Error(result));
                                            } else {
                                                if (isJSON(result)) {
                                                    resolve(JSON.parse(result));
                                                } else {
                                                    resolve(result);
                                                }
                                            }
                                        });
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }
                        }
                    });
                default:
                    return target[propName];
            }
        }
    });

    return csInterfaceAdapter;
}

function scriptCall(scriptPropertyKey: PropertyKey, ...args: any[]): string {
    const scriptName = scriptPropertyKey.toString();

    const scriptArgs = args.map(arg => {
        if (typeof arg == 'string') {
            return '"' + arg + '"';
        }
        if (typeof arg === 'object') {
            return JSON.stringify(arg);
        }
        return arg;
    }).join(',');

    return `$._script.${scriptName.toString()}(${scriptArgs})`;
}

function isJSON(str: string): boolean {
    let parsedStr;
    try {
        parsedStr = JSON.parse(str);
    } catch (e) {
        return false;
    }

    return typeof parsedStr === 'object';
}

interface CSInterfaceAdapter extends CSInterface {

}