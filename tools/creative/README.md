# Website production examples

These are editable sources for the optional examples on `/production/#examples`.
They run locally; no paid rendering service, new synthesized voice, or upload is required.
Delivery files live in `images/production/` and are explicitly referenced by the production builder.

## One bottleneck

`one-bottleneck/explainer.html` is a deterministic SVG/HTML animation with `renderAt(seconds)`.
It uses Georgia/Arial, a warm neutral background, charcoal text and a blue accent. The main
message is burned into the silent video; diagram scenes explicitly say “Illustrative workflow”.
The 21-second script is in `one-bottleneck/transcript.md`. This is an illustrative message,
not a customer result, live software demo, or proven conversion winner.

With Playwright available to Node, local Chrome and ffmpeg installed:

```sh
node tools/creative/one-bottleneck/render.cjs
ffmpeg -i tools/creative/one-bottleneck/poster.png -frames:v 1 -q:v 2 tools/creative/one-bottleneck/poster.jpg
```

The renderer accepts `PLAYWRIGHT_MODULE`, `CHROME_PATH`, and `FFMPEG_PATH` overrides.
It writes its own outputs beside the source. Inspect them before copying the MP4, JPG and
`captions.vtt` into `images/production/one-bottleneck.{mp4,jpg,vtt}`. Pin fonts when reproducing
on another operating system. Original verified delivery: 21 seconds, 720×1280, H.264,
24fps, CRF26, faststart, no audio, 268,736 bytes.

## Sloane

Sloane is a synthetic spokesperson shown as a production capability sample, never a customer
or testimonial. The retained line is: “Everything about this video is AI. Including me.”
Every frame carries “Sloane · AI-generated spokesperson · Demo”. The disclosure leaves space
for native playback controls. The 3.250-second endpoint falls within the detected source
silence (2.700–3.360 seconds), before the next sentence. The edit was reviewed against
captions, decoded frames and audio silence; the speech was not independently transcribed.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 tools/creative/sloane/build_excerpt.py images/production/ugc-sloane-reveal.mp4
```

Use `--output-dir` for a different working directory. The original MP4 is read only; the script
checks that its hash is unchanged. Review the results, then copy `sloane-ai-demo.{mp4,jpg,vtt}`
to `images/production/`. Regenerate the production page with
`PYTHONDONTWRITEBYTECODE=1 python3 tools/build-production-page.py`.

The original car clip cites client lead costs without supporting campaign records in this
review. The full reveal adds unverified creator price and turnaround comparisons. Those
four original MP4/JPG source files remain unchanged in Git and are excluded by
`stage-public.cjs`; only the reviewed excerpt is selected for website publication.

## Placement

Keep the homepage conversation action primary. Its production proof tile leads to these
examples. Both players are optional, have native controls and `preload="none"`, and have
readable text alternatives beside them. Keep the actual conversation link adjacent to
the players: the drawn video invitation cannot itself be clicked. A play is not a lead.
