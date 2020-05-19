
module.exports = {
        "include": ['es5'],
        "exclude": []
};
/* Notes:
    - For available polyfills, see: https://polyfill.io/v3/url-builder/
    - Do NOT use the JSON polyfill, since it broken.
        - Thereby, "broken" does not really mean it is broken, but the shitty ExtendScript engine cannot evaluate that polyfill.
        - Instead, a working JSON polyfill will be applied automatically.
*/