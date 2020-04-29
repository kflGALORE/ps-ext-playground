import './panel.scss'
import * as panel from './panel.hbs'

export class Panel {
    public constructor(public rootElement: HTMLElement) {
        // Setup state
        const panelInfo = [];
        panelInfo.push({key:'userAgent', value:navigator.userAgent});
        panelInfo.push({key:'location', value:location});

        const data = {
            panelInfo: panelInfo
        };

        // Render
        rootElement.innerHTML = panel(data);

        // Initialize UI elements
        // psePanel.button('').within(rootElement).onClick = ...
        try {
            (rootElement.querySelector('button.run-script') as HTMLButtonElement).onclick = (event) => {
                console.log('Button clicked:' + event);
                console.log('...2');
                try {
                    // @ts-ignore
                    window.csInterface.evalScript('$._script.sayHello(' + JSON.stringify({to: "World", from: "ps-ext-ref"}) + ')', (result) => {
                        console.log('result:' + result);
                        alert('' + result);
                        if (result && result.startsWith('EvalScript error.')) {
                            // @ts-ignore
                            window.csInterface.evalScript('$.error', (result2) => {
                                console.log('result2:' + result2);
                                alert('' + result2);
                            });

                        }
                    });
                } catch (error) {
                    console.log('evalScript failed:' + error);
                    alert('' + error);
                }
            };
        } catch (error) {
            console.log('ERROR:' + error);
            alert('' + error);
        }
    }
}