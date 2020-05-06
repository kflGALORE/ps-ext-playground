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
* Use Typescript [solved]
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
* "Natural" script invocations
* Typesafe script invocations
* Automatic theme handling