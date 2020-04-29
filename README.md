# ps-ext-playground

Playground for testing out the development of [CEP](https://www.adobe.io/apis/creativecloud/cep.html) based Photoshop 
extension panels.

This project is not intended to produce usable code. Rather, it's purpose is just to test different approaches and to
gain information about how to best develop an extension panel. 

## Goals
* Automate as far as possible
* Use Typescript
* Run in local dev-server
* Pass objects between panel and host
* "Natural" script invocations
* Typesafe script invocations
* Automatic theme handling

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