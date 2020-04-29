function doMe(): string {
    return 'OK';
}
// @ts-ignore
$._script.doMe = doMe;

function sayHello(greeting: Greeting): string {
    alert('Hello ' + greeting.to + ' from ' + greeting.from);
    return 'OK';
}
// @ts-ignore
$._script.sayHello = sayHello;

interface Greeting {
    to: string;
    from: string;
}