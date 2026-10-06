# The Spark — A History of Human Progress

A 118-second portrait animation built with HyperFrames, Three.js, GSAP, and Edge TTS (en-GB-RyanNeural).

## Review

Run `node node_modules/hyperframes/dist/cli.js preview --background`, then open the Studio URL printed by the command. The current review is at http://localhost:3002/#project/Clip.

Timeline: Fire 0–10s; Agriculture 10–20s; Writing 20–30s; Printing 30–40s; Science 40–50s; Industry 50–62s; Electricity 62–72s; Computing 72–82s; Space 82–92s; AI 92–104s; Closing 104–118s.

`npm run check` validates the composition. All scene motion follows the seekable composition clock. Narration files and timing metadata are in `assets/`.

The complete film is available for Studio review only. `renders/the-spark-first-20s.mp4` is the earlier 20-second export, not the current full film. Legacy `render.mjs` and `verify.mjs` scripts apply to that initial export; use the project CLI for current validation.
