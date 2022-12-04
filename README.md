## [EQEmu] Spire Quest API Completions

![image](https://user-images.githubusercontent.com/3319450/192067289-4cf2fe7f-25ab-47be-ae36-d7be8398ddfa.png)  

This is a EverQuest Emulator plugin (https://github.com/eqemu/server) that aims to provide intellisense, autocompletions for both server-embedded Perl and Lua API's.

EverQuest Emulator Server contains

* 1,000's of custom method exports
* 100's of custom events
* 100's of constants

This plugin provides auto-completion for the Server Quest API 

They are provided by Spire's API and updated when Spire is updated.

* **Quest API Explorer** http://spire.akkadius.com/quest-api-explorer
* **Spire Definitions API** http://spire.akkadius.com/api/v1/quest-api/definitions

![image](https://user-images.githubusercontent.com/3319450/205477365-e2e4690e-a4f0-4270-a9b8-c9be2d63cf9a.png)

### Features

* **Lua** Full function, event, constant support
* **Perl** Full function, event, constant support

### Updating

**Plugin** This plugin may receive periodic updates. 

**Quest API** Updates from Quest API changes are immediate when developers in the emulator community merge PR's into master. Once PR's are merged into master, Spire recieves a signal to refresh its definitions, thus the next time a user restarts VSCode, new definitions will be loaded.
