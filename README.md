# ps-ext-playground

Playground for testing out the development of [CEP](https://www.adobe.io/apis/creativecloud/cep.html) based Photoshop 
extension panels.

This project is not intended to produce usable code. Rather, it's purpose is just to test different approaches and to
gain information about how to best develop an extension panel. 

## Links

* [CEP Getting Started Guides](https://github.com/Adobe-CEP/Getting-Started-guides)
* [CEP Resources](https://github.com/Adobe-CEP/CEP-Resources)
* [CEP Samples](https://github.com/Adobe-CEP/Samples)
* [Photoshop Scripting](https://www.adobe.com/devnet/photoshop/scripting.html)
    * esp. "Photoshop CC JavaScript Reference"
* [Davide Barranca Blog](https://www.davidebarranca.com/)
    * must-read
    * search for "html panel"
* [ExtendScript Overview](https://estk.aenhancers.com/1%20-%20Introduction/extendscript-overview.html)
* [ScriptListener Plugin](https://helpx.adobe.com/de/photoshop/kb/downloadable-plugins-and-content.html#ScriptingListenerPlugIn)

## Directories

* Extension installation
    * Windows: `%APPDATA%/\Adobe\CEP\extensions`
    * MacOS: `~/Library/Application Support/Adobe/CEP/extensions`
* Log files
    * Windows: `%TEMP%`
    * MacOS: `/Users/<USERNAME>/Library/Logs/CSXS`
    * Files:
        * `CEP*-PHXS.log`
        * `CEPHtmlEngine*-PHXS-*-<panel-id>*.log`
        * other files are quite uninteresting
        
## Goals & Findings
* Automation
* Use Typescript
    * Client side:
        * seems to be unproblematic
        * configure TS compiler to compile down to either 'es3' or 'es5' in `tsconfig.json`
        * 'es3' should be the better choice, since we also want to compile-down host side
        * otherwise we had to use separate  `tsconfig.json` files, which makes the setup unnecessary complex
    * Host side:
        * configure TS compiler to compile down to 'es3' in `tsconfig.json`
        * this still does not make it - we have to include polyfills on the host side
        * we have to include a JSON ployfill, as well as 'es5' polyfill from https://polyfill.io/v3/url-builder/
        * JSON polyfill from https://polyfill.io/v3/url-builder/ does not work, we have to include json2 polyfill
        * polyfills must be loaded by a bootstrap script on the host side
        * host side scripts are bundled with Webpack as library named "script"
        * bootstrap script is responsible for reading / evaluating the bundled script library and for registering the 
          exported script functions / objects in a global object within the dollar ($) object 
* Run in local dev-server
* Pass objects between panel and host
    * Problem:
        * When using csInterface's `evalScript` function to invoke host scripts, we may only pass primitve data 
          types (i.e. `string`, `number`, `boolean`, etc.) but **not** complex objects
        * Therefore, we have to `JSON.stringify` the object on the client side and `JSON.parse` the string on the host 
          side
        * Unfortunately, on the host side there is no `JSON` available (because Adobe implemented their own JS engine 
          and never really updated it - so it is still based on some JS version published more than two decades ago)
        * Further, the result from a host side script may also only be a primitive
        * Therefore, we have to `JSON.stringify` the result object within the host side script function before returning
          it
        * Same problem: We don't have `JSON` available on the host side
    * Host side:
        * Provide a `JOSN` polyfill (see above, "Use Typescript > Host side")
        * We then can define a host script function taking an object as an argument - the stringified JSON object passed
          from the client side will be automatically parsed to the object
        * But we still have to explicitly `JSON.stringfy` the result object within the host side script function
    * Client side:
        * Seems unproblematic, we just have to `JSON.stringify` objects when using csInterface's `evalScript` function
        * The downside is that we have to do that every time a host script function requirs an object as parameter - 
          this is just tedious work - but that should be covered in "Natural script invocations"
        * Further, in case the called host side script function returns a stringified object, we have to `JSON.parse` 
          the result explicitly
        * First, this is just tedious work, further we have to handle cases where the host side script function would
          normally return an object as a result, but in case an error occurs will return an error `string`
        * This should also be covered in "Natural script invocations"
* Natural script invocations
* Typesafe script invocations
* Automatic theme handling