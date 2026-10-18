# TypeHype

A fast-paced 3D typing survival game built with Three.js.

## How to Play

- Words fly toward you through hyperspace.
- Type a word before it reaches you to destroy it.
- The game auto-targets the closest word that starts with the key you press.
- Press `Enter` at any time to reset the current word if you make a mistake.
- Survive as long as possible as waves get faster and harder.

## Difficulty

Choose a difficulty before starting:

- **Kids** — very slow, simple three-to-five letter words for young players.
- **Easy** — slower words, fewer hard words.
- **Normal** — balanced challenge.
- **Hard** — faster spawns, tougher vocabulary.
- **Insane** — maximum speed and relentless waves.

## Power-ups

Glowing bonus words appear periodically. Type them to activate an effect:

- **HEAL** — restores 25 health.
- **SLOW** — slows all words for 5 seconds.
- **FREEZE** — stops all words completely for 3.5 seconds.
- **SHIELD** — absorbs the next collision.
- **2X** — doubles score for 8 seconds.
- **BOMB** — destroys every visible word instantly.

## HYPE Word

A rare, rainbow-gradient **HYPE** word spawns with a spin and pulse animation. Type it for a huge score bonus, a full-screen flash, and a spectacular multi-colour explosion.

## Golden Words & Perfect Bonus

Roughly 1 in 12 words spawns **golden** — worth triple points. Completing any word without a mistake earns a **PERFECT** bonus on top.

## Boss Waves

Every 5th wave summons a **boss phrase**. Type it before it reaches you for a massive bonus — or use a bomb to destroy it.

## Ambient Billboards

Neon **sponsored signs** for fictional brands drift past the edges of the tunnel — both behind the menu and during runs. They're purely decorative scenery and stay clear of the word lane.

## Sound

The game uses synthesized Web Audio for typing, explosions, damage, power-ups, and game-over sounds, plus a subtle synth music loop during runs.

## Leaderboard

Top scores are saved in your browser's `localStorage` and shown on both the start and game-over screens.

## Stats

The game tracks your global career stats (total score, runs, best streak, longest run) and per-run stats (WPM, accuracy, words destroyed, time survived). Stats are saved in `localStorage`.

WPM is calculated as `(correct keystrokes / 5) / minutes played`.

## Visual Customization

Earn total score across all runs to unlock colour themes. Open **Customize Theme** from the main menu to switch between:

- **Neon** — default
- **Matrix** — 2,000 total score
- **Sunset** — 5,000 total score
- **Ocean** — 10,000 total score
- **Plasma** — 20,000 total score

Themes change the tunnel, stars, fog, and word-glow colours.

## Mobile / Touch

On touch devices or narrow screens, a virtual keyboard appears during gameplay. You can also tap any word in 3D space to lock onto it, then type the rest.

## Running Locally

Open `index.html` in any modern web browser, or serve the folder with a local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

No build step is required — the game uses Three.js from a CDN.
