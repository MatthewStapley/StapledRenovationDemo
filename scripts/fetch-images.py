#!/usr/bin/env python3
"""Download every demo image from its Unsplash source at several widths.

Writes public/images/<name>-<width>.webp. Crops reuse Unsplash's imgix
parameters so every width of an image has an identical crop. Sources and
licences: IMAGE-CREDITS.md. Run: python3 scripts/fetch-images.py
"""
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor

U = "https://images.unsplash.com/"

# name: (photo id, widths, height/width ratio for crops or None, extra params, quality)
IMAGES = {
    "hero": ("photo-1763485956243-50068d04a1ad", [640, 960, 1440, 1920, 2400], None, "", 72),
    "materials/warm-stone": ("photo-1696987007764-7f8b85dd3033", [480, 800, 1200, 1500], 1.25, "crop=focalpoint&fp-x=0.62&fp-y=0.5", 70),
    "materials/natural-timber": ("photo-1781344334947-60c704bafd51", [480, 800, 1200, 1500], 1.25, "crop=focalpoint&fp-x=0.42&fp-y=0.5", 64),
    "materials/modern-monochrome": ("photo-1723258341218-7da743db15db", [480, 800, 1200, 1500], 1.25, "crop=focalpoint&fp-x=0.55&fp-y=0.5", 70),
    "materials/warm-stone-sample": ("photo-1696987007764-7f8b85dd3033", [280, 560], 1.25, "crop=focalpoint&fp-x=0.42&fp-y=0.3&fp-z=3.2", 72),
    "materials/natural-timber-sample": ("photo-1781344334947-60c704bafd51", [280, 560], 1.25, "crop=focalpoint&fp-x=0.93&fp-y=0.5&fp-z=4", 72),
    "materials/modern-monochrome-sample": ("photo-1723258341218-7da743db15db", [280, 560], 1.25, "crop=focalpoint&fp-x=0.56&fp-y=0.63&fp-z=4", 72),
    "transformation/finished-bathroom": ("photo-1742134131017-44d377a611b1", [800, 1200, 1600, 2000], None, "", 68),
    "details/brass-mixer": ("photo-1769356814886-abdadde25ea7", [550, 825, 1100], 1400 / 1100, "crop=focalpoint&fp-x=0.55&fp-y=0.45", 72),
    "details/brass-tap-marble": ("photo-1771682390082-eb3f9821efd7", [800, 1200, 1600], 1067 / 1600, "", 72),
    "details/stone-bath": ("photo-1717497043540-d45bf85e5d38", [600, 900, 1200], 1.0, "crop=focalpoint&fp-x=0.45&fp-y=0.5", 72),
}
GALLERY = [
    ("photo-1507652313519-d4e9174996dd", 58),
    ("photo-1688786219616-598ed96aa19d", 70),
    ("photo-1770987685744-630d3c2494bd", 72),
    ("photo-1631889993959-41b4e9c6e3c5", 70),
    ("photo-1564540579594-0930edb6de43", 70),
    ("photo-1763485955497-f5ef5d178698", 70),
    ("photo-1774578342098-66adff9c1fe1", 72),
    ("photo-1638799869566-b17fa794c4de", 72),
]
for i, (pid, q) in enumerate(GALLERY, 1):
    IMAGES[f"gallery/g{i}-card"] = (pid, [360, 720], 1.25, "", q)
    IMAGES[f"gallery/g{i}"] = (pid, [1200, 2000], None, "", q)

jobs = []
for name, (pid, widths, ratio, extra, q) in IMAGES.items():
    for w in widths:
        params = f"w={w}&fm=webp&q={q}"
        if ratio:
            params += f"&h={round(w * ratio)}&fit=crop"
        if extra:
            params += "&" + extra
        jobs.append((f"public/images/{name}-{w}.webp", f"{U}{pid}?{params}"))

def fetch(job):
    out, url = job
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return
    os.makedirs(os.path.dirname(out), exist_ok=True)
    # The CDN occasionally answers 503 under load; curl retries with backoff.
    subprocess.run(
        ["curl", "-sSfL", "--retry", "6", "--retry-all-errors", "--retry-delay", "2", "-o", out, url],
        check=True,
    )

with ThreadPoolExecutor(3) as pool:
    list(pool.map(fetch, jobs))
print(f"{len(jobs)} files")
