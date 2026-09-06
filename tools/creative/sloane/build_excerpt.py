#!/usr/bin/env python3
"""Make a disclosed capability excerpt from the existing Sloane reveal.

Runs locally with ffmpeg/ffprobe; no generated speech, paid rendering or uploads.
The full source is read only and remains unchanged.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

HERE = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path, help="Original ugc-sloane-reveal.mp4")
parser.add_argument("--output-dir", type=Path, default=HERE)
args = parser.parse_args()
source = args.source.resolve()
out_dir = args.output_dir.resolve()
out_dir.mkdir(parents=True, exist_ok=True)
video = out_dir / "sloane-ai-demo.mp4"
poster = out_dir / "sloane-ai-demo.jpg"
band = out_dir / "disclosure.png"
assert source.is_file()
assert source != video
source_sha = hashlib.sha256(source.read_bytes()).hexdigest()

# 0–3.250s retains the AI reveal, ending within the 2.700–3.360s
# detected silence and before the next sentence's captions (~3.625s).
# The persistent two-line disclosure is below the original caption area.
subprocess.run(["node", str(HERE / "render-disclosure.cjs"), str(band)], check=True)
vf = "[0:v]scale=720:1280:flags=lanczos,fps=24,format=yuv420p[base];[base][1:v]overlay=0:1040:shortest=1[out]"
command = [
    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
    "-i", str(source), "-loop", "1", "-i", str(band), "-t", "3.250", "-map", "[out]", "-map", "0:a:0",
    "-filter_complex", vf, "-c:v", "libx264", "-preset", "medium", "-crf", "26",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart", str(video),
]
subprocess.run(command, check=True)
subprocess.run([
    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
    "-ss", "1.000", "-i", str(video), "-frames:v", "1", "-q:v", "2", str(poster),
], check=True)
probe = json.loads(subprocess.check_output([
    "ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(video),
]))
vstream = next(s for s in probe["streams"] if s["codec_type"] == "video")
astream = next(s for s in probe["streams"] if s["codec_type"] == "audio")
assert (vstream["width"], vstream["height"]) == (720, 1280)
assert vstream["codec_name"] == "h264" and astream["codec_name"] == "aac"
assert video.stat().st_size < 2_000_000
assert 3.24 <= float(probe["format"]["duration"]) <= 3.30
assert hashlib.sha256(source.read_bytes()).hexdigest() == source_sha
(out_dir / "sloane-ai-demo.vtt").write_text(
    "WEBVTT\n\n00:00:00.000 --> 00:00:03.250\n"
    "Everything about this video is AI. Including me.\n", encoding="utf-8"
)
(out_dir / "render-receipt.json").write_text(json.dumps({
    "source_name": source.name,
    "source_sha256": source_sha,
    "output_sha256": hashlib.sha256(video.read_bytes()).hexdigest(),
    "command": command,
    "ffprobe": probe,
}, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"video": str(video), "poster": str(poster), "bytes": video.stat().st_size,
                  "duration": probe["format"]["duration"], "source_unchanged": True}))
