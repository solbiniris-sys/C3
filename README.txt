WATERLINE V66

Railway deployment root:
server.js
package.json
public/index.html
public/app.js
public/style.css

V66 fixes:
- Restores the missing sceneFor() handler so city inspection no longer crashes.
- Fixes main-story progression so objectives actually advance after discoveries.
- Removes duplicate pointerup/click handling that could make mobile taps fire twice.
- Adds duplicate-action protection for network latency/double taps.
- Changes ordinary action feedback to a non-blocking toast so popups no longer cover the game.
- Adds more varied inspection scenes, clues, items and NPC/world hooks.
