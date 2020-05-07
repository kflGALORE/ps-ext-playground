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
                /*
                    [window.]host.script.sayHello({....}).then(...).catch(...)
                    host vs cs vs csi vs panel vs pse vs psext vs extension
                 */

                // @ts-ignore
                window.scriptProxy.sayHello({to: "World", from: "ps-ext-ref"})
                    // @ts-ignore
                    .then(greeting => {
                        alert('result: from=' + greeting.from + ' to=' + greeting.to);
                    })
                    // @ts-ignore
                    .catch(e => {
                        alert('ERROR: ' + e);
                    });
            };
        } catch (error) {
            console.log('ERROR:' + error);
            alert('' + error);
        }
    }
}