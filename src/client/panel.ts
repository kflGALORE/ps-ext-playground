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
                try {
                    // @ts-ignore
                    window.csInterface.evalScript('$._script.sayHello(' + JSON.stringify({to: "World", from: "ps-ext-ref"}) + ')', (result) => {
                        if (result) {
                            if ( result.startsWith('EvalScript error.')) {
                                // Error case ...
                                alert('ERROR: ' + result);
                            } else {
                                if (this.isJSON(result)) {
                                    const greeting = JSON.parse(result);
                                    alert('result: from=' + greeting.from + ' to=' + greeting.to);
                                } else {
                                    alert('result: ' + result);
                                }
                            }
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