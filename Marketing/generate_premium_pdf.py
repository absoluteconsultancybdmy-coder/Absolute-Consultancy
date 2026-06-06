"""
Generate Premium_Presentation.pdf - 15 slides, boardroom-ready.
Based on Premium_Presentation_Upgrade_Plan.md
"""
from reportlab.lib.pagesizes import landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics import renderPDF
import os
from PIL import Image as PILImage

# ============================================================
# CONFIG
# ============================================================
W, H = 1920, 1080
PAGE = (W, H)
OUT = r"C:\Users\ifat\Documents\Absolute_Consultancy_FINAL\Marketing\Premium_Presentation.pdf"
IMG_DIR = r"C:\Users\ifat\Documents\Absolute_Consultancy_FINAL\public\images"

# Brand palette
NAVY = HexColor("#0B1E42")
NAVY_DARK = HexColor("#081633")
NAVY_LIGHT = HexColor("#1A2D5A")
GOLD = HexColor("#C9A234")
GOLD_LIGHT = HexColor("#E0BD55")
GOLD_DARK = HexColor("#A8851F")
LIME = HexColor("#D4F87A")
CREAM = HexColor("#F5EFE0")
CREAM_DOT = HexColor("#E6DEC9")
WHITE = HexColor("#FFFFFF")
CHARCOAL = HexColor("#1A1A1A")
GREY = HexColor("#7A7A7A")
GREY_LIGHT = HexColor("#E8E8E8")
GREEN = HexColor("#2D7A4F")
NAVY_DOT = HexColor("#1A2D5A")

# Fonts - Calibri (cleaner than Arial)
pdfmetrics.registerFont(TTFont("Bold", r"C:\Windows\Fonts\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Reg", r"C:\Windows\Fonts\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Light", r"C:\Windows\Fonts\calibril.ttf"))
pdfmetrics.registerFont(TTFont("BoldItalic", r"C:\Windows\Fonts\calibriz.ttf"))
FONT_BOLD = "Bold"
FONT_REG = "Reg"
FONT_LIGHT = "Light"
FONT_BI = "BoldItalic"

# ============================================================
# HELPERS
# ============================================================
def img_path(name):
    p = os.path.join(IMG_DIR, name)
    return p if os.path.exists(p) else None

def draw_image_cover(c, path, x, y, w, h):
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

def text(c, s, x, y, size=18, color=CHARCOAL, font=FONT_REG, align="left"):
    c.setFillColor(color)
    c.setFont(font, size)
    if align == "center":
        c.drawCentredString(x, y, s)
    elif align == "right":
        c.drawRightString(x, y, s)
    else:
        c.drawString(x, y, s)

def wrapped(c, s, x, y, w, size=18, color=CHARCOAL, font=FONT_REG, leading_mult=1.4):
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

def header_strip(c, page_no=None, total=15, dark=False):
    """Top logo bar."""
    c.setFillColor(NAVY)
    c.rect(0, H - 36, W, 36, fill=1, stroke=0)
    # Logo mark
    c.setFillColor(GOLD)
    c.roundRect(40, H - 28, 20, 20, 3, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 10)
    c.drawCentredString(50, H - 23, "AC")
    # Wordmark
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(68, H - 22, "ABSOLUTE CONSULTANCY")
    c.setFillColor(GOLD_LIGHT)
    c.setFont(FONT_REG, 10)
    c.drawRightString(W - 40, H - 22, "Marketing Plan 2026  ·  Premium Presentation")
    if page_no:
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 10)
        c.drawString(W - 50, H - 22, f"  ·  {page_no:02d}")

def footer_strip(c, page_no, total=15, dark=False):
    c.setFillColor(GREY if not dark else Color(1,1,1, alpha=0.4))
    c.setFont(FONT_REG, 10)
    c.drawString(40, 22, "absoluteconsultancyfirm.com  ·  +60 17-563 1621  ·  youtube.com/@absoluteconsultancy")
    c.drawRightString(W - 40, 22, f"{page_no:02d} / {total:02d}")

def bg(c, color):
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def add_pattern(c, dot_color, spacing=90, radius=1.0):
    """Subtle dot pattern overlay on top of existing bg."""
    c.setFillColor(dot_color)
    y = spacing / 2
    row = 0
    while y < H:
        x = spacing / 2 + (spacing / 2 if row % 2 else 0)
        while x < W:
            c.circle(x, y, radius, fill=1, stroke=0)
            x += spacing
        y += spacing
        row += 1

def section_label(c, s, x, y, color=GOLD):
    c.setFillColor(color)
    c.setFont(FONT_BOLD, 13)
    c.drawString(x, y, s.upper())

def gold_underline(c, x, y, w=80, h=3):
    c.setFillColor(GOLD)
    c.rect(x, y, w, h, fill=1, stroke=0)

# ============================================================
# SLIDE 1 - COVER
# ============================================================
def slide1(c):
    bg(c, NAVY)
    add_pattern(c, NAVY_LIGHT)
    draw_image_cover(c, img_path("hero-bg.jpg"), W * 0.50, 0, W * 0.50, H)
    c.setFillColor(Color(0.04, 0.05, 0.15, alpha=0.55))
    c.rect(W * 0.50, 0, W * 0.50, H, fill=1, stroke=0)
    header_strip(c)
    # Gold accent block
    c.setFillColor(GOLD)
    c.rect(120, H - 220, 6, 90, fill=1, stroke=0)
    # Eyebrow
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 16)
    c.drawString(150, H - 200, "MARKETING PLAN  ·  JUNE 2026  ·  v2.0")
    # Display title - better vertical rhythm
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 100)
    c.drawString(150, H - 320, "STUDY IN")
    c.setFillColor(GOLD)
    c.drawString(150, H - 420, "MALAYSIA")
    c.setFillColor(WHITE)
    c.drawString(150, H - 520, "2026.")
    # Subtitle line
    c.setFillColor(CREAM)
    c.setFont(FONT_BOLD, 22)
    c.drawString(150, H - 590, "30+ Partner Universities  ·  99% Visa Approval  ·  300+ Students Placed")
    # Body
    wrapped(c,
        "A 15-slide premium boardroom presentation for Absolute Consultancy Firm — "
        "the 6-service education consultancy helping students from South Asia, "
        "Africa, and beyond get into Malaysia's top QS-ranked institutions.",
        150, H - 680, 880, size=20, color=CREAM, leading_mult=1.5)
    # Big primary CTA
    c.setFillColor(GOLD)
    c.roundRect(150, 240, 320, 70, 35, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(310, 266, "READ THE PLAN  →")
    # Secondary outline
    c.setStrokeColor(GOLD)
    c.setFillColor(NAVY)
    c.setLineWidth(2)
    c.roundRect(150, 150, 320, 60, 30, fill=1, stroke=1)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 16)
    c.drawCentredString(310, 172, "VIEW THE EXEC SUMMARY")
    # Bottom branding
    c.setFillColor(CREAM)
    c.setFont(FONT_BOLD, 11)
    c.drawString(150, 100, "ABSOLUTE CONSULTANCY FIRM")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 11)
    c.drawString(150, 80, "Your Dream. Our Mission.")
    c.setFillColor(GOLD)
    c.setFont(FONT_REG, 10)
    c.drawString(150, 60, "absoluteconsultancyfirm.com")
    # Right side floating content
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 20)
    c.drawRightString(W - 80, 240, "KAZI MAHIR MUHTASIB")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 14)
    c.drawRightString(W - 80, 215, "COO & Co-Founder")
    c.setFillColor(GOLD)
    c.setFont(FONT_REG, 12)
    c.drawRightString(W - 80, 195, "Certified Education Counsellor")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 12)
    c.drawRightString(W - 80, 175, "2+ Years Experience")

# ============================================================
# SLIDE 2 - EXECUTIVE SUMMARY
# ============================================================
def slide2(c):
    bg(c, CREAM)
    add_pattern(c, CREAM_DOT)
    header_strip(c)
    # Section label
    section_label(c, "01  ·  Executive Summary", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    # Big headline
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 56)
    c.drawString(100, H - 200, "From 5 Consultations")
    c.setFillColor(GOLD_DARK)
    c.drawString(100, H - 260, "to 20+ per Month.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 310, "A 90-day digital growth plan to multiply lead flow without increasing headcount.")
    # Left column - The Story
    c.setFillColor(NAVY)
    c.roundRect(100, 360, 800, 320, 16, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.roundRect(100, 360 + 320 - 8, 800, 8, 4, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 360 + 320 - 50, "THE STORY")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 26)
    c.drawString(130, 360 + 320 - 95, "Help more students.")
    c.drawString(130, 360 + 320 - 130, "Without burning out the COO.")
    wrapped(c,
        "We help students from Bangladesh, India, Nepal, Nigeria and beyond get into 30+ "
        "Malaysian universities. Today we rely on a single channel (WhatsApp) and one person "
        "(the COO). We have 30+ partner universities, a 99% visa approval rate, and 300+ "
        "students placed. But our growth is bottlenecked by manual, one-at-a-time outreach. "
        "This plan fixes that by adding five more digital channels — turning one student's "
        "journey into a repeatable system that serves hundreds at a time.",
        130, 360 + 320 - 175, 740, size=15, color=CREAM, leading_mult=1.5)
    # Right column - 4 key numbers stacked
    stats = [
        ("20+", "consultations / month", "by Day 90"),
        ("RM 830", "monthly ad budget", "self-funding"),
        ("6", "digital channels", "live by Month 1"),
        ("30+", "partner universities", "Foundation → PhD"),
    ]
    box_x = 940
    box_w = W - box_x - 100
    box_h = 75
    for i, (n, lbl, sub) in enumerate(stats):
        y = 360 + 320 - 40 - i * (box_h + 8)
        c.setFillColor(WHITE)
        c.roundRect(box_x, y, box_w, box_h, 8, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(box_x, y, 6, box_h, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 28)
        c.drawString(box_x + 24, y + 25, n)
        c.setFillColor(CHARCOAL)
        c.setFont(FONT_BOLD, 14)
        c.drawString(box_x + 200, y + 35, lbl)
        c.setFillColor(GREY)
        c.setFont(FONT_REG, 12)
        c.drawString(box_x + 200, y + 16, sub)
    # Bottom band
    c.setFillColor(NAVY)
    c.roundRect(100, 180, W - 200, 140, 16, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 295, "BOTTOM LINE")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 30)
    c.drawString(130, 250, "Six channels. One engine.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 18)
    c.drawString(130, 215, "90 days. Self-funding from the first month.")
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 16)
    c.drawRightString(W - 130, 215, "→")
    footer_strip(c, 2)

# ============================================================
# SLIDE 3 - THE OPPORTUNITY
# ============================================================
def slide3(c):
    bg(c, CREAM)
    add_pattern(c, CREAM_DOT)
    header_strip(c)
    section_label(c, "02  ·  The Opportunity", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 56)
    c.drawString(100, H - 200, "A 1.8M-Student Market.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "And Malaysia captures less than 2% of it.")
    # 3 big stat cards
    cards = [
        ("USD 4.5B", "sent abroad by Bangladeshi\nand Indian students in 2024", "World Bank data"),
        ("18% YoY", "growth in study-in-\nMalaysia demand", "UNESCO estimate"),
        ("< 2%", "of that demand\nMalaysia captures today", "Industry estimate"),
    ]
    card_w = (W - 200 - 40) / 3
    card_h = 340
    card_y = 460
    for i, (n, lbl, src) in enumerate(cards):
        x = 100 + i * (card_w + 20)
        c.setFillColor(WHITE)
        c.roundRect(x, card_y, card_w, card_h, 16, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.roundRect(x, card_y + card_h - 10, card_w, 10, 5, fill=1, stroke=0)
        # Big number
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 64)
        c.drawString(x + 30, card_y + card_h - 130, n)
        # Label
        c.setFillColor(CHARCOAL)
        c.setFont(FONT_BOLD, 16)
        for j, line in enumerate(lbl.split('\n')):
            c.drawString(x + 30, card_y + card_h - 175 - j * 24, line)
        # Source
        c.setFillColor(GREY)
        c.setFont(FONT_REG, 11)
        c.drawString(x + 30, card_y + 25, f"Source: {src}")
    # The opportunity statement
    c.setFillColor(NAVY)
    c.roundRect(100, 200, W - 200, 180, 16, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 350, "OUR AMBITION")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 32)
    c.drawString(130, 300, "Grow Malaysia's share from 2% to 5% by 2028.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 17)
    c.drawString(130, 250, "That means ~3,000 more students placed across our 30+ partner universities.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 17)
    c.drawString(130, 225, "The first 90 days of this plan move us from 5 to 20+ consultations per month.")
    footer_strip(c, 3)

# ============================================================
# SLIDE 4 - WHERE WE ARE TODAY
# ============================================================
def slide4(c):
    bg(c, NAVY)
    add_pattern(c, NAVY_LIGHT)
    header_strip(c)
    # Image right
    draw_image_cover(c, img_path("contact-bg.jpg"), W * 0.50, 0, W * 0.50, H)
    c.setFillColor(Color(0.04, 0.05, 0.15, alpha=0.55))
    c.rect(W * 0.50, 0, W * 0.50, H, fill=1, stroke=0)
    # Left content
    section_label(c, "03  ·  Where We Are Today", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 52)
    c.drawString(100, H - 195, "Strong Foundation.")
    c.setFillColor(GOLD)
    c.drawString(100, H - 252, "One Bottleneck.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 18)
    c.drawString(100, H - 305, "We have the network and the proof. We don't yet have the system.")
    # Right: 4 big number cards
    stats = [
        ("30+", "Partner Universities", "Taylor's, Sunway, Monash, MMU,\nAPU, UCSI, INTI, SEGi, UoC, HELP…", GOLD),
        ("99%", "Visa Approval Rate", "Documented end-to-end.", GOLD),
        ("300+", "Students Placed", "Across 5+ countries.", GOLD),
        ("6", "Services, End-to-End", "Admissions · Visa · SOP\nScholarships · Accommodation · Pre-Departure", GOLD),
    ]
    box_x = W * 0.50 + 60
    box_w = W - box_x - 80
    box_h = 145
    for i, (n, lbl, sub, color) in enumerate(stats):
        y = H - 180 - i * (box_h + 16)
        c.setFillColor(Color(1, 1, 1, alpha=0.07))
        c.roundRect(box_x, y - box_h, box_w, box_h, 12, fill=1, stroke=0)
        # Big number
        c.setFillColor(color)
        c.setFont(FONT_BOLD, 60)
        c.drawString(box_x + 20, y - box_h + 50, n)
        # Label
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 20)
        c.drawString(box_x + 220, y - 40, lbl)
        # Sub
        c.setFillColor(CREAM)
        c.setFont(FONT_REG, 14)
        for j, line in enumerate(sub.split('\n')):
            c.drawString(box_x + 220, y - 70 - j * 22, line)
    # Bottom strip on left
    c.setFillColor(GOLD)
    c.roundRect(100, 200, 720, 100, 12, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 14)
    c.drawString(130, 270, "THE BOTTLENECK")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 20)
    c.drawString(130, 230, "One channel. One person. No system.")
    footer_strip(c, 4, dark=True)

# ============================================================
# SLIDE 5 - THE PROBLEM
# ============================================================
def slide5(c):
    bg(c, CREAM)
    add_pattern(c, CREAM_DOT)
    header_strip(c)
    section_label(c, "04  ·  The Problem", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 56)
    c.drawString(100, H - 200, "We Can't Scale Like This.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 255, "Every new student is a cold start. The COO's phone is our entire pipeline.")
    # 4 problem cards
    problems = [
        ("1", "Single channel", "WhatsApp is our only acquisition channel. One person offline = no leads.", "🔒"),
        ("2", "No SEO presence", "Students searching 'study in Malaysia for Bangladeshi students' don't find us.", "🔍"),
        ("3", "No video library", "Our 5 YouTube videos sit unused. Campus tours, testimonials, SOP tips — gone.", "🎥"),
        ("4", "No email list", "We have no way to re-engage the 90% of inquirers who don't enroll on day one.", "📧"),
    ]
    card_w = (W - 200 - 60) / 4
    card_h = 480
    card_y = 380
    for i, (n, title, body, icon) in enumerate(problems):
        x = 100 + i * (card_w + 20)
        c.setFillColor(WHITE)
        c.roundRect(x, card_y, card_w, card_h, 16, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.roundRect(x, card_y + card_h - 8, card_w, 8, 4, fill=1, stroke=0)
        # Decorative badge (top-right corner)
        c.setFillColor(GOLD)
        c.circle(x + card_w - 50, card_y + card_h - 50, 28, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 14)
        c.drawCentredString(x + card_w - 50, card_y + card_h - 56, f"0{n}")
        # Big number
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 80)
        c.drawString(x + 24, card_y + card_h - 130, n)
        # Title
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 22)
        c.drawString(x + 24, card_y + card_h - 180, title)
        # Divider
        c.setFillColor(GOLD)
        c.rect(x + 24, card_y + card_h - 200, 30, 3, fill=1, stroke=0)
        # Body
        c.setFillColor(CHARCOAL)
        wrapped(c, body, x + 24, card_y + card_h - 230, card_w - 48, size=15, leading_mult=1.5)
    # Consequence
    c.setFillColor(NAVY)
    c.roundRect(100, 180, W - 200, 140, 16, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 290, "THE COST")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 28)
    c.drawString(130, 240, "We are winning on trust. Losing on reach.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 16)
    c.drawString(130, 210, "Every competitor adding 6 channels is pulling students we should be serving.")
    footer_strip(c, 5)

# ============================================================
# SLIDE 6 - THE PLAN OVERVIEW
# ============================================================
def slide6(c):
    bg(c, NAVY)
    add_pattern(c, NAVY_LIGHT)
    header_strip(c)
    section_label(c, "05  ·  The Plan", 100, H - 110, color=GOLD)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 60)
    c.drawString(100, H - 205, "Six Channels. One Engine.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 22)
    c.drawString(100, H - 260, "Each channel plays a role. Together they compound into a steady lead flow.")
    # Center diagram
    cx, cy = W // 2, 560
    r = 110
    # Center circle
    c.setFillColor(GOLD)
    c.circle(cx, cy, r, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 22)
    c.drawCentredString(cx, cy + 8, "STUDENT")
    c.setFont(FONT_REG, 13)
    c.drawCentredString(cx, cy - 15, "Application")
    # 6 outer circles
    import math
    channels = [
        ("WEBSITE", "absoluteconsultancyfirm.com", 0),
        ("FACEBOOK", "Lead-gen #1", 1),
        ("YOUTUBE", "Long-form + Shorts", 2),
        ("INSTAGRAM", "Reels & TikTok", 3),
        ("LINKEDIN", "COO as face", 4),
        ("WHATSAPP", "+60 17-563 1621", 5),
    ]
    outer_r = 220
    for i, (name, sub, idx) in enumerate(channels):
        angle = math.pi / 2 - (2 * math.pi * idx / 6)
        x = cx + outer_r * math.cos(angle)
        y = cy + outer_r * math.sin(angle)
        # Line
        c.setStrokeColor(GOLD)
        c.setLineWidth(2)
        c.line(cx + r * math.cos(angle), cy + r * math.sin(angle), x, y)
        # Circle
        c.setFillColor(NAVY_LIGHT)
        c.setStrokeColor(GOLD)
        c.setLineWidth(2)
        c.circle(x, y, 60, fill=1, stroke=1)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 13)
        c.drawCentredString(x, y + 8, name)
        c.setFillColor(GOLD_LIGHT)
        c.setFont(FONT_REG, 10)
        c.drawCentredString(x, y - 12, sub)
    # Bottom strip
    c.setFillColor(GOLD)
    c.roundRect(100, 120, W - 200, 90, 12, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 185, "ONE ENGINE")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 20)
    c.drawString(130, 150, "Every channel drives leads to one conversion moment: the WhatsApp consultation.")
    footer_strip(c, 6, dark=True)

# ============================================================
# SLIDE 7 - THE CHANNELS (detail)
# ============================================================
def slide7(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "06  ·  The Plan — Channels", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 52)
    c.drawString(100, H - 195, "Each Channel, One Job.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 18)
    c.drawString(100, H - 240, "Owners · Format · Cadence · Cost · KPI — all defined.")
    # 6 channel cards in 3x2
    channels = [
        ("WEBSITE", "Foundation asset", "5 SEO pillars · 1 blog/wk", "Live chat · Sitemap · Schema", "$0/mo"),
        ("FACEBOOK", "Lead-gen #1", "5 posts/wk · Lead-form ads", "Retarget website visitors", "RM 600/mo"),
        ("YOUTUBE", "Trust builder", "1 long-form + 3 Shorts/wk", "Embed in blogs · SEO titles", "RM 200/mo"),
        ("INSTAGRAM + TIKTOK", "Reach multiplier", "3 Reels/wk · Re-cut Shorts", "Bangla captions · Trending audio", "$0/mo"),
        ("LINKEDIN", "Authority + B2B", "2–3 posts/wk · COO-led", "University partnership pipeline", "$0/mo"),
        ("WHATSAPP", "Conversion", "WhatsApp Business · Catalogue", "Auto-replies · Status updates", "$0/mo"),
    ]
    gx = 100
    gy = 350
    gw = (W - 200 - 40) / 3
    gh = 220
    for i, (name, role, content, growth, cost) in enumerate(channels):
        col = i % 3
        row = i // 3
        x = gx + col * (gw + 20)
        y = gy + (1 - row) * (gh + 20) - gh
        c.setFillColor(WHITE)
        c.roundRect(x, y, gw, gh, 14, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.roundRect(x, y + gh - 8, gw, 8, 4, fill=1, stroke=0)
        # Number
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 11)
        c.drawString(x + 24, y + gh - 40, f"CHANNEL 0{i+1}")
        # Name
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 22)
        c.drawString(x + 24, y + gh - 70, name)
        # Role
        c.setFillColor(GOLD_DARK)
        c.setFont(FONT_BOLD, 12)
        c.drawString(x + 24, y + gh - 95, role.upper())
        # Divider
        c.setFillColor(GOLD)
        c.rect(x + 24, y + gh - 110, 30, 2, fill=1, stroke=0)
        # Content
        c.setFillColor(CHARCOAL)
        c.setFont(FONT_REG, 12)
        c.drawString(x + 24, y + 50, "•  " + content)
        c.setFillColor(CHARCOAL)
        c.setFont(FONT_REG, 12)
        c.drawString(x + 24, y + 28, "•  " + growth)
        # Cost pill
        c.setFillColor(NAVY)
        c.roundRect(x + gw - 110, y + 8, 90, 26, 13, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 11)
        c.drawCentredString(x + gw - 65, y + 16, cost)
    footer_strip(c, 7)

# ============================================================
# SLIDE 8 - CONTENT CALENDAR
# ============================================================
def slide8(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "07  ·  The Plan — Content", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 52)
    c.drawString(100, H - 195, "What We Publish. Every Week.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 18)
    c.drawString(100, H - 240, "A repeatable rhythm that builds trust and drives action.")
    # Table
    days = [
        ("MON", "Facebook", "Student success story", "Real name · Real photo · Real outcome"),
        ("TUE", "Blog", "Pillar / cluster article", "SEO long-tail keyword · 800+ words"),
        ("WED", "YouTube", "Long-form video", "8–12 min · Campus tour / case study / how-to"),
        ("THU", "Reels", "Scholarship / visa tip", "30–60 sec · Trending audio · Bangla subs"),
        ("FRI", "BTS", "COO at work", "Day-in-the-life · Authentic · Personal"),
        ("SAT", "Facebook Live", "Live Q&A", "Real-time engagement · 30 min"),
        ("SUN", "Email", "Drip to new leads", "5-step automated nurture sequence"),
    ]
    tx = 100
    ty = 720
    rh = 65
    # Header
    cols = [("DAY", 140), ("CHANNEL", 360), ("CONTENT", 700), ("DETAIL", 500)]
    total_w = sum(cw for _, cw in cols)
    c.setFillColor(NAVY)
    c.rect(tx, ty - 50, total_w, 50, fill=1, stroke=0)
    cxx = tx
    for label, cw in cols:
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 12)
        c.drawString(cxx + 20, ty - 32, label)
        cxx += cw
    # Rows
    for i, (d, ch, ct, det) in enumerate(days):
        y = ty - 115 - i * rh
        c.setFillColor(WHITE if i % 2 == 0 else GREY_LIGHT)
        c.rect(tx, y, total_w, rh, fill=1, stroke=0)
        # Day badge
        c.setFillColor(GOLD)
        c.roundRect(tx + 16, y + 14, 95, 38, 6, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 16)
        c.drawCentredString(tx + 63, y + 25, d)
        # Channel
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 16)
        c.drawString(tx + 140, y + 24, ch)
        # Content
        c.setFillColor(CHARCOAL)
        c.setFont(FONT_REG, 15)
        c.drawString(tx + 500, y + 24, ct)
        # Detail
        c.setFillColor(GREY)
        c.setFont(FONT_REG, 13)
        c.drawString(tx + 1200, y + 26, det)
    # Bottom note
    c.setFillColor(NAVY)
    c.roundRect(100, 160, W - 200, 100, 12, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 230, "REPURPOSING RULE")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 20)
    c.drawString(130, 190, "Every YouTube long-form = 3–5 Reels. Every blog embeds the matching video.")
    footer_strip(c, 8)

# ============================================================
# SLIDE 9 - $0 QUICK WINS
# ============================================================
def slide9(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "08  ·  The Plan — $0 Quick Wins", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 56)
    c.drawString(100, H - 200, "Start Free. Today.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "8 things that take less than a day each. Zero budget.")
    # 8 wins in 2x4 grid
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
    gx = 100
    gy = 360
    gw = (W - 200 - 60) / 4
    gh = 160
    for i, w_ in enumerate(wins):
        col = i % 4
        row = i // 4
        x = gx + col * (gw + 20)
        y = gy + (1 - row) * (gh + 20) - gh
        c.setFillColor(WHITE)
        c.roundRect(x, y, gw, gh, 14, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.roundRect(x, y + gh - 8, gw, 8, 4, fill=1, stroke=0)
        # Check mark
        c.setFillColor(GOLD)
        c.circle(x + 50, y + gh - 70, 22, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 22)
        c.drawCentredString(x + 50, y + gh - 78, "✓")
        # Number
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 12)
        c.drawString(x + 88, y + gh - 62, f"WIN  0{i+1}")
        # Title
        wrapped(c, w_, x + 24, y + gh - 105, gw - 48, size=15, color=CHARCOAL, leading_mult=1.3)
    # Bottom
    c.setFillColor(NAVY)
    c.roundRect(100, 160, W - 200, 140, 12, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 270, "PRIORITY ORDER")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 28)
    c.drawString(130, 220, "WhatsApp Business first. Then 1 blog. Then the videos.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 16)
    c.drawString(130, 190, "Three wins this week. Five more by Friday. You'll feel the difference by Monday.")
    footer_strip(c, 9)

# ============================================================
# SLIDE 10 - 12-MONTH PROJECTION CHART
# ============================================================
def slide10(c):
    bg(c, NAVY)
    add_pattern(c, NAVY_LIGHT)
    header_strip(c)
    section_label(c, "09  ·  The Numbers — Projection", 100, H - 110, color=GOLD)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 52)
    c.drawString(100, H - 200, "From 5 to 60+ per Month.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "12-month projection: consultations generated by the 6-channel engine.")
    # Phase bands behind chart
    chart_left = 130
    chart_right = W - 130
    chart_width = chart_right - chart_left
    y_bottom = 280
    y_top = 680
    chart_h = y_top - y_bottom
    # M1-M3 = 3 months, M4-M6 = 3 months, M7-M12 = 6 months
    seg1 = chart_width * 3 / 12
    seg2 = chart_width * 6 / 12
    # Foundation band (M1-M3) - subtle navy-light
    c.setFillColor(Color(0.10, 0.18, 0.35, alpha=0.5))
    c.rect(chart_left, y_bottom, seg1, chart_h, fill=1, stroke=0)
    # Acceleration band (M4-M6) - subtle gold tint
    c.setFillColor(Color(0.79, 0.64, 0.20, alpha=0.10))
    c.rect(chart_left + seg1, y_bottom, seg1, chart_h, fill=1, stroke=0)
    # Scale band (M7-M12) - subtle lime tint
    c.setFillColor(Color(0.83, 0.97, 0.48, alpha=0.06))
    c.rect(chart_left + seg1*2, y_bottom, seg2, chart_h, fill=1, stroke=0)
    # Horizontal gridlines
    c.setStrokeColor(Color(1, 1, 1, alpha=0.12))
    c.setLineWidth(1)
    for v in [10, 20, 30, 40, 50, 60]:
        gy = y_bottom + (v / 70) * chart_h
        c.line(chart_left, gy, chart_right, gy)
    # Build line chart wrapped in Drawing
    drawing = Drawing(W, H)
    chart = HorizontalLineChart()
    chart.x = 130
    chart.y = 280
    chart.width = chart_width
    chart.height = chart_h
    chart.data = [
        [5, 6, 9, 12, 18, 22, 28, 35, 42, 50, 55, 62]
    ]
    chart.categoryAxis.categoryNames = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12']
    chart.categoryAxis.labels.fontName = FONT_REG
    chart.categoryAxis.labels.fontSize = 12
    chart.categoryAxis.labels.fillColor = CREAM
    chart.valueAxis.labels.fontName = FONT_REG
    chart.valueAxis.labels.fontSize = 12
    chart.valueAxis.labels.fillColor = CREAM
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 70
    chart.valueAxis.valueStep = 10
    chart.lines[0].strokeColor = GOLD
    chart.lines[0].strokeWidth = 4
    drawing.add(chart)
    renderPDF.draw(drawing, c, 0, 0)
    # Add data labels and dots
    months = 12
    x_step = chart_width / (months - 1)
    y_max = 70
    data = [5, 6, 9, 12, 18, 22, 28, 35, 42, 50, 55, 62]
    for i, v in enumerate(data):
        px = chart_left + i * x_step
        py = y_bottom + (v / y_max) * chart_h
        # Outer halo
        c.setFillColor(Color(0.79, 0.64, 0.20, alpha=0.25))
        c.circle(px, py, 14, fill=1, stroke=0)
        # Gold dot
        c.setFillColor(GOLD)
        c.circle(px, py, 9, fill=1, stroke=0)
        # Inner navy dot
        c.setFillColor(NAVY)
        c.circle(px, py, 4, fill=1, stroke=0)
        # Value label
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 14)
        c.drawCentredString(px, py + 22, str(v))
    # Phase labels at top of bands
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawCentredString(chart_left + seg1 / 2, y_top + 10, "M1–M3  ·  FOUNDATION")
    c.drawCentredString(chart_left + seg1 + seg1 / 2, y_top + 10, "M4–M6  ·  ACCELERATION")
    c.drawCentredString(chart_left + seg1*2 + seg2 / 2, y_top + 10, "M7–M12  ·  SCALE")
    # Bottom strip
    c.setFillColor(GOLD)
    c.roundRect(100, 130, W - 200, 100, 12, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 14)
    c.drawString(130, 200, "WHY IT COMPOUNDS")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 20)
    c.drawString(130, 160, "Each month, last month's content keeps working. SEO builds. Lists grow. Trust compounds.")
    footer_strip(c, 10, dark=True)

# ============================================================
# SLIDE 11 - FUNNEL MATH
# ============================================================
def slide11(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "10  ·  The Numbers — Funnel", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 52)
    c.drawString(100, H - 200, "From Ad Spend to Enrolled Student.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "What RM 830/month actually buys you, end-to-end.")
    # 4-step funnel
    steps = [
        ("RM 830", "Monthly ad spend", "Across 6 channels · Meta + YouTube + retargeting", GOLD),
        ("30", "Leads / month", "Form fills, WhatsApp clicks, IG DMs", NAVY),
        ("6", "Consultations booked", "Via WhatsApp auto-replies + COO follow-up", NAVY),
        ("2", "Students enrolled", "Across 30+ partner universities", GOLD),
    ]
    sw = 360
    sh = 280
    sy = 480
    gap = 20
    for i, (n, lbl, sub, color) in enumerate(steps):
        sx = 100 + i * (sw + gap)
        c.setFillColor(WHITE)
        c.roundRect(sx, sy, sw, sh, 16, fill=1, stroke=0)
        c.setFillColor(color)
        c.roundRect(sx, sy + sh - 8, sw, 8, 4, fill=1, stroke=0)
        # Number
        c.setFillColor(color)
        c.setFont(FONT_BOLD, 70)
        c.drawString(sx + 30, sy + sh - 130, n)
        # Label
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 18)
        c.drawString(sx + 30, sy + sh - 165, lbl)
        # Sub
        c.setFillColor(CHARCOAL)
        wrapped(c, sub, sx + 30, sy + sh - 200, sw - 60, size=13, leading_mult=1.4)
        # Step number
        c.setFillColor(GREY)
        c.setFont(FONT_BOLD, 12)
        c.drawString(sx + 30, sy + 25, f"STEP 0{i+1}")
        # Arrow between
        if i < len(steps) - 1:
            ax = sx + sw + 2
            ay = sy + sh / 2
            c.setFillColor(GOLD)
            c.setFont(FONT_BOLD, 30)
            c.drawCentredString(ax, ay - 10, "→")
    # Bottom strip
    c.setFillColor(NAVY)
    c.roundRect(100, 200, W - 200, 200, 16, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 365, "THE BREAKDOWN")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 28)
    c.drawString(130, 315, "Self-funding. Every month.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 16)
    c.drawString(130, 280, "The plan budget is RM 830/month. A single successful enrollment from that spend pays for the whole quarter.")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 16)
    c.drawString(130, 250, "We don't need outside capital to run this plan. We need discipline and weekly review.")
    footer_strip(c, 11)

# ============================================================
# SLIDE 12 - THE TEAM
# ============================================================
def slide12(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "11  ·  The Team", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 56)
    c.drawString(100, H - 200, "The Person Behind the Plan.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "One certified counsellor. One COO. One person accountable for every student.")
    # Big COO card
    # Photo
    draw_image_cover(c, img_path("coo-profile.png"), 100, 380, 460, 540)
    # Info card
    c.setFillColor(NAVY)
    c.roundRect(600, 380, W - 700, 540, 16, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(640, 870, "CHIEF OPERATING OFFICER")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 44)
    c.drawString(640, 820, "Kazi Mahir")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 44)
    c.drawString(640, 770, "Muhtasib")
    # Divider
    c.setFillColor(GOLD)
    c.rect(640, 740, 80, 3, fill=1, stroke=0)
    # Bio
    wrapped(c,
        "Certified Education Counsellor with 2+ years of hands-on experience guiding "
        "300+ students from Bangladesh, India, Nepal, Pakistan, Nigeria and beyond into "
        "Malaysia's top universities. Personally responds to every inquiry within 24 hours. "
        "Built Absolute Consultancy Firm's 30+ partner network, 99% visa approval rate, "
        "and 6-service model from the ground up.",
        640, 690, W - 800, size=18, color=CREAM, leading_mult=1.5)
    # Stats
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(640, 530, "BY THE NUMBERS")
    stats = [
        ("300+", "Students placed"),
        ("30+", "Partner universities"),
        ("99%", "Visa approval"),
        ("2+ yrs", "Experience"),
    ]
    for i, (n, lbl) in enumerate(stats):
        x = 640 + i * 270
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 32)
        c.drawString(x, 470, n)
        c.setFillColor(CREAM)
        c.setFont(FONT_REG, 13)
        c.drawString(x, 445, lbl)
    # Contact line
    c.setFillColor(CREAM)
    c.setFont(FONT_BOLD, 14)
    c.drawString(640, 410, "+60 17-563 1621  ·  wa.me/60175631621")
    # Bottom strip
    c.setFillColor(GOLD)
    c.roundRect(100, 180, W - 200, 140, 12, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 14)
    c.drawString(130, 290, "THE PROMISE")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 24)
    c.drawString(130, 250, "The COO personally reaches out within 24 hours.")
    c.setFillColor(NAVY)
    c.setFont(FONT_REG, 16)
    c.drawString(130, 215, "That's not a tagline. That's how the business has been built. We will protect it as we scale.")
    footer_strip(c, 12)

# ============================================================
# SLIDE 13 - THE ASK
# ============================================================
def slide13(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "12  ·  The Ask", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 56)
    c.drawString(100, H - 200, "Three Asks. One Plan.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "Pick the one that matches you. We'll handle the rest.")
    # 3 ask cards
    asks = [
        ("FOR THE BOARD", "Approve the budget", "Approve the RM 830/month ad budget and the 90-day roadmap. One signature, 90 days of execution.", "→", NAVY),
        ("FOR UNIVERSITY PARTNERS", "Co-launch an intake", "Let's co-publish a Sept 2026 intake campaign. We bring the audience, you bring the program.", "→", GOLD),
        ("FOR STRATEGIC PARTNERS", "Cross-promote to 5K+", "We have 5,000+ students and parents in our reach. Let's co-host a webinar, an ebook, or a video series.", "→", NAVY),
    ]
    cw = (W - 200 - 40) / 3
    ch = 520
    cy = 360
    for i, (who, action, body, arrow, color) in enumerate(asks):
        x = 100 + i * (cw + 20)
        c.setFillColor(WHITE)
        c.roundRect(x, cy, cw, ch, 16, fill=1, stroke=0)
        c.setFillColor(color)
        c.roundRect(x, cy + ch - 8, cw, 8, 4, fill=1, stroke=0)
        # Who label
        c.setFillColor(color)
        c.setFont(FONT_BOLD, 13)
        c.drawString(x + 30, cy + ch - 55, who)
        # Action
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 30)
        wrapped(c, action, x + 30, cy + ch - 105, cw - 60, size=30, color=NAVY, leading_mult=1.2)
        # Divider
        c.setFillColor(GOLD)
        c.rect(x + 30, cy + ch - 165, 30, 3, fill=1, stroke=0)
        # Body
        c.setFillColor(CHARCOAL)
        wrapped(c, body, x + 30, cy + ch - 200, cw - 60, size=15, leading_mult=1.5)
        # CTA button at bottom
        btn_w = cw - 60
        btn_h = 50
        btn_x = x + 30
        btn_y = cy + 30
        c.setFillColor(GOLD)
        c.roundRect(btn_x, btn_y, btn_w, btn_h, 25, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 14)
        c.drawCentredString(btn_x + btn_w / 2, btn_y + 17, "I'M INTERESTED  →")
    # Bottom strip
    c.setFillColor(NAVY)
    c.roundRect(100, 160, W - 200, 120, 12, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 13)
    c.drawString(130, 250, "ONE COMMON GOAL")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 22)
    c.drawString(130, 205, "More students placed. More lives changed. Stronger brand. Same mission.")
    footer_strip(c, 13)

# ============================================================
# SLIDE 14 - ROADMAP
# ============================================================
def slide14(c):
    bg(c, CREAM)
    header_strip(c)
    section_label(c, "13  ·  The Roadmap", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 52)
    c.drawString(100, H - 200, "Foundation → Acceleration → Scale.")
    c.setFillColor(GREY)
    c.setFont(FONT_REG, 20)
    c.drawString(100, H - 250, "90 days. One phase per month. Two check-ins per week.")
    # Gantt-style timeline
    # Three rows
    phases = [
        ("MONTH 1", "Foundation", [
            "WhatsApp Business set up",
            "5 SEO pillar pages drafted",
            "FB lead-magnet ads live",
            "4 YouTube videos published",
            "12 Reels published",
            "Google Business Profile live",
        ], NAVY),
        ("MONTH 2", "Acceleration", [
            "All pillar pages + clusters live",
            "Email drip sequence active",
            "Retargeting campaigns live",
            "2 alumni ambassadors onboarded",
            "First education fair attended",
            "Weekly content review starts",
        ], GOLD),
        ("MONTH 3", "Scale", [
            "Page 1 SEO for target keywords",
            "20+ consultations / month",
            "50+ Google reviews (4.7★ avg)",
            "COO LinkedIn > 1,000 followers",
            "Decide: hire content creator?",
            "Re-evaluate ad budget, double winners",
        ], NAVY),
    ]
    base_y = 700
    row_h = 160
    gap = 30
    for i, (month, title, items, color) in enumerate(phases):
        y = base_y - i * (row_h + gap)
        # Month badge
        c.setFillColor(color)
        c.roundRect(100, y - row_h, 220, row_h, 14, fill=1, stroke=0)
        c.setFillColor(WHITE if color == NAVY else NAVY)
        c.setFont(FONT_BOLD, 16)
        c.drawCentredString(210, y - 30, month)
        c.setFont(FONT_BOLD, 22)
        c.drawCentredString(210, y - 70, title)
        # Items card
        ix = 340
        iw = W - 440
        c.setFillColor(WHITE)
        c.roundRect(ix, y - row_h, iw, row_h, 12, fill=1, stroke=0)
        # Items in 2 cols
        col_w = (iw - 60) / 2
        for j, item in enumerate(items):
            col = j // 3
            row = j % 3
            tx = ix + 30 + col * col_w
            ty = y - 30 - row * 40
            c.setFillColor(GOLD)
            c.circle(tx + 5, ty + 6, 5, fill=1, stroke=0)
            c.setFillColor(CHARCOAL)
            c.setFont(FONT_REG, 14)
            c.drawString(tx + 20, ty, item)
    footer_strip(c, 14)

# ============================================================
# SLIDE 15 - CLOSING
# ============================================================
def slide15(c):
    # Navy left, image right
    bg(c, NAVY)
    draw_image_cover(c, img_path("hero-graduate.png"), W * 0.55, 0, W * 0.45, H)
    c.setFillColor(Color(0.04, 0.05, 0.15, alpha=0.30))
    c.rect(W * 0.55, 0, W * 0.45, H, fill=1, stroke=0)
    header_strip(c)
    # Left content
    section_label(c, "14  ·  Closing", 100, H - 110)
    gold_underline(c, 100, H - 125, 80)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 90)
    c.drawString(100, H - 260, "Your Dream.")
    c.setFillColor(GOLD)
    c.drawString(100, H - 360, "Our Mission.")
    wrapped(c,
        "Let's grow Absolute Consultancy Firm together — more students placed, "
        "more lives changed, and a brand that parents trust by name.",
        100, H - 440, 900, size=24, color=CREAM, leading_mult=1.5)
    # Big primary CTA
    c.setFillColor(GOLD)
    c.roundRect(100, 320, 420, 80, 40, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 22)
    c.drawCentredString(310, 350, "BOOK A FREE CONSULTATION  →")
    # Secondary
    c.setStrokeColor(GOLD)
    c.setFillColor(NAVY)
    c.setLineWidth(2)
    c.roundRect(100, 220, 360, 60, 30, fill=1, stroke=1)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(280, 240, "READ THE FULL PLAN")
    # Tertiary - read the marketing plan PDF
    c.setStrokeColor(CREAM)
    c.setLineWidth(1)
    c.roundRect(100, 140, 280, 50, 25, fill=0, stroke=1)
    c.setFillColor(CREAM)
    c.setFont(FONT_BOLD, 14)
    c.drawCentredString(240, 156, "VIEW EXECUTIVE SUMMARY")
    # Contact
    c.setFillColor(CREAM)
    c.setFont(FONT_BOLD, 12)
    c.drawString(100, 100, "ABSOLUTE CONSULTANCY FIRM")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 12)
    c.drawString(100, 80, "absoluteconsultancyfirm.com")
    c.drawString(100, 60, "+60 17-563 1621   ·   youtube.com/@absoluteconsultancy   ·   facebook.com/share/18bRc7r8cA")
    c.setFillColor(GOLD)
    c.setFont(FONT_REG, 11)
    c.drawString(100, 40, "Marketing Plan 2026  ·  v2.0 Premium  ·  June 2026")
    # Right side
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 20)
    c.drawRightString(W - 80, 240, "KAZI MAHIR MUHTASIB")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 14)
    c.drawRightString(W - 80, 215, "COO & Co-Founder")
    c.setFillColor(GOLD)
    c.setFont(FONT_REG, 13)
    c.drawRightString(W - 80, 195, "Certified Education Counsellor")
    c.setFillColor(CREAM)
    c.setFont(FONT_REG, 13)
    c.drawRightString(W - 80, 175, "2+ Years Experience")
    # Tagline stamp
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 16)
    c.drawRightString(W - 80, 100, "YOUR DREAM. OUR MISSION.")

# ============================================================
# BUILD
# ============================================================
def main():
    c = canvas.Canvas(OUT, pagesize=PAGE)
    c.setTitle("Absolute Consultancy Firm — Marketing Plan 2026 (Premium)")
    c.setAuthor("Absolute Consultancy Firm")
    c.setSubject("Marketing Plan 2026 — Premium Presentation")
    c.setKeywords("education, malaysia, consultancy, marketing, 2026, premium")

    slide1(c);  c.showPage()
    slide2(c);  c.showPage()
    slide3(c);  c.showPage()
    slide4(c);  c.showPage()
    slide5(c);  c.showPage()
    slide6(c);  c.showPage()
    slide7(c);  c.showPage()
    slide8(c);  c.showPage()
    slide9(c);  c.showPage()
    slide10(c); c.showPage()
    slide11(c); c.showPage()
    slide12(c); c.showPage()
    slide13(c); c.showPage()
    slide14(c); c.showPage()
    slide15(c); c.showPage()

    c.save()
    size_kb = os.path.getsize(OUT) / 1024
    print(f"PDF created: {OUT} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    main()
