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
import {Panel} from "./panel";

class App {
    constructor() {
       const csInterface = new CSInterface();

        // @ts-ignore
        const masterScript = csInterface.getSystemPath('extension') + '/host/master.jsx';

        // @ts-ignore
        csInterface.evalScript('$.evalFile("' + masterScript + '")', result => {
        });


        // @ts-ignore
        window.csInterface = csInterface;


        const panelRootElement = document.getElementById('panel-root');
        if (! panelRootElement) {
            console.error('panel-root element could not be found');
        } else {
            new Panel(panelRootElement);
        }
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