const myProxy = new Proxy({}, {
    get: function(target, scriptFunctionName) {
        return function(...args) {
            return new Promise((resolve, reject) => {
                try {
                    const scriptFunctionArgs = args.map(arg => {
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

                    const scriptCall = `$._script.${scriptFunctionName.toString()}(${scriptFunctionArgs})`;

                    resolve(scriptCall);
                } catch (e) {
                    reject(e);
                }
            });
        }
    }
});

myProxy.sayHello('dfgdf', {x: 'y'}, true, 777)
    .then(scriptCall => {
        console.log(scriptCall);
    })
    .catch(e => {
        console.error(e);
    });

