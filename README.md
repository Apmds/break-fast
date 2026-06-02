# Break Fast

A 3D toon-shaded browser game, built with [Three.js](https://threejs.org/), about wanting to go on a break — *fast*.

Developed as the final project for the [Introduction to Computer Graphics](https://www.ua.pt/pt/uc/7930) course.

| | |
|---|---|
| **Student** | António Santos |
| **Student Number** | 119139 |
| **Project** | Break Fast |
| **Play it** | https://apmds.github.io/break-fast/ |
| **Repository** | https://github.com/Apmds/break-fast |
| **Demo video** | _TODO: video URL_ |

> The latest gameplay changes are documented in [CHANGELOG.md](CHANGELOG.md) — everything added since the release.

## About

You've waited ages for a vacation. The only road out of town crosses a bridge that's *just* finished construction — but it can't open until "The Boss" of the construction crew signs off, and nobody knows where he is. So you set off through the small city on foot to track him down, chatting with its (slightly unhinged) inhabitants along the way, before finally getting in your car and driving off into your well-earned break.

> **Screenshot:** wide establishing shot of the toon-shaded city seen from near the bridge — sells the art style and scale at a glance.

## Features

**Rendering & art style**
- Cel / toon shading driven by gradient ramp textures (`threeTone`, `fiveTone`).
- Custom outline shader (`assets/shaders/outline/`) that highlights interactable objects on hover.
- Stylised toon **water shader** for the river, cubemap **skybox**, and distance fog.
- Baked static shadows plus a player-following light for dynamic shadows (see [CHANGELOG.md](CHANGELOG.md)).

> **Screenshot:** an interactable object with the white hover outline active, next to the on-screen `E` interact prompt — shows the interaction feedback.

**World & physics**
- Hand-built city: city hall, a "DcMonalds" restaurant, houses, roads, sidewalks and a bridge.
- [cannon-es](https://github.com/pmndrs/cannon-es) physics for player movement, collisions and map boundary walls.
- Hundreds of procedurally placed, instanced trees ringing the playable area.
- Path-following objects — a self-driving car loops the city, NPCs walk set routes.

> **Screenshot:** the self-driving car on the road with trees in the background — highlights instancing and path-following.

**Characters & dialogue**
- NPCs with a scripted, branching **dialogue system**: typewriter text, per-line speed, triggered animations, and Animal-Crossing-style grunt "speech" with a per-character voice pitch.
- A cast of characters with their own quirks (The Boss, Rofi the hat salesman, talking kitchen appliances...) and side quests.
- Player model rigged and animated via Mixamo; every world object can play actions through its own animation mixer.

> **Screenshot:** an open dialogue box mid-conversation showing the speaker name and styled text.

**Items & progression**
- Pick-up items (straw hat, sunglasses, parasol) with an inventory and an animated "item get" reveal UI.
- Quests gate items — e.g. find Rofi's hidden straw hat.
- An end scene where you drive off and the items you collected are shown.

> **Screenshot:** the "item get" reveal with the animated pulsing ring around the item icon.

**Platform & UX**
- Loading screen with a progress bar while assets stream in.
- Main menu and pointer-lock controls on desktop.
- Mobile / touch support: on-screen joystick and action buttons, with desktop-only hints hidden on touch devices.

## Controls

The game features both desktop (**recommended**) and mobile controls.

### Desktop:

- **WASD**: Move character
- **Mouse**: Move camera
- **Space**: Jump
- **Shift**: Run
- **E**: Interact
- **Esc**: Unlock mouse

### Mobile:

- **Left joystick**: Move character
- **Right joystick**: Move camera
- **Up arrow button**: Jump
- **Dot button**: Interact


## Running

This project was created with Vscode [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, so using it is the most direct way of running the project.

If VScode is not available or you don't like vscode, just run `python -m http.server` and open `localhost:8000` in the browser.

## Tech stack

- [Three.js](https://threejs.org/): rendering
- [cannon-es](https://github.com/pmndrs/cannon-es): physics / collisions
- [lil-gui](https://lil-gui.georgealways.com/): debug UI
- [blender](https://blender.org/): 3D modelling

## AI usage

AI was used extensively throughout the development process for learning tools (mostly blender) and for discussing ideas such as where performance could be updated.

These are some concrete examples of specific tasks that were assisted by AI:

**Google Gemini**
- Guidance for operating Blender. [This conversation](https://gemini.google.com/share/d86d77640eaa) was my main source of dependen.
- Created most of the final CSS (some of it is credited with appropriate links).

**GitHub Copilot**
- Integrating the outline shader with the bone animations.
- Translating the camera controls from my original C implementation into JavaScript.

**Claude**
- Implemented the mobile controls.
- Created the animated lines on the "item acquired" menu (see [`src/index.js`](src/index.js) (`make_item_ring_lines`) and [`src/style.css`](src/style.css) (`.line` / `@keyframes pulse`): `https://claude.ai/share/41278cda-119b-4647-9a0b-42f5d6266fd0`).
- Helped implement the audio system.
- Debugging.

All design decisions for the project structure and visual identity were entirely created by me.

## Repository structure

```text
break-fast/
├── index.html                  # GitHub Pages entry — redirects to src/index.html
├── favicon.ico
├── package.json                # Vite + Three.js + cannon-es dependencies
├── vite.config.js
├── shell.nix
├── links.txt                   # Asset & reference credits
├── README.md
├── CHANGELOG.md                # Changes since the release
│
├── assets/                     # Runtime assets loaded by the game
│   ├── models/                 # .glb models
│   │   ├── Buildings/          #   city hall, DcMonalds (+ pole / ground), house
│   │   ├── Cars/               #   car
│   │   ├── Objects/            #   parasol, straw hat, sunglasses
│   │   └── People/             #   citizen
│   ├── textures/               # pavement (PavingStones145), toon ramps
│   ├── skybox/                 # cubemap faces (px / nx / py / ny / pz / nz)
│   ├── shaders/outline/        # outline.vert / outline.frag
│   ├── sounds/                 # grunt SFX
│   └── item_thumbnails/        # item UI icons
│
├── src/
│   ├── index.html              # Game page — UI overlays, menus, HUD
│   ├── index.js                # Bootstrap entry point
│   ├── style.css
│   │
│   ├── city/                   # Scene & world building
│   │   ├── city.js             #   main scene: layout, lights, shadows, physics, trees
│   │   ├── bridge.js
│   │   ├── road.js
│   │   ├── sidewalk.js
│   │   ├── water.js            #   toon water shader
│   │   ├── skybox.js
│   │   ├── trees.js            #   instanced tree placement
│   │   └── end_scene.js        #   drive-off ending
│   │
│   ├── objects/                # World-object hierarchy
│   │   ├── world_object.js     #   base class: model, physics body, path-following
│   │   ├── path.js
│   │   ├── buildings/          #   city_hall, dcmonalds (+ pole / ground), house
│   │   ├── items/              #   base_item, parasol, straw_hat, sunglasses, placeholder
│   │   └── other/              #   car
│   │
│   ├── people/                 # NPCs & dialogue
│   │   ├── citizen.js
│   │   ├── boss_citizen.js
│   │   ├── builder_citizen.js
│   │   ├── conversation.js
│   │   └── conversationText.js
│   │
│   ├── player/                 # player.js, camera_controls.js
│   ├── data/                   # dialogue_map.js (script), object_paths.js (asset manifest)
│   ├── ui/                     # main_menu.js, debug_ui.js
│   └── utils/                  # scene, renderer, game_manager, input_manager,
│                               #   object_manager, ui_utils, debug_utils, road
│
├── docs/                       # Course deliverables
│   ├── proposal/               #   concept art + proposal PDF
│   ├── intermediate/           #   intermediate report + presentation
│   └── final/                  #   final presentation + image gallery
│
├── mockups/                    # Early design mockups
└── proj_files/                 # Source art — Blender (.blend), Mixamo anims, raw textures
```
