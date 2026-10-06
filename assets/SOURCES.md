# Visual assets

Earth color, normal and cloud textures downloaded from the Three.js examples repository:
https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets
Used locally as earth-color.jpg, earth-normal.jpg, earth-clouds.png. Example usage: https://github.com/mrdoob/three.js/blob/dev/examples/misc_controls_fly.html

person-light.png: generated using the built-in image generation tool, October 6, 2026. Transparent full-body cinematic illustration, used in the closing scene.
Prompt: One ordinary adult person, full body head to toe, standing in three-quarter profile facing right and looking at a small golden light above their outstretched palm. Natural anatomy, charcoal blue trousers and linen shirt, practical shoes; warm amber face and hand lighting, cool violet rim light; cinematic realism, transparent background, no text or logos.

Antique manuscript, computer and rocket: authored procedurally in this project.


person-clean.png: built-in image-generation edit of person-light.png. Prompt: Remove only the small floating golden sphere and its bloom. Keep the original 1024x1536 canvas, person placement, pose, anatomy, clothing and lighting direction. Preserve transparency, restore transparency where the sphere was, retain subtle warm illumination for later dynamic relighting. No new objects, text, background, cropping or re-posing.

orb-fragment.js adapts the installed HyperFrames cosmic-orb registry shader in compositions/cosmic-orb.html, with a warm emissive body for the closing light.
