if (location && location.search && location.search.includes('mode=')) {
    // From here on we assume that
    // * we are not running inside of Photoshop
    // * AND we are running in a decent browser that supports parsing location URLs (sorry Internet Explorer)
    const searchParams = new URL(location.toString()).searchParams;
    if (searchParams.get('mode') == 'development') {
        const cepAdapter: any = {};
        cepAdapter.getHostEnvironment = function() {
            return '{}';
        };
        cepAdapter.evalScript = function(script: string, callback?: Function) {
            console.log('evalScript [script:' + script + ']');
            if (callback) {
                callback('EvalScript error.');
            }
        };

        // @ts-ignore
        window.__adobe_cep__ = cepAdapter;
    }
}

import {CSInterface, SystemPath} from '../../local_modules/csinterface'
import {bootstrap} from "./csinterface-adapter";
import {Panel} from "./panel";


class App {
    constructor() {
        /*
        CSInterfaceAdapter.bootstrap().then(...)
         */
        bootstrap();


       const csInterface = new CSInterface();

        // @ts-ignore
        const masterScript = csInterface.getSystemPath('extension') + '/host/master.jsx';


        csInterface.evalScript('$.evalFile("' + masterScript + '")', result => {
        });

        // @ts-ignore
        window.csInterface = csInterface;

        // @ts-ignore
        window.scriptProxy = new Proxy({}, {
            get: (target, scriptName) => {
                return (...args: any[]) => {
                    return new Promise((resolve, reject) => {
                        try {
                            const scriptArgs = args.map(arg => {
                                if (typeof arg == 'string') {
                                    return '"' + arg + '"';
                                }
                                if (typeof arg === 'object') {
                                    return JSON.stringify(arg);
                                }
                                if (arg === 666) {
                                    throw new Error('XXX');
                                }
                                return arg;
                            }).join(',');

                            const scriptCall = `$._script.${scriptName.toString()}(${scriptArgs})`;

                            csInterface.evalScript(scriptCall, result => {
                                if (! result) {
                                    resolve(null);
                                } else if ( result.startsWith('EvalScript error.')) {
                                    reject(new Error(result));
                                } else {
                                    if (this.isJSON(result)) {
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

        const panelRootElement = document.getElementById('panel-root');
        if (! panelRootElement) {
            console.error('panel-root element could not be found');
        } else {
            new Panel(panelRootElement);
        }
    }

    private isJSON(str: string): boolean {
        let parsedStr;
        try {
            parsedStr = JSON.parse(str);
        } catch (e) {
            return false;
        }

        return typeof parsedStr === 'object';
    }
}

// Register startup hook
(() => {
    function startApp() {
        new App();
    }

    try {
        window.onload = startApp;
    } catch (error) {
        console.error('app could not be started', error);
    }
})();