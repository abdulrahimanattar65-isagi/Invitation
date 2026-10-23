# Floral invitation reference

Source supplied by the user: `gemini_generated_video_c77892bb.mp4`.

The opening is implemented in `src/components/FloralRibbon.jsx`. Canvas draws 108 frames at 24 fps from 14 JPEG sprite sheets, using a small sliding preload window. Playback pauses during asset loading and completes through a callback rather than an unrelated timeout. Animation frames cover 1.9–6.4 seconds of the reference. Each sheet contains eight 576×1024 frames arranged in four columns and two rows; only four frames in the final sheet are used.

`public/assets/floral-invitation/closed.jpg` supplies the static opening fallback. `frame.jpg` is a clean frame extracted at 6.25 seconds and supplies the stationery beneath editable React text. No placeholder wording from the video is used. The video is not embedded or played by a video element. The ribbon motion is reference-derived raster animation, rather than a physically simulated knot.

Reduced-motion preferences bypass playback. Loading errors advance to the readable invitation. The card preserves its 9:16 proportions on mobile and desktop.
