# Update STARFALL to Crew Update v3

## Scope
- Replace the current game logic and presentation with the retrieved v3 source while preserving the five sectors, saves, progression, and gameplay identity.
- Translate every Bulgarian player-facing string into natural English, including menus, HUD labels, settings, accessibility labels, messages, mission names, and results.
- Port the v3 interface structure: compact HUD, settings controls, and collapsible minimap.
- Retain v3 gameplay changes: crew and robot animation, satellites and cargo flyby, pointer ownership fixes, input resets, fixed-step physics, underside collisions, relic positioning, jump behavior, Eco mode, and reduced motion.

## Validation
- Confirm no Cyrillic text remains in the files served by the game.
- Verify the app compiles through the project harness.
- Exercise start, pause/settings, map collapse, movement, jump, and mobile controls in browser checks at desktop and phone sizes.
