"""Build a tokyonight-themed certificate-wall collage for the GitHub profile README.

Reads certificate/*.pdf, renders page 1, and composes a 2/2/3 grid with
rounded corners, subtle borders, and per-tile captions, saving the result
to assets/certificates-{dark,light}.png.
"""
import os
import sys

import pymupdf
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CERT_DIR = "certificate"
RENDER_DIR = os.path.join(CERT_DIR, "render")
OUT_DIR = "assets"
os.makedirs(RENDER_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# ---- tokyonight palette (matches the GitHub stats cards) ----
PALETTES = {
    "dark": {
        "bg": (26, 27, 38),
        "panel": (30, 33, 48),
        "border": (65, 72, 104),
        "text": (192, 202, 245),
        "muted": (110, 120, 160),
        "accent": (122, 162, 247),
    },
    "light": {
        "bg": (222, 226, 241),
        "panel": (250, 250, 253),
        "border": (185, 192, 220),
        "text": (55, 65, 110),
        "muted": (125, 135, 170),
        "accent": (60, 90, 200),
    },
}

# ---- order & labels: strongest certs first ----
ITEMS = [
    ("SAP ABAP.pdf", "SAP ABAP", ""),
    ("Golang Certif Waskitho Cito Adiwiguno.pdf", "Go (Golang)", "Great Learning"),
    ("course_certificate (FOR SATISFACKTORY COMPLETION OF COURSE FINAL EXAMP).pdf",
     "Java Fundamentals", "Final Exam · Jan 2023"),
    ("course_certificate(FOR SATISFACTORY COMPLETION OF ALL COURSEWORK).pdf",
     "Java Fundamentals", "Coursework · Jan 2023"),
    ("PIAGAM PENGHARGAAN.pdf", "Piagam Penghargaan", "Award of Recognition"),
    ("Sertifikat Morris - Waskitho Cito Adiwiguno.pdf", "MORRIS IF'23", "HIMATIF ULBI"),
    ("SertifikatKuliahUmum_714220019_WASKITHO CITO ADIWIGUNO.pdf", "Kuliah Umum", "HIMATIF ULBI · 2024"),
]

IMG_H = 440          # certificate image height inside a standard tile
CAP_H = 66           # caption strip height
GUTTER = 22          # gap between tiles
PAD = 26             # outer padding
RADIUS = 20          # corner radius
HEADER_H = 128

FONT_TITLE = None
FONT_CAP = None
FONT_SUB = None
try:
    FONT_TITLE = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 40)
    FONT_CAP = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)
    FONT_SUB = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 21)
except OSError:
    FONT_TITLE = FONT_CAP = FONT_SUB = ImageFont.load_default()


def render_pdf_page1(pdf_path: str, out_png: str, max_px: int = 2000) -> None:
    doc = pymupdf.open(pdf_path)
    page = doc[0]
    zoom = min(2.6, max_px / max(page.rect.width, page.rect.height))
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(out_png)
    doc.close()


def cover_crop(img: Image.Image, w: int, h: int) -> Image.Image:
    """Scale img to cover w×h, then center-crop (biased slightly toward the top)."""
    scale = max(w / img.width, h / img.height)
    nw, nh = round(img.width * scale), round(img.height * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    left = (nw - w) // 2
    top = min(max((nh - h) // 3, 0), max(nh - h, 0))  # bias to upper third
    return img.crop((left, top, left + w, top + h))


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def draw_text_center(draw, cx, y, text, font, fill):
    w = draw.textlength(text, font=font)
    draw.text((cx - w / 2, y), text, font=font, fill=fill)


def build(theme: str) -> str:
    pal = PALETTES[theme]

    # rows: (items, tile image width); big tiles for the first two rows
    big_w = 760
    std_w = 500
    rows = [
        (ITEMS[0:2], big_w),
        (ITEMS[2:4], big_w),
        (ITEMS[4:7], std_w),
    ]

    # per-row tile size: image area + caption strip must equal tile height
    def tile_dims(w, img_h):
        return w, img_h + CAP_H, img_h

    row_specs = [
        (items, *tile_dims(w, 535 if w == big_w else 395))
        for items, w in rows
    ]

    canvas_w = max(tw for _, tw, _, _ in row_specs) * 2 + GUTTER + PAD * 2
    canvas_h = HEADER_H + sum(th for _, _, th, _ in row_specs) + GUTTER * (len(row_specs) - 1) + PAD
    canvas = Image.new("RGB", (canvas_w, canvas_h), pal["bg"])
    draw = ImageDraw.Draw(canvas)

    # header
    draw_text_center(draw, canvas_w / 2, 36, "Certifications & Awards", FONT_TITLE, pal["text"])
    draw.line([(canvas_w / 2 - 46, 94), (canvas_w / 2 + 46, 94)], fill=pal["accent"], width=4)

    y = HEADER_H
    for items, tw, th, ih in row_specs:
        row_w = len(items) * tw + (len(items) - 1) * GUTTER
        x = (canvas_w - row_w) / 2
        for pdf, title, sub in items:
            png = os.path.join(RENDER_DIR, os.path.splitext(pdf)[0] + ".png")
            if not os.path.exists(png):
                render_pdf_page1(os.path.join(CERT_DIR, pdf), png)
            cert = Image.open(png).convert("RGB")

            # tile = cert image + caption strip
            tile = Image.new("RGB", (tw, th), pal["panel"])
            tile.paste(cover_crop(cert, tw, ih), (0, 0))
            td = ImageDraw.Draw(tile)
            if sub:
                draw_text_center(td, tw / 2, ih + 8, title, FONT_CAP, pal["text"])
                draw_text_center(td, tw / 2, ih + 38, sub, FONT_SUB, pal["muted"])
            else:
                draw_text_center(td, tw / 2, ih + 20, title, FONT_CAP, pal["text"])

            # paste with rounded corners, then outline
            mask = rounded_mask((tw, th), RADIUS)
            canvas.paste(tile, (round(x), round(y)), mask)
            draw.rounded_rectangle(
                [x + 1, y + 1, x + tw - 2, y + th - 2],
                radius=RADIUS, outline=pal["border"], width=2,
            )
            x += tw + GUTTER
        y += th + GUTTER

    out = os.path.join(OUT_DIR, f"certificates-{theme}.png")
    canvas.save(out, optimize=True)
    print(f"saved {out}  {canvas.size}")
    return out


if __name__ == "__main__":
    for t in ("dark", "light"):
        build(t)
