# Changes Since Release

Everything added after the final presentation.

## Performance

- Updated the raycaster to only check interactable objects' models, lowering a lot the number of checks each frame, and to only do it at 20Hz to check even less.
- Sacrificed multiple objects with outlines at the same time (which were never used) to make less mesh checks in the scene.
- Capped pixel ratio to `min(devicePixelRatio, 2)` to avoid over-rendering on high-DPI displays.
- Changed the lighting and shadow system to "bake" static shadows and keep dynamic ones with a moving light. Shadows are split into two directional lights:
  - a big **static** `keyLight` that bakes the shadows of static objects once (`shadow.autoUpdate = false`, updated manually once)
  - a **`moverLight`** that follows the player to render shadows for dynamic objects only (exactly the same as before, but only renders the dynamic objects' shadows).

## World

- Added walls around the city to prevent going out of bounds.
- Removed hardcoded trees around the city and replaced then with a "ring" generator, which spawns trees with a random position, scale and rotation. More trees spawn right around the city, with a big falloff.
- Fixed objects vanishing under the new culling/shadow setup.

## UI

- Added an on-screen `E` key prompt now appears on desktop to show how interaction works.

## Organization

- Moved objects into `src/objects` to help with better organization.
