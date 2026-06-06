"""
Generate Marketing_Plan_2026_Presentation.pdf
9 slides · 16:9 landscape · Navy + Gold brand colors
"""
from reportlab.lib.pagesizes import landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from PIL import Image as PILImage

# ============================================================
# CONFIG
# ============================================================
W, H = 1920, 1080  # 16:9 landscape
PAGE = (W, H)
OUT = r"C:\Users\ifat\Documents\Absolute_Consultancy_FINAL\Marketing\Marketing_Plan_2026_Presentation.pdf"
IMG_DIR = r"C:\Users\ifat\Documents\Absolute_Consultancy_FINAL\public\images"

# Brand palette (navy + gold to match site)
NAVY = HexColor("#0B1E42")
NAVY_DARK = HexColor("#081633")
GOLD = HexColor("#C9A234")
GOLD_LIGHT = HexColor("#E0BD55")
CREAM = HexColor("#F5EFE0")
WHITE = HexColor("#FFFFFF")
GREY = HexColor("#7A7A7A")
GREY_LIGHT = HexColor("#E8E8E8")
DARK_TEXT = HexColor("#1A1A1A")

# Fonts
pdfmetrics.registerFont(TTFont("Bold", r"C:\Windows\Fonts\arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Reg", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("Light", r"C:\Windows\Fonts\arial.ttf"))  # fallback
FONT_BOLD = "Bold"
FONT_REG = "Reg"

# ============================================================
# HELPERS
# ============================================================
def img_path(name):
    p = os.path.join(IMG_DIR, name)
    return p if os.path.exists(p) else None

def draw_image_cover(c, path, x, y, w, h):
    """Draw image cropped to fill w x h."""
    if not path or not os.path.exists(path):
        c.setFillColor(NAVY)
        c.rect(x, y, w, h, fill=1, stroke=0)
        return
    try:
        im = PILImage.open(path)
        iw, ih = im.size
        ratio = max(w / iw, h / ih)
        new_w, new_h = iw * ratio, ih * ratio
        ox = x - (new_w - w) / 2
        oy = y - (new_h - h) / 2
        c.drawImage(path, ox, oy, new_w, new_h, mask='auto', preserveAspectRatio=False)
    except Exception as e:
        print(f"img err: {e}")
        c.setFillColor(NAVY)
        c.rect(x, y, w, h, fill=1, stroke=0)

def text(c, s, x, y, size=18, color=DARK_TEXT, font=FONT_REG, align="left"):
    c.setFillColor(color)
    c.setFont(font, size)
    if align == "center":
        c.drawCentredString(x, y, s)
    elif align == "right":
        c.drawRightString(x, y, s)
    else:
        c.drawString(x, y, s)

def wrapped_text(c, s, x, y, w, size=18, color=DARK_TEXT, font=FONT_REG, leading_mult=1.4):
    """Naive word-wrap."""
    c.setFillColor(color)
    c.setFont(font, size)
    leading = size * leading_mult
    words = s.split()
    line = ""
    cy = y
    for w_ in words:
        test = (line + " " + w_).strip()
        if c.stringWidth(test, font, size) <= w:
            line = test
        else:
            c.drawString(x, cy, line)
            cy -= leading
            line = w_
    if line:
        c.drawString(x, cy, line)

def header_strip(c):
    """Top logo bar on every slide (except cover if full-bleed)."""
    c.setFillColor(NAVY)
    c.rect(0, H - 40, W, 40, fill=1, stroke=0)
    # Logo mark
    c.setFillColor(GOLD)
    c.rect(40, H - 32, 22, 22, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 12)
    c.drawCentredString(51, H - 26, "AC")
    # Wordmark
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 13)
    c.drawString(72, H - 26, "ABSOLUTE CONSULTANCY")
    c.setFillColor(GOLD)
    c.setFont(FONT_REG, 11)
    c.drawRightString(W - 40, H - 26, "Marketing Plan 2026  ·  Study in Malaysia")

def footer_strip(c, page_no, total=9):
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 11)
    c.drawString(40, 24, "absoluteconsultancyfirm.com  ·  +60 17-563 1621  ·  youtube.com/@absoluteconsultancy")
    c.drawRightString(W - 40, 24, f"{page_no} / {total}")

def slide_bg(c, dark=False):
    c.setFillColor(NAVY if dark else CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def section_label(c, s, x, y, color=GOLD):
    """Small-caps accent label."""
    c.setFillColor(color)
    c.setFont(FONT_BOLD, 14)
    c.drawString(x, y, s.upper())

def gold_underline(c, x, y, w=80, h=4):
    c.setFillColor(GOLD)
    c.rect(x, y, w, h, fill=1, stroke=0)

def numbered_circle(c, n, x, y, r=42, color=GOLD, text_color=NAVY):
    c.setFillColor(color)
    c.circle(x, y, r, fill=1, stroke=0)
    c.setFillColor(text_color)
    c.setFont(FONT_BOLD, 28)
    c.drawCentredString(x, y - 10, str(n).zfill(2))

# ============================================================
# SLIDE 1 — COVER
# ============================================================
def slide1_cover(c):
    # Full navy bg
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Right side campus image
    draw_image_cover(c, img_path("hero-bg.jpg"), W * 0.45, 0, W * 0.55, H)
    # Dark overlay on image
    c.setFillColor(Color(0.04, 0.05, 0.15, alpha=0.35))
    c.rect(W * 0.45, 0, W * 0.55, H, fill=1, stroke=0)
    # Top strip
    header_strip(c)
    # Gold accent block top-left
    c.setFillColor(GOLD)
    c.rect(120, H - 220, 6, 110, fill=1, stroke=0)
    # Eyebrow
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 18)
    c.drawString(150, H - 170, "MARKETING PLAN · JUNE 2026")
    # Main title
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 96)
    c.drawString(150, H - 300, "STUDY IN")
    c.setFillColor(GOLD)
    c.drawString(150, H - 400, "MALAYSIA")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 96)
    c.drawString(150, H - 500, "2026.")
    # Subtitle
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 24)
    c.drawString(150, H - 580, "30+ Partner Universities  ·  99% Visa Approval  ·  300+ Students Placed")
    # Body paragraph
    wrapped_text(c,
        "A 90-day digital growth plan for Absolute Consultancy Firm — "
        "a 6-service, 30+ university education consultancy helping students "
        "from Bangladesh, India, Nepal, Pakistan, Nigeria and beyond get into "
        "Malaysia's top QS-ranked institutions.",
        150, H - 660, 900, size=20, color=CREAM, leading_mult=1.5)
    # CTA button
    c.setFillColor(GOLD)
    c.roundRect(150, 220, 280, 64, 32, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(290, 244, "READ THE PLAN  →")
    # Secondary text
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 16)
    c.drawString(150, 170, "absolutecomsultancyfirm.com")
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 12)
    c.drawString(150, 130, "ABSOLUTE CONSULTANCY FIRM")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 12)
    c.drawString(150, 105, "Your Dream. Our Mission.")

# ============================================================
# SLIDE 2 — Business Snapshot
# ============================================================
def slide2_snapshot(c):
    slide_bg(c, dark=True)
    # Left text panel
    c.setFillColor(NAVY_DARK)
    c.rect(0, 0, W * 0.42, H, fill=1, stroke=0)
    # Right side image
    draw_image_cover(c, img_path("contact-bg.jpg"), W * 0.42, 0, W * 0.58, H)
    c.setFillColor(Color(0.04, 0.05, 0.15, alpha=0.55))
    c.rect(W * 0.42, 0, W * 0.58, H, fill=1, stroke=0)
    header_strip(c)
    # Left content
    section_label(c, "01  ·  Business Snapshot", 80, H - 130)
    gold_underline(c, 80, H - 145, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 60)
    c.drawString(80, H - 220, "Where Ambition")
    c.drawString(80, H - 290, "Meets Opportunity.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 20)
    c.drawString(80, H - 360, "Malaysia's most-trusted study-abroad partner for")
    c.drawString(80, H - 388, "students from South Asia, Africa, and beyond.")
    # Right side: stat cards
    stats = [
        ("30+", "Partner Universities", "Foundation → PhD"),
        ("99%", "Visa Approval Rate", "Documented, end-to-end"),
        ("300+", "Students Placed", "Across 5+ countries"),
        ("6", "End-to-End Services", "Admissions, visa, SOP & more"),
    ]
    card_x = W * 0.42 + 80
    card_y = H - 200
    card_w = W * 0.58 - 160
    card_h = 130
    for i, (num, lbl, sub) in enumerate(stats):
        y = card_y - i * (card_h + 20)
        c.setFillColor(Color(1, 1, 1, alpha=0.08))
        c.roundRect(card_x, y - card_h, card_w, card_h, 12, fill=1, stroke=0)
        # Big gold number
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 60)
        c.drawString(card_x + 30, y - 70, num)
        # Label
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 22)
        c.drawString(card_x + 220, y - 50, lbl)
        c.setFillColor(CREAM)
        c.setFont(FONT_REG, 16)
        c.drawString(card_x + 220, y - 78, sub)
    # CTA at bottom
    c.setFillColor(GOLD)
    c.roundRect(card_x, 100, 240, 56, 28, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 16)
    c.drawCentredString(card_x + 120, 121, "GET STARTED  →")
    footer_strip(c, 2)

# ============================================================
# SLIDE 3 — 3 Audiences
# ============================================================
def slide3_audiences(c):
    slide_bg(c, dark=False)
    header_strip(c)
    # Section label
    section_label(c, "02  ·  Target Audience", 120, H - 130, color=GOLD)
    gold_underline(c, 120, H - 145, 80)
    # Headline
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 60)
    c.drawString(120, H - 230, "Who We Serve.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 22)
    c.drawString(120, H - 280, "Three audiences. One mission: getting students into their dream university.")
    # 3 columns
    cols = [
        {
            "num": "01",
            "name": "ASPIRING ARISHA",
            "pct": "60%",
            "demographic": "17–22  ·  Bangladesh, India, Nepal, Pakistan, Nigeria",
            "hook": '"Get into a QS-ranked Malaysian university for less than USD 5,000/yr"',
            "channel": "Facebook · Instagram Reels · YouTube Shorts · TikTok"
        },
        {
            "num": "02",
            "name": "PARENT PRAKASH",
            "pct": "25%",
            "demographic": "45–58  ·  Sponsoring child's education",
            "hook": '"99% visa approval · certified counsellors · 300+ students already placed"',
            "channel": "Facebook · WhatsApp groups · YouTube long-form"
        },
        {
            "num": "03",
            "name": "CAREER CHANGER CHEN",
            "pct": "15%",
            "demographic": "25–35  ·  Working in Malaysia",
            "hook": '"Foundation, Diploma, Bachelor, Master, PhD — all study levels"',
            "channel": "LinkedIn · Google search · Email"
        },
    ]
    col_w = (W - 240 - 60) / 3
    col_y = 180
    col_h = 600
    for i, col in enumerate(cols):
        x = 120 + i * (col_w + 30)
        # Card
        c.setFillColor(WHITE)
        c.roundRect(x, col_y, col_w, col_h, 18, fill=1, stroke=0)
        # Top accent strip
        c.setFillColor(GOLD)
        c.roundRect(x, col_y + col_h - 8, col_w, 8, 4, fill=1, stroke=0)
        # Number circle
        numbered_circle(c, int(col["num"]), x + 60, col_y + col_h - 80, r=36, color=GOLD)
        # Percentage badge top-right
        c.setFillColor(GOLD)
        c.roundRect(x + col_w - 100, col_y + col_h - 70, 80, 36, 18, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 16)
        c.drawCentredString(x + col_w - 60, col_y + col_h - 57, col["pct"])
        # Name
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 22)
        c.drawString(x + 30, col_y + col_h - 150, col["name"])
        # Demographic
        c.setFillColor(GREY)
        c.setFont(FONT_REG, 13)
        wrapped_text(c, col["demographic"], x + 30, col_y + col_h - 180, col_w - 60, size=13, color=GREY, leading_mult=1.4)
        # Hook quote
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 14)
        c.drawString(x + 30, col_y + 320, "HOOK")
        c.setFillColor(DARK_TEXT)
        wrapped_text(c, col["hook"], x + 30, col_y + 290, col_w - 60, size=15, color=DARK_TEXT, leading_mult=1.4)
        # Channel divider
        c.setFillColor(GOLD)
        c.rect(x + 30, col_y + 120, 40, 3, fill=1, stroke=0)
        # Channel label
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 12)
        c.drawString(x + 30, col_y + 85, "FOUND ON")
        c.setFillColor(GREY)
        c.setFont(FONT_REG, 12)
        wrapped_text(c, col["channel"], x + 30, col_y + 55, col_w - 60, size=12, color=GREY, leading_mult=1.4)
    footer_strip(c, 3)

# ============================================================
# SLIDE 4 — Channels Overview
# ============================================================
def slide4_channels(c):
    slide_bg(c, dark=True)
    header_strip(c)
    section_label(c, "03  ·  Channel Strategy", 120, H - 130, color=GOLD)
    gold_underline(c, 120, H - 145, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 60)
    c.drawString(120, H - 230, "One Mission. Six Channels.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 22)
    c.drawString(120, H - 280, "Every channel plays a role. Together they compound into a steady lead flow.")
    # 6 channel cards in 3x2 grid
    channels = [
        ("WEBSITE", "absoluteconsultancyfirm.com", "5 SEO pillar pages · 1 blog/week · Live chat · Sitemap & schema"),
        ("FACEBOOK", "Lead-gen #1 channel", "5 posts/wk · Lead-form ads · RM 600/mo · Retargeting"),
        ("YOUTUBE", "@absoluteconsultancy", "1 long-form/wk · 3 Shorts/wk · SEO titles · Blog embeds"),
        ("INSTAGRAM & TIKTOK", "Reach multiplier", "3 Reels/wk · Re-cut YT Shorts · Trending audio · Bangla captions"),
        ("LINKEDIN", "COO as the brand face", "2–3 posts/wk · University partnerships · B2B authority"),
        ("WHATSAPP", "+60 17-563 1621", "Conversion channel · WhatsApp Business · Catalogue + auto-replies"),
    ]
    grid_x = 120
    grid_y = 180
    grid_w = (W - 240 - 60) / 3
    grid_h = 320
    for i, (name, sub, body) in enumerate(channels):
        col = i % 3
        row = i // 3
        x = grid_x + col * (grid_w + 30)
        y = grid_y + (1 - row) * (grid_h + 30) - grid_h
        # Card
        c.setFillColor(Color(1, 1, 1, alpha=0.06))
        c.roundRect(x, y, grid_w, grid_h, 16, fill=1, stroke=0)
        # Top accent
        c.setFillColor(GOLD)
        c.roundRect(x, y + grid_h - 6, grid_w, 6, 3, fill=1, stroke=0)
        # Channel number
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 14)
        c.drawString(x + 24, y + grid_h - 50, f"CHANNEL 0{i+1}")
        # Name
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 24)
        c.drawString(x + 24, y + grid_h - 90, name)
        # Sub
        c.setFillColor(GOLD_LIGHT)
        c.setFont(FONT_REG, 14)
        c.drawString(x + 24, y + grid_h - 120, sub)
        # Divider
        c.setFillColor(GOLD)
        c.rect(x + 24, y + grid_h - 140, 30, 2, fill=1, stroke=0)
        # Body
        c.setFillColor(CREAM)
        wrapped_text(c, body, x + 24, y + grid_h - 175, grid_w - 48, size=14, color=CREAM, leading_mult=1.5)
    footer_strip(c, 4)

# ============================================================
# SLIDE 5 — 90-Day Goal
# ============================================================
def slide5_goal(c):
    slide_bg(c, dark=False)
    header_strip(c)
    section_label(c, "04  ·  90-Day North Star", 120, H - 130, color=GOLD)
    gold_underline(c, 120, H - 145, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 60)
    c.drawString(120, H - 230, "The Goal by Day 90.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 22)
    c.drawString(120, H - 280, "Three numbers. Three months. Compounding growth.")
    # 3 large gold-numbered cards
    goals = [
        ("20", "Qualified consultations / month", "From digital channels", "(currently ~5–10)"),
        ("5,000", "Monthly website visitors", "Organic + social combined", ""),
        ("1,500", "Subscribers across FB + YT", "WhatsApp + email + social", ""),
    ]
    card_w = (W - 240 - 60) / 3
    card_h = 460
    card_y = 200
    for i, (num, lbl, sub, note) in enumerate(goals):
        x = 120 + i * (card_w + 30)
        # Card
        c.setFillColor(NAVY)
        c.roundRect(x, card_y, card_w, card_h, 20, fill=1, stroke=0)
        # Gold top
        c.setFillColor(GOLD)
        c.roundRect(x, card_y + card_h - 10, card_w, 10, 5, fill=1, stroke=0)
        # Big number
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 130)
        c.drawString(x + 30, card_y + card_h - 200, num)
        # Label
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 24)
        wrapped_text(c, lbl, x + 30, card_y + card_h - 250, card_w - 60, size=22, color=WHITE, leading_mult=1.3)
        # Sub
        c.setFillColor(CREAM)
        c.setFont(FONT_REG, 16)
        c.drawString(x + 30, card_y + 80, sub)
        if note:
            c.setFillColor(GOLD_LIGHT)
            c.setFont(FONT_REG, 14)
            c.drawString(x + 30, card_y + 55, note)
        # Divider
        c.setFillColor(GOLD)
        c.rect(x + 30, card_y + 45, 40, 3, fill=1, stroke=0)
    # Bottom KPI strip
    strip_y = 90
    c.setFillColor(NAVY)
    c.roundRect(120, strip_y, W - 240, 60, 30, fill=1, stroke=0)
    kpis = ["1 blog/wk", "1 YT video/wk", "3 Reels/wk", "50+ Google reviews (4.7★)"]
    seg_w = (W - 240) / len(kpis)
    for i, k in enumerate(kpis):
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 16)
        c.drawCentredString(120 + seg_w * (i + 0.5), strip_y + 22, k)
        if i < len(kpis) - 1:
            c.setFillColor(GOLD)
            c.rect(120 + seg_w * (i + 1) - 1, strip_y + 12, 2, 36, fill=1, stroke=0)
    footer_strip(c, 5)

# ============================================================
# SLIDE 6 — Content Calendar
# ============================================================
def slide6_calendar(c):
    slide_bg(c, dark=False)
    header_strip(c)
    section_label(c, "05  ·  Content Calendar", 120, H - 130, color=GOLD)
    gold_underline(c, 120, H - 145, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 60)
    c.drawString(120, H - 230, "What We Publish. Every Week.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 22)
    c.drawString(120, H - 280, "A repeatable rhythm that builds trust and drives action.")
    # 7-row table
    days = [
        ("MON", "Facebook", "Student success story", "Real name, real photo, real outcome"),
        ("TUE", "Blog", "Pillar / cluster article", "SEO long-tail keyword"),
        ("WED", "YouTube", "Long-form video (8–12 min)", "Campus tour / case study / how-to"),
        ("THU", "Reels", "Scholarship / visa tip", "30–60 sec, trending audio"),
        ("FRI", "BTS", "COO at work", "Day-in-the-life, authentic"),
        ("SAT", "Facebook", "Live Q&A", "Real-time engagement"),
        ("SUN", "Email", "Drip to new leads", "5-step automated sequence"),
    ]
    table_x = 120
    table_y = 720
    row_h = 64
    # Header
    cols = [("DAY", 130), ("CHANNEL", 350), ("CONTENT", 700), ("DETAIL", 500)]
    c.setFillColor(NAVY)
    c.rect(table_x, table_y - 40, sum(cw for _, cw in cols), 50, fill=1, stroke=0)
    for label, cw in cols:
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 13)
        c.drawString(table_x + 20, table_y - 25, label)
        table_x += cw
    table_x = 120
    for i, (d, ch, ct, det) in enumerate(days):
        y = table_y - 90 - i * row_h
        # Alternating bg
        c.setFillColor(WHITE if i % 2 == 0 else GREY_LIGHT)
        c.rect(table_x, y, sum(cw for _, cw in cols), row_h, fill=1, stroke=0)
        # Day badge
        c.setFillColor(GOLD)
        c.roundRect(table_x + 12, y + 14, 90, 36, 6, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 16)
        c.drawCentredString(table_x + 57, y + 24, d)
        # Channel
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 16)
        c.drawString(table_x + 130, y + 24, ch)
        # Content
        c.setFillColor(DARK_TEXT)
        c.setFont(FONT_REG, 15)
        c.drawString(table_x + 480, y + 24, ct)
        # Detail
        c.setFillColor(GREY)
        c.setFont(FONT_REG, 13)
        c.drawString(table_x + 1180, y + 26, det)
    # Bottom note
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 16)
    c.drawString(120, 130, "Repurposing rule:  ")
    c.setFillColor(DARK_TEXT)
    c.setFont(FONT_REG, 16)
    c.drawString(290, 130, "Every YouTube long-form becomes 3–5 Reels. Every blog post embeds the matching video.")
    footer_strip(c, 6)

# ============================================================
# SLIDE 7 — Paid Ads & $0 Quick Wins
# ============================================================
def slide7_paid_free(c):
    slide_bg(c, dark=False)
    header_strip(c)
    section_label(c, "06  ·  Ad Budget & Free Wins", 120, H - 130, color=GOLD)
    gold_underline(c, 120, H - 145, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 60)
    c.drawString(120, H - 230, "Spend Smart. Start Free.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 22)
    c.drawString(120, H - 280, "A RM 830/month ad budget pays for itself with one enrollment. And you can start winning today for free.")
    # Two columns
    # LEFT: Paid
    left_x = 120
    left_w = (W - 240 - 40) / 2
    left_y = 200
    left_h = 640
    c.setFillColor(NAVY)
    c.roundRect(left_x, left_y, left_w, left_h, 20, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.roundRect(left_x, left_y + left_h - 10, left_w, 10, 5, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 14)
    c.drawString(left_x + 30, left_y + left_h - 60, "PAID ADS  ·  ~RM 830 / MONTH")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 32)
    c.drawString(left_x + 30, left_y + left_h - 105, "Meta + YouTube + Retarget")
    paid = [
        ("01", "FB / IG Lead Ads", "RM 600", "30 leads @ <RM 25 each"),
        ("02", "YouTube pre-roll", "RM 200", "5k views @ <RM 0.05 each"),
        ("03", "Retargeting", "RM 200", "10 booked calls @ <RM 20 each"),
    ]
    for i, (n, name, amt, kpi) in enumerate(paid):
        y = left_y + left_h - 180 - i * 110
        numbered_circle(c, int(n), left_x + 60, y, r=30, color=GOLD)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 20)
        c.drawString(left_x + 110, y + 8, name)
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 18)
        c.drawString(left_x + 110, y - 18, amt)
        c.setFillColor(CREAM)
        c.setFont(FONT_REG, 14)
        c.drawString(left_x + 200, y - 18, kpi)
    # RIGHT: $0 wins
    right_x = left_x + left_w + 40
    right_w = left_w
    right_y = left_y
    right_h = left_h
    c.setFillColor(WHITE)
    c.roundRect(right_x, right_y, right_w, right_h, 20, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.roundRect(right_x, right_y + right_h - 10, right_w, 10, 5, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 14)
    c.drawString(right_x + 30, right_y + right_h - 60, "$0 QUICK WINS  ·  START TODAY")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 32)
    c.drawString(right_x + 30, right_y + right_h - 105, "Do These Before Monday")
    wins = [
        "Set up WhatsApp Business + auto-greeting",
        "Build 3 reusable Canva templates",
        "Ask every placed student for a 30-sec video",
        "Reply to every FB/IG comment within 1 hour",
        "Add Google review link to WhatsApp auto-msg",
        "Publish 1 blog post this week",
        "Embed every YT video in its matching blog",
        "Submit site to Google Search Console",
    ]
    for i, w_ in enumerate(wins):
        y = right_y + right_h - 170 - i * 48
        c.setFillColor(GOLD)
        c.circle(right_x + 35, y, 12, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 14)
        c.drawCentredString(right_x + 35, y - 5, "✓")
        c.setFillColor(DARK_TEXT)
        c.setFont(FONT_REG, 16)
        c.drawString(right_x + 65, y - 5, w_)
    footer_strip(c, 7)

# ============================================================
# SLIDE 8 — 90-Day Roadmap
# ============================================================
def slide8_roadmap(c):
    slide_bg(c, dark=True)
    header_strip(c)
    section_label(c, "07  ·  90-Day Execution", 120, H - 130, color=GOLD)
    gold_underline(c, 120, H - 145, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 60)
    c.drawString(120, H - 230, "90 Days. Three Phases.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 22)
    c.drawString(120, H - 280, "Foundation → Acceleration → Scale. One phase per month.")
    phases = [
        {
            "month": "MONTH 1",
            "title": "Foundation",
            "items": [
                "WhatsApp Business set up",
                "5 SEO pillar pages drafted",
                "FB lead-magnet ads live",
                "4 YouTube videos published",
                "12 Reels published",
                "Google Business Profile live"
            ]
        },
        {
            "month": "MONTH 2",
            "title": "Acceleration",
            "items": [
                "All pillar pages + clusters live",
                "Email drip sequence active",
                "Retargeting campaigns live",
                "2 alumni ambassadors onboarded",
                "First education fair attended",
                "Weekly content review starts"
            ]
        },
        {
            "month": "MONTH 3",
            "title": "Scale",
            "items": [
                "Page 1 SEO for target keywords",
                "20+ consultations / month",
                "50+ Google reviews (4.7★ avg)",
                "COO LinkedIn > 1,000 followers",
                "Decide: hire content creator?",
                "Re-evaluate ad budget, double winners"
            ]
        },
    ]
    card_w = (W - 240 - 60) / 3
    card_h = 580
    card_y = 180
    for i, phase in enumerate(phases):
        x = 120 + i * (card_w + 30)
        # Card
        c.setFillColor(Color(1, 1, 1, alpha=0.07))
        c.roundRect(x, card_y, card_w, card_h, 20, fill=1, stroke=0)
        # Gold header strip
        c.setFillColor(GOLD)
        c.roundRect(x, card_y + card_h - 80, card_w, 80, 20, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 18)
        c.drawCentredString(x + card_w / 2, card_y + card_h - 35, phase["month"])
        # Title
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 40)
        c.drawCentredString(x + card_w / 2, card_y + card_h - 130, phase["title"])
        # Divider
        c.setFillColor(GOLD)
        c.rect(x + card_w / 2 - 30, card_y + card_h - 155, 60, 3, fill=1, stroke=0)
        # Items
        for j, item in enumerate(phase["items"]):
            y = card_y + card_h - 210 - j * 52
            # Bullet
            c.setFillColor(GOLD)
            c.circle(x + 30, y, 6, fill=1, stroke=0)
            # Text
            c.setFillColor(CREAM)
            c.setFont(FONT_REG, 16)
            c.drawString(x + 50, y - 5, item)
    footer_strip(c, 8)

# ============================================================
# SLIDE 9 — Closing / CTA
# ============================================================
def slide9_closing(c):
    # Navy bg left, image right
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Right image
    draw_image_cover(c, img_path("hero-graduate.png"), W * 0.55, 0, W * 0.45, H)
    c.setFillColor(Color(0.04, 0.05, 0.15, alpha=0.25))
    c.rect(W * 0.55, 0, W * 0.45, H, fill=1, stroke=0)
    header_strip(c)
    # Left content
    section_label(c, "08  ·  Closing", 80, H - 130)
    gold_underline(c, 80, H - 145, 80)
    # Title
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 90)
    c.drawString(80, H - 280, "Your Dream.")
    c.setFillColor(GOLD)
    c.drawString(80, H - 380, "Our Mission.")
    # Subtitle
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 26)
    wrapped_text(c,
        "Let's grow Absolute Consultancy Firm together — "
        "more students placed, more lives changed, "
        "and a brand that parents trust by name.",
        80, H - 460, 1000, size=24, color=CREAM, leading_mult=1.5)
    # Big CTA
    c.setFillColor(GOLD)
    c.roundRect(80, 250, 380, 80, 40, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 22)
    c.drawCentredString(270, 280, "BOOK A FREE CONSULTATION  →")
    # Secondary CTA
    c.setStrokeColor(GOLD)
    c.setFillColor(NAVY)
    c.setLineWidth(2)
    c.roundRect(80, 160, 320, 60, 30, fill=1, stroke=1)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(240, 180, "READ THE FULL PLAN")
    # Contact rows
    c.setFillColor(CREAM)
    c.setFont(FONT_BOLD, 14)
    c.drawString(80, 110, "ABSOLUTE CONSULTANCY FIRM")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 14)
    c.drawString(80, 85, "absoluteconsultancyfirm.com")
    c.drawString(80, 65, "+60 17-563 1621   ·   youtube.com/@absoluteconsultancy   ·   facebook.com/share/18bRc7r8cA")
    c.setFillColor(GOLD)
    c.setFont(FONT_REG, 12)
    c.drawString(80, 40, "Marketing Plan 2026  ·  v1.0  ·  Internal use")
    # Right side floating text over image
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 18)
    c.drawRightString(W - 60, 200, "SPEAK TO OUR COO")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 14)
    c.drawRightString(W - 60, 178, "Certified Education Counsellor")
    c.drawRightString(W - 60, 158, "2+ Years Experience")

# ============================================================
# BUILD
# ============================================================
def main():
    c = canvas.Canvas(OUT, pagesize=PAGE)
    c.setTitle("Absolute Consultancy Firm — Marketing Plan 2026")
    c.setAuthor("Absolute Consultancy Firm")
    c.setSubject("Marketing Plan 2026")
    slide1_cover(c); c.showPage()
    slide2_snapshot(c); c.showPage()
    slide3_audiences(c); c.showPage()
    slide4_channels(c); c.showPage()
    slide5_goal(c); c.showPage()
    slide6_calendar(c); c.showPage()
    slide7_paid_free(c); c.showPage()
    slide8_roadmap(c); c.showPage()
    slide9_closing(c); c.showPage()
    c.save()
    size_kb = os.path.getsize(OUT) / 1024
    print(f"PDF created: {OUT} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    main()
