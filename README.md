![image](https://user-images.githubusercontent.com/3319450/192067289-4cf2fe7f-25ab-47be-ae36-d7be8398ddfa.png)  

This is a EverQuest Emulator plugin (https://github.com/eqemu/server) that aims to provide intellisense, autocompletions for both server-embedded Perl and Lua API's.

EverQuest Emulator Server contains

* 1,000's of custom method exports
* 100's of custom events
* 100's of constants

### Features

* **Lua** Full function, event, constant auto-completion Quest API support
* **Perl** Full function, event, constant auto-completion Quest API support
* **Automatic Updates** When EQEmulator Server source updates, Spire updates, which means this extension automatically updates the next time you start vscode.
* **Contextual Awareness** The plugin is aware of the difference of what kind of script it is running in order to give the proper event and method exports. For example in a `player` script, `e.other` and `e.self` are different from a `npc` script in `event_say(e)`. Similarly, the completions provider knows what events are available depending on the type of script you are in `player`, `npc`, `bot`, `item`, `spell` etc.

![image](https://user-images.githubusercontent.com/3319450/205479553-7b8382e4-0bfc-43c0-bc38-2fba27096602.png)

![image](https://user-images.githubusercontent.com/3319450/205479541-fc1f0cc5-c832-4b3c-866e-929a5908ca95.png)

![image](https://user-images.githubusercontent.com/3319450/205479564-04533228-c937-4c94-a723-e33e6c921ffb.png)

![image](https://user-images.githubusercontent.com/3319450/205479580-7d0c04fd-e81a-4ca0-88c8-9012c7eb092a.png)

### Definitions

Definitions are provided by Spire's API and updated when Spire is updated.

* **Quest API Explorer** http://spire.akkadius.com/quest-api-explorer
* **Spire Definitions API** http://spire.akkadius.com/api/v1/quest-api/definitions

### Accompanied Plugins

This plugin works best with the following Lua plugins (Tested)

* **Lua** by **keyring**
* **Perl** by **Gerald Richter**
