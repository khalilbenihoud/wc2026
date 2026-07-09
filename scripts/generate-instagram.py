#!/usr/bin/env python3
"""Generate Instagram assets for The Road to Glory."""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "instagram"
OUT_DIR.mkdir(exist_ok=True)

# Brand colors
BG = "#09090b"
BG_2 = "#0c0c0e"
PANEL = "#18181b"
GOLD = "#f6c453"
GOLD_HI = "#ffdf8e"
GOLD_DEEP = "#b8862f"
STEEL = "#3f3f46"
LINE = "#27272a"
TEXT = "#f4f4f5"
MUTED = "#71717a"
WIN = "#22c55e"

# Font paths (SF Compact shipped on macOS; fall back to Helvetica)
FONT_DIR = Path("/Library/Fonts")
DISPLAY_BOLD = FONT_DIR / "SF-Compact-Display-Bold.otf"
DISPLAY_HEAVY = FONT_DIR / "SF-Compact-Display-Heavy.otf"
TEXT_REGULAR = FONT_DIR / "SF-Compact-Text-Regular.otf"
TEXT_MEDIUM = FONT_DIR / "SF-Compact-Text-Medium.otf"
TEXT_BOLD = FONT_DIR / "SF-Compact-Text-Bold.otf"

# Fallbacks if SF Compact is missing
HELVETICA = Path("/System/Library/Fonts/Helvetica.ttc")
ARIAL = Path("/Library/Fonts/Arial Unicode.ttf")


def pick_font(preferred: Path, fallback: Path, size: int) -> ImageFont.FreeTypeFont:
    path = preferred if preferred.exists() else (fallback if fallback.exists() else None)
    if path is None:
        return ImageFont.load_default()
    return ImageFont.truetype(str(path), size)


def font_display(size: int) -> ImageFont.FreeTypeFont:
    return pick_font(DISPLAY_HEAVY, HELVETICA, size)


def font_display_bold(size: int) -> ImageFont.FreeTypeFont:
    return pick_font(DISPLAY_BOLD, HELVETICA, size)


def font_body(size: int) -> ImageFont.FreeTypeFont:
    return pick_font(TEXT_REGULAR, HELVETICA, size)


def font_body_medium(size: int) -> ImageFont.FreeTypeFont:
    return pick_font(TEXT_MEDIUM, HELVETICA, size)


def font_body_bold(size: int) -> ImageFont.FreeTypeFont:
    return pick_font(TEXT_BOLD, HELVETICA, size)


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def draw_trophy(draw: ImageDraw.ImageDraw, cx: int, cy: int, size: int, color: str, bg: str = BG) -> None:
    """Draw a simple, crisp trophy icon in the center of the bracket."""
    s = size / 2  # half-size for easy math
    # Cup body (rounded rectangle-ish)
    body_w, body_h = int(s * 1.2), int(s * 1.4)
    body_left = cx - body_w // 2
    body_top = cy - body_h // 2
    body_right = body_left + body_w
    body_bottom = body_top + body_h
    draw.rounded_rectangle(
        [body_left, body_top, body_right, body_bottom],
        radius=body_w // 4,
        fill=color,
        outline=bg,
        width=2,
    )
    # Cup rim
    rim_h = body_h // 5
    draw.rounded_rectangle(
        [body_left - 2, body_top - rim_h // 3, body_right + 2, body_top + rim_h],
        radius=rim_h // 3,
        fill=color,
        outline=bg,
        width=2,
    )
    # Handles
    handle_w = body_w // 2
    handle_h = body_h // 1.4
    # Left handle
    draw.arc(
        [body_left - handle_w, body_top, body_left + 2, body_top + handle_h],
        start=90,
        end=270,
        fill=color,
        width=max(2, size // 8),
    )
    # Right handle
    draw.arc(
        [body_right - 2, body_top, body_right + handle_w, body_top + handle_h],
        start=-90,
        end=90,
        fill=color,
        width=max(2, size // 8),
    )
    # Stem
    stem_w = max(4, size // 5)
    stem_h = body_h // 1.2
    draw.rectangle(
        [cx - stem_w // 2, body_bottom - 2, cx + stem_w // 2, body_bottom + stem_h],
        fill=color,
        outline=bg,
        width=1,
    )
    # Base
    base_w = body_w + 4
    base_h = max(4, size // 4)
    draw.rounded_rectangle(
        [cx - base_w // 2, body_bottom + stem_h, cx + base_w // 2, body_bottom + stem_h + base_h],
        radius=base_h // 3,
        fill=color,
        outline=bg,
        width=2,
    )


def draw_brazil_flag(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    """Draw a simplified Brazilian flag."""
    # Green field
    draw.rectangle([x, y, x + w, y + h], fill="#009c3b")
    # Yellow diamond
    mid_x = x + w // 2
    mid_y = y + h // 2
    diamond = [
        (mid_x, y + 2),
        (x + w - 2, mid_y),
        (mid_x, y + h - 2),
        (x + 2, mid_y),
    ]
    draw.polygon(diamond, fill="#ffdf00")
    # Blue circle
    r = min(w, h) // 5
    draw.ellipse([mid_x - r, mid_y - r, mid_x + r, mid_y + r], fill="#002776")


def add_radial_gradient(draw: ImageDraw.ImageDraw, size: tuple[int, int], center_color: str, edge_color: str, radius: float) -> None:
    """Draw a soft radial gradient using concentric circles."""
    cx, cy = size[0] // 2, size[1] // 2
    c1 = hex_to_rgb(center_color)
    c2 = hex_to_rgb(edge_color)
    steps = int(radius)
    for r in range(steps, 0, -3):
        t = r / radius
        color = tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)


def draw_bracket_illustration(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    radius: int,
    *,
    highlight_year: str | None = None,
) -> None:
    """Draw a stylized radial bracket with concentric arcs."""
    rings = [
        (radius, STEEL, 12),           # R16 outer ring
        (int(radius * 0.78), MUTED, 8), # QF
        (int(radius * 0.58), GOLD_DEEP, 6), # SF
        (int(radius * 0.40), GOLD, 4), # Final
        (int(radius * 0.22), GOLD_HI, 2), # Center
    ]

    # Background track
    for r, color, _ in rings:
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            outline=LINE,
            width=2,
        )

    # Arc segments for each round (abstract representative arcs)
    segments = [
        # (ring_idx relative to rings list, start_angle, sweep, color)
        (0, 0, 35, STEEL),
        (0, 45, 30, STEEL),
        (0, 90, 40, STEEL),
        (0, 150, 25, STEEL),
        (0, 190, 35, STEEL),
        (0, 240, 30, STEEL),
        (0, 285, 40, STEEL),
        (0, 335, 20, STEEL),
        (1, 10, 55, MUTED),
        (1, 80, 50, MUTED),
        (1, 160, 55, MUTED),
        (1, 240, 50, MUTED),
        (2, 30, 70, GOLD_DEEP),
        (2, 140, 75, GOLD_DEEP),
        (3, 60, 90, GOLD),
        (4, 0, 360, GOLD_HI),
    ]

    for ring_idx, start, sweep, color in segments:
        r, _, width = rings[ring_idx]
        draw.arc(
            [cx - r, cy - r, cx + r, cy + r],
            start=start,
            end=start + sweep,
            fill=color,
            width=width,
        )

    # Champion dot in the center
    draw.ellipse(
        [cx - 14, cy - 14, cx + 14, cy + 14],
        fill=GOLD,
        outline=BG,
        width=3,
    )
    # Tiny trophy
    trophy_font = font_body_medium(16)
    bbox = draw.textbbox((0, 0), "🏆", font=trophy_font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - 2), "🏆", fill=BG, font=trophy_font)


def create_post_launch() -> Path:
    """1080x1350 launch announcement post."""
    size = (1080, 1350)
    img = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(img)

    # Background gradient glow behind bracket
    add_radial_gradient(draw, size, "#18140b", BG, 900)

    cx, cy = size[0] // 2, 620
    radius = 380
    draw_bracket_illustration(draw, cx, cy, radius)

    # Top label
    label = "FIFA WORLD CUP KNOCKOUT ARCHIVE"
    label_font = font_body_medium(26)
    bbox = draw.textbbox((0, 0), label, font=label_font)
    lw = bbox[2] - bbox[0]
    draw.text(((size[0] - lw) // 2, 110), label, fill=MUTED, font=label_font)

    # Title
    title = "The Road to Glory"
    title_font = font_display(92)
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((size[0] - tw) // 2, 160), title, fill=TEXT, font=title_font)

    # Subtitle
    subtitle = "Every knockout bracket since 1930, drawn as one"
    subtitle2 = "interactive radial bracket from the Round of 16 to the final."
    sub_font = font_body(34)
    for i, line in enumerate([subtitle, subtitle2]):
        bbox = draw.textbbox((0, 0), line, font=sub_font)
        w = bbox[2] - bbox[0]
        draw.text(((size[0] - w) // 2, 1060 + i * 54), line, fill=MUTED, font=sub_font)

    # URL pill
    url = "worldcuparchive.net"
    url_font = font_body_bold(32)
    bbox = draw.textbbox((0, 0), url, font=url_font)
    uw = bbox[2] - bbox[0]
    uh = bbox[3] - bbox[1]
    pill_w, pill_h = uw + 72, uh + 38
    pill_x = (size[0] - pill_w) // 2
    pill_y = 1210
    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill=GOLD,
    )
    draw.text((pill_x + 36, pill_y + 14), url, fill=BG, font=url_font)

    path = OUT_DIR / "post-01-launch.png"
    img.save(path, "PNG", optimize=True)
    return path


def create_post_facts() -> Path:
    """1080x1350 fun-facts carousel post."""
    size = (1080, 1350)
    img = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(img)

    add_radial_gradient(draw, size, "#18140b", BG, 900)

    # Header
    header = "WORLD CUP BY THE NUMBERS"
    header_font = font_body_medium(26)
    bbox = draw.textbbox((0, 0), header, font=header_font)
    hw = bbox[2] - bbox[0]
    draw.text(((size[0] - hw) // 2, 110), header, fill=MUTED, font=header_font)

    title = "The Road to Glory"
    title_font = font_display(72)
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((size[0] - tw) // 2, 160), title, fill=TEXT, font=title_font)

    # Stat cards
    stats = [
        ("22", "tournaments", "1930 — 2026"),
        ("8", "different", "champions"),
        ("5", "titles each", "Brazil 🇧🇷"),
        ("1", "live bracket", "2026"),
    ]

    card_w, card_h = 430, 260
    gap_x, gap_y = 60, 60
    start_x = (size[0] - (card_w * 2 + gap_x)) // 2
    start_y = 320

    for i, (big, label, sub) in enumerate(stats):
        row, col = divmod(i, 2)
        x = start_x + col * (card_w + gap_x)
        y = start_y + row * (card_h + gap_y)

        # Card background
        draw.rounded_rectangle(
            [x, y, x + card_w, y + card_h],
            radius=28,
            fill=PANEL,
            outline=LINE,
            width=2,
        )

        # Big number
        big_font = font_display(96)
        bbox = draw.textbbox((0, 0), big, font=big_font)
        bw = bbox[2] - bbox[0]
        draw.text((x + (card_w - bw) // 2, y + 30), big, fill=GOLD, font=big_font)

        # Label
        label_font = font_body_bold(34)
        bbox = draw.textbbox((0, 0), label, font=label_font)
        lw = bbox[2] - bbox[0]
        draw.text((x + (card_w - lw) // 2, y + 140), label, fill=TEXT, font=label_font)

        # Sub
        sub_font = font_body(26)
        bbox = draw.textbbox((0, 0), sub, font=sub_font)
        sw = bbox[2] - bbox[0]
        draw.text((x + (card_w - sw) // 2, y + 190), sub, fill=MUTED, font=sub_font)

    # Footer
    footer = "Explore every goal, card & substitution at"
    footer2 = "worldcuparchive.net"
    f_font = font_body(28)
    f2_font = font_body_bold(28)
    bbox = draw.textbbox((0, 0), footer, font=f_font)
    fw = bbox[2] - bbox[0]
    draw.text(((size[0] - fw) // 2, 1180), footer, fill=MUTED, font=f_font)
    bbox = draw.textbbox((0, 0), footer2, font=f2_font)
    fw = bbox[2] - bbox[0]
    draw.text(((size[0] - fw) // 2, 1225), footer2, fill=GOLD, font=f2_font)

    path = OUT_DIR / "post-02-facts.png"
    img.save(path, "PNG", optimize=True)
    return path


def create_story_launch() -> Path:
    """1080x1920 story announcement."""
    size = (1080, 1920)
    img = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(img)

    add_radial_gradient(draw, size, "#18140b", BG, 1200)

    # Bracket illustration higher up
    cx, cy = size[0] // 2, 820
    radius = 420
    draw_bracket_illustration(draw, cx, cy, radius)

    # Top label
    label = "NEW PROJECT"
    label_font = font_body_medium(30)
    bbox = draw.textbbox((0, 0), label, font=label_font)
    lw = bbox[2] - bbox[0]
    draw.text(((size[0] - lw) // 2, 140), label, fill=MUTED, font=label_font)

    # Title
    title = "The Road to Glory"
    title_font = font_display(86)
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((size[0] - tw) // 2, 200), title, fill=TEXT, font=title_font)

    # Subtitle
    subtitle = "Every World Cup knockout bracket"
    subtitle2 = "since 1930 — one radial map."
    sub_font = font_body(40)
    for i, line in enumerate([subtitle, subtitle2]):
        bbox = draw.textbbox((0, 0), line, font=sub_font)
        w = bbox[2] - bbox[0]
        draw.text(((size[0] - w) // 2, 1380 + i * 60), line, fill=MUTED, font=sub_font)

    # URL pill
    url = "worldcuparchive.net"
    url_font = font_body_bold(38)
    bbox = draw.textbbox((0, 0), url, font=url_font)
    uw = bbox[2] - bbox[0]
    uh = bbox[3] - bbox[1]
    pill_w, pill_h = uw + 84, uh + 46
    pill_x = (size[0] - pill_w) // 2
    pill_y = 1560
    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill=GOLD,
    )
    draw.text((pill_x + 42, pill_y + 18), url, fill=BG, font=url_font)

    # Small helper text
    hint = "Tap the link in bio to explore"
    hint_font = font_body(28)
    bbox = draw.textbbox((0, 0), hint, font=hint_font)
    hw = bbox[2] - bbox[0]
    draw.text(((size[0] - hw) // 2, 1660), hint, fill=MUTED, font=hint_font)

    path = OUT_DIR / "story-01-launch.png"
    img.save(path, "PNG", optimize=True)
    return path


def create_captions() -> Path:
    """Write captions and hashtag sets."""
    content = """# Instagram Content Pack — The Road to Glory

## Post 01 — Launch announcement
**Image:** `post-01-launch.png`

**Caption:**
Every FIFA World Cup knockout stage since 1930, drawn as one interactive radial bracket. 🏆⚽

From the first Round of 16 to the final whistle, explore every goal, card, substitution and penalty shootout across nearly 100 years of World Cup history.

Built for football fans, by a football fan.

🔗 worldcuparchive.net

—

**Hashtags:**
#WorldCup #FIFAWorldCup #FootballHistory #Soccer #WorldCup2026 #FootballData #DataVisualization #SportsDesign #RoadToGlory #WorldCupArchive

---

## Post 02 — By the numbers
**Image:** `post-02-facts.png`

**Caption:**
22 tournaments. 8 different champions. 1 live 2026 bracket.

Brazil still leads the pack with 5 titles, but the next chapter is being written right now.

Swipe the stats, then dive into the full interactive archive. 🏆📊

🔗 worldcuparchive.net

—

**Hashtags:**
#WorldCupStats #FootballFacts #WorldCupHistory #Brazil #FIFAWorldCup #SportsStats #WorldCup2026 #FootballTrivia #DataViz #RoadToGlory

---

## Story 01 — Launch
**Image:** `story-01-launch.png`

**Sticker suggestions:**
- "Link" sticker → worldcuparchive.net
- "Poll" sticker → "Which nation wins 2026?"
- "Countdown" sticker → next World Cup match day

---

## Optional follow-up ideas
1. **Champions carousel** — one slide per winner (1930 → 2022) with year, host, final score.
2. **Record breakers** — all-time top scorers, most appearances, biggest upsets.
3. **2026 live updates** — screenshot the current bracket and post after each match day.
4. **Behind the build** — how the radial SVG bracket is drawn / the data pipeline.
"""
    path = OUT_DIR / "captions.md"
    path.write_text(content, encoding="utf-8")
    return path


def main() -> None:
    paths = [
        create_post_launch(),
        create_post_facts(),
        create_story_launch(),
        create_captions(),
    ]
    for p in paths:
        print(f"Created: {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
