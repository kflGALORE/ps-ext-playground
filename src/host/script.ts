export function doMe(): string {
    return 'OK';
}

export function sayHello(greeting: Greeting): string {
    return JSON.stringify(greeting);
}

interface Greeting {
    to: string;
    from: string;
}