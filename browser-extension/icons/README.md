# Browser Extension Icons

The browser extension requires icon files in the following sizes:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

## How to Add Icons

### Option 1: Create Your Own Icons
1. Design icons in your preferred graphics editor
2. Export as PNG files in the required sizes
3. Save them in this directory with the correct names

### Option 2: Use a Placeholder Generator
Use any online icon generator or placeholder service:
- https://placeholder.com/
- https://via.placeholder.com/
- Create simple colored squares as temporary icons

### Option 3: Extract from Favicon
1. Use the QuickNotes logo/favicon from the main app
2. Resize to the required dimensions
3. Save as PNG files

## Temporary Workaround

For testing, you can create simple colored PNG files:

```bash
# Using ImageMagick (if installed)
convert -size 16x16 xc:'#A6B1E1' icon16.png
convert -size 48x48 xc:'#A6B1E1' icon48.png
convert -size 128x128 xc:'#A6B1E1' icon128.png
```

## Design Guidelines

For best results:
- Use the QuickNotes brand colors (#A6B1E1, #424874)
- Include a simple notepad or sticky note icon
- Ensure icons are clear and recognizable at small sizes
- Use transparent backgrounds where appropriate
- Follow browser extension icon guidelines

## Note

The extension will work without icons, but browsers may show a default placeholder icon instead.
