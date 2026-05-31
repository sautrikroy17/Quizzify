from PIL import Image, ImageDraw

def create_card(filename, width, height, radius, fill_color, border_color, border_width):
    # Create image with transparent background, sized up for antialiasing
    scale = 4
    w = width * scale
    h = height * scale
    r = radius * scale
    bw = border_width * scale
    
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw border
    draw.rounded_rectangle([0, 0, w-1, h-1], radius=r, fill=border_color)
    # Draw fill
    draw.rounded_rectangle([bw, bw, w-1-bw, h-1-bw], radius=r-bw, fill=fill_color)
    
    # Downscale for antialiasing
    img = img.resize((width, height), Image.LANCZOS)
    img.save(filename)

# Glass card: 15% opacity white border, 70% opacity dark grey fill
create_card("glass_card.png", 1000, 1000, 20, (18, 18, 23, 190), (255, 255, 255, 40), 2)
print("Card generated.")
