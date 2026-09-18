# Starfall Expedition: English

Create an ENGLISH-ONLY copy of my existing playable game STARFALL, preserving the same version and functionality. This is NOT a redesign and NOT a new game concept. Original owned game: https://starfall-expedition.martinnoka.chatgpt.site . Project name: Starfall Expedition — English.

FIRST retrieve the original public index.html, style.css and game.js from that origin (assets are /style.css?v=2 and /game.js?v=2, and a local /three.module.js). These are my existing game's source assets. If accessible, COPY the actual game and CSS into this project, translate every Bulgarian user-facing string to fluent English and change html lang to en. Preserve layout, visuals, physics, controls, five levels, mission progression, localStorage names, and all logic. Mount original game cleanly in your supported stack. Do not replace the original with a landing page or screenshot. No extra features, backend, login or payment. Do not change the original site; this is a standalone English copy. Original device saves are origin-local so do not claim they automatically transfer to this new domain.

The original version to retain is SECOND SIGNAL. Five 3D platforming sectors, astronaut, jetpack, dash, shield, 15 optional relics (three per sector), checkpoints, medals, minimap and orbit camera. All graphics are actual procedural Three.js meshes. Full viewport playable game, cinematic charcoal/navy background, mint accents, Manrope type, start menu overlay left over live 3D scenery, astronaut in white/orange suit with dark blue visor and twin jet exhausts, starfield, blue planet, ring, metallic floating platforms, derelict survey craft, orbital structures. Do not generate illustrations in place of real gameplay.

If the original assets cannot be retrieved, reconstruct the existing version faithfully from this exact specification, and explicitly tell me in your response that source retrieval failed and this is a reconstruction:
Title STARFALL, subtitle SECOND SIGNAL. Intro eyebrow SECOND SIGNAL · EXPEDITION 02, headline “The cosmos remembers the signal.” Text “Five lost sectors. One last astronaut. Fly through the remnants of Echo, discover the relics, and light the way back to Earth.” START EXPEDITION, SELECT MISSION, 05 MISSIONS / 15 SECRET RELICS / ONE HOME. Use familiar mission/menu overlay rather than marketing website. Top left logo; top right Sound off/on, Graphics Auto/Eco/High, pause. During play HUD sector number/name/objective left, cores/relics/time right, suit lives + jet fuel + dash recharge + shield status bottom left, minimap bottom right (on mobile above flight controls). Minimap shows player, platforms, remaining cores and relics, goal. Projected next-core distance indicator.

Exact main platform level data, tuples [x,topY,z,width], starting feet at (0,0,0), forward negative z:
1 Echo Dock, accent #c6fba9, gravity18: [[0,0,0,7],[0,.3,-8,5],[5,.7,-15,5],[1,1.1,-22,6],[-5,.5,-29,5],[-2,1,-37,7]], cores indices[1,3,4], drones[], lasers[].
2 Lunar Garden accent #88d6f2 gravity15: [[0,0,0,7],[-4,.8,-8,5],[2,1.6,-15,5],[7,2.3,-23,6],[1,3,-31,5],[-5,3.8,-38,5],[0,4.4,-46,7]], cores[1,2,4,5], drones[3], lasers[].
3 Red Belt accent #ffba82 gravity18: [[0,0,0,7],[5,.5,-8,5],[1,1,-16,5],[-5,1.3,-23,6],[-1,1.8,-31,5],[6,2.3,-38,5],[1,2.8,-46,7]], cores[1,2,4,5], drones[1,3,5], lasers[].
4 Silent Reactor accent #c8acff gravity18: [[0,0,0,7],[-4,.6,-8,5],[2,1.3,-16,5],[7,1.9,-24,6],[1,2.5,-32,5],[-5,3.1,-40,5],[0,3.8,-48,7]], cores[1,2,4,5], drones[4], lasers[2,3,5].
5 The Way Home accent #a1ffe0 gravity16: [[0,0,0,7],[5,.7,-8,5],[0,1.4,-16,5],[-6,2.2,-24,6],[-1,3,-32,5],[5,3.8,-40,5],[0,4.5,-48,6],[-4,5.2,-56,7]], cores[1,2,4,5,6], drones[2,4,6], lasers[3,5].
Each platform metal deck thickness1.15 with illuminated edge strips, corner orange pads, underside support and engine. Illuminated dots between main platforms. Main platform indices3,6 are checkpoints. Portal at last MAIN platform, not optional relic platform, position z-.6 radius1.45; requires all green cores. Green rotating octahedral cores float at platform top+1.05. Sector1 and5 have simple white dock arches; sector2 tall icy blue crystal cones; sector3 irregular nearby asteroids; sector4 purple toroidal reactor architecture.
Three optional relics per sector: for k0..2 choose main index min(mainCount-2,1+k*2), side = k%2?-1:1, x=platform.x+side*(width/2+2.4), z=platform.z-1.4, y=platform.y+.6. Add 2.8-wide side dock and floating orange relic at y+1.2. Relic restores shield. No obligatory cores on side docks.

Controls desktop WASD/arrows camera-relative movement, Space jump/hold airborne for jetpack, Shift dash, R free return checkpoint, Escape/P pause, drag world to orbit, wheel zoom. Touch bottom-left analog stick, bottom-right large ↑ JETPACK hold button and smaller » DASH button; drag elsewhere to orbit. Multi-touch using independent pointer capture; stop inputs on pointer cancellation/blur; pause on hidden. Auto quality lowers pixel ratio to1.15 and shadows off on coarse pointer, High caps1.8. Portrait and landscape safe-area layouts.

Movement speed7.2 damping15 grounded/5 airborne. Jump8.8, jet adds25/s, gravity sector based, caps upward velocity6.5, fuel100 drains32/s flying refills50/s grounded. Coyote .12sec jump buffer .14. Dash speed19 lasts.22sec cooldown3.2sec, direction movement or avatar facing; vy min2. Drones patrol sinusoidally across their platform and initialized at correct position before first physics step. Pulsing lasers can be jumped or waited for. Three lives; shield absorbs one collision but never protects falling below y=-14. Death returns checkpoint with fuel full and2sec invulnerability; zero lives retry dialog. Collected items persist during current mission deaths. Medal1 for completion,2 for all3 relics,3 for all3 and zero lost lives. Save unlocked mission and best times in localStorage starfall-save {unlocked,best}; medals/relics in starfall-records. Saved unlock clamp0..4. Mission select locks later levels. End results time/relics/lost lives and nextmission or newexpedition. Return menu and retry work.

Orbit camera initial yaw.62,pitch.55,distance19, clamp pitch.25..95 distance12..25; smooth follow, FOV48 briefly57 dash. Lightweight pooled/instanced particle bursts on cores, relics, shield and landing plus thruster trails. Procedural short WebAudio sounds toggled by user. Sector intro 4sec overlay, English story snippets. Reduced motion support. No new story campaign, interiors, upgrades, robot companion, moving platforms or unrequested mechanics.

Validate all user-visible strings including runtime toasts, errors, graphics states, accessibility labels, sector names, instructions and result overlays are English. Preserve original logic if source copied. Confirm build passes, the game starts and all controls are wired. Return the working preview URL and whether original source was copied or reconstructed.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://starfall-expedition-english.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7e14aa91-a75a-44a1-8f0b-223b7d3fedea).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
