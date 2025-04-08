# Checker Pieces Generator

A tool for creating customizable checker pieces for games, UI elements, or other creative projects.

## Features

- Generate SVG and PNG checker pieces
- Customize colors, effects, and dimensions
- Support for regular and crowned (king) pieces
- Customizable board square colors
- Export individual pieces or complete sets
- Save and load your settings
- Real-time preview of changes

## Usage

1. Open `index.html` in a web browser
2. Use the controls to customize the appearance of your checker pieces
3. Preview changes in real-time
4. Export as SVG or PNG
5. Use "Save All" to export a complete set

## Customization Options

### Board Settings
- Light square color
- Dark square color
- Board size (8x8, 10x10, 12x12)
- Square size

### Piece Settings
- Red piece color
- Red piece border color
- Black piece color
- Black piece border color
- Piece size
- Border width
- 3D effect toggle

### Crown Settings
- Crown color
- Crown border color
- Crown style (classic, star, symbol)

### Effects Settings
- Glow effect toggle
- Glow size

## Export Options

- Export individual pieces as SVG or PNG
- Export complete set as a ZIP file
- Export board as SVG
- Export/import settings as JSON

## File Structure

```
checkerpieces/
├── README.md
├── index.html
├── css/
│   └── checker-pieces.css
├── js/
│   ├── checker-pieces.js
│   ├── settings-manager.js
│   └── ui-controls.js
├── samples/
│   ├── crown.svg
│   ├── red-piece.svg
│   ├── black-piece.svg
│   ├── red-king.svg
│   ├── black-king.svg
│   ├── light-square.svg
│   └── dark-square.svg
└── svg/
    └── defaults.json
```

## Development

The Checker Pieces Generator is built with vanilla JavaScript and uses SVG for rendering the pieces. The code is organized into three main components:

1. `checker-pieces.js` - Core classes for creating and manipulating checker pieces
2. `settings-manager.js` - Handles saving and loading settings
3. `ui-controls.js` - Manages the user interface

To modify or extend the generator, you can edit these files directly.

## License

This project is part of the GamePieceGenerators collection and is available under the MIT License.
