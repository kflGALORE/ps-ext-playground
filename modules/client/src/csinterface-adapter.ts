import {CSInterface} from '../../../local_modules/csinterface'

var _csInterfaceAdapter: CSInterfaceAdapter;

export function csInterfaceAdapter(): CSInterfaceAdapter {
    if (! _csInterfaceAdapter) {
        _csInterfaceAdapter = createCSInterfaceAdapter();
    }

    return _csInterfaceAdapter;
}

function createCSInterfaceAdapter(): CSInterfaceAdapter {
    const csInterface = new CSInterface();
    return new Proxy<any>(csInterface, {
        get: (target, prop) => {
            const propName = prop.toString();
            switch (propName) {
                case 'bootstrap':
                    return createBootstrapFunction(csInterface);
                case 'script':
                    return createScriptProxy(csInterface);

                default:
                    return target[propName];
            }
        }
    });
}

function createBootstrapFunction(csInterface: CSInterface) {
    return () => {
        return new Promise((resolve, reject) => {
            try {
                const bootstrapScript = csInterface.getSystemPath('extension') + '/host/bootstrap.js';

                csInterface.evalScript('$.evalFile("' + bootstrapScript + '")', result => {
                    if (result && result.startsWith('EvalScript error.')) {
                        reject(new Error(result));
                    } else {
                        resolve(null);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}

function createScriptProxy(csInterface: CSInterface) {
    return new Proxy({}, {
        get: (target, scriptPropertyKey) => {
            return (...args: any[]) => {
                return new Promise((resolve, reject) => {
                    try {
                        csInterface.evalScript(scriptCall(scriptPropertyKey, ...args), result => {
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
    script: any;
    bootstrap(): Promise<null>;
}