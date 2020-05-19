export function doMe(): string {
    return 'OK';
}

export function sayHello(greeting: Greeting): Greeting {
    return greeting;
}

interface Greeting {
    to: string;
    from: string;
}