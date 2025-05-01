## Archive Notes

I decided to uninstall the Discord desktop client due to the constant updates and annoying Windows specific issues like resetting audio settings. I had the idea of building my own wrapper around the Discord web client using something like Electron/Tauri, but there would be a number of limitations and potential problems that I don't have solutions for, yet.

Therefore; I set up a portable browser and now just use the Discord web client with modifications injected via the Violentmonkey and Stylus extensions. Once the browser is properly set up, it's much easier to apply custom scripts and styles this way, while also pretending that I'm still using a desktop app.

tldr: https://github.com/ericchase/mod--discord-web-client

---

## About

https://github.com/ericchase/mod--discord-client

This is a project for modding the Discord client. It is capable of injecting custom CSS styles and JavaScript code that runs on startup. The injection process is manually executed by running the command `bun run build`. **You will need to run it after every Discord update.** You can make this even easier by creating a script that you can double click to run. Fully automating this process is possible, but I personally don't have the need for it.

If you encounter any problems and need help, submit an issue or send me an email.

## TypeScript Library and Template Project

For information about my TypeScript library and template projects, please visit:

- https://github.com/ericchase-library/ts-library
- https://github.com/ericchase-library/ts-template

## Enable Developer Tools

If you're interested in learning how to add mods yourself, then follow these steps:

1. Find `settings.json` under:
   - This path is for Windows, not sure where it would be on Linux or Mac.

```
C:\Users\[USERNAME]\AppData\Roaming\discord\settings.json
```

2. Add `"DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true` to the object so that it looks something like this:

```json
{
  "IS_MAXIMIZED": true,
  "IS_MINIMIZED": false,
  "WINDOW_BOUNDS": {
    "x": -1450,
    "y": 177,
    "width": 1280,
    "height": 720
  },
  "chromiumSwitches": {},
  "DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true
}
```

- Make sure to add a `,` (comma) to the end of the previous line.

**Note**: Don't worry about the other lines, those are specific to each person.

## Previous Modding Method

1. Find `index.js` under:
   - This path is for Windows, not sure where it would be on Linux or Mac.

```
C:\Users\[USERNAME]\AppData\Local\Discord\app-[LATEST_VERSION]\modules\discord_voice-1\discord_voice
```

1. Append the contents of `mod.js` to the end of `index.js`. Refresh discord client.

**Note**: If `index.js` is missing, discord may have failed to update properly. Try uninstalling and installing Discord again.
