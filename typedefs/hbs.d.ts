declare module '*.hbs' {
    const content: (...args: any[]) => string;
    export = content;
}