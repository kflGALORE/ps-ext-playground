export function doMe(): string {
    return 'OK';
}

export function sayHello(greeting: Greeting): string {
    alert('Hello ' + greeting.to + ' from ' + greeting.from);
    return JSON.stringify(greeting);
}

function privateFunction() {}

interface Greeting {
    to: string;
    from: string;
}