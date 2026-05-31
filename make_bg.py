from PIL import Image, ImageDraw, ImageFilter
import os

width = 1920
height = 1080
bg_color = (9, 9, 11)

# Create base image
img = Image.new('RGB', (width, height), bg_color)
draw = ImageDraw.Draw(img)

# Draw some glowing orbs
# Orb 1: Top Right, Blue
blue = (79, 172, 254)
draw.ellipse((1200, -300, 2400, 900), fill=blue)

# Orb 2: Bottom Left, Cyan
cyan = (0, 242, 254)
draw.ellipse((-400, 400, 800, 1600), fill=cyan)

# Orb 3: Center Bottom, Muted blue
muted = (15, 52, 96)
draw.ellipse((600, 700, 1600, 1700), fill=muted)

# Apply massive blur
img = img.filter(ImageFilter.GaussianBlur(radius=250))

# Darken it a bit by blending with solid background
solid_bg = Image.new('RGB', (width, height), bg_color)
img = Image.blend(solid_bg, img, alpha=0.35)

img.save('premium_bg.png')
print("Background generated.")
