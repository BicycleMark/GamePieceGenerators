# Chess Pieces Generator

A tool for creating customizable chess pieces for games, UI elements, or other creative projects.

## Features

- Generate SVG and PNG chess pieces
- Customize colors, effects, and dimensions
- Support for all standard chess pieces (pawn, rook, knight, bishop, queen, king)
- Customizable board square colors
- Export individual pieces or complete sets
- Save and load your settings
- Real-time preview of changes

## Usage

1. Open `index.html` in a web browser
2. Use the controls to customize the appearance of your chess pieces
3. Preview changes in real-time
4. Export as SVG or PNG
5. Use "Save All" to export a complete set

## Customization Options

### Board Settings
- Light square color
- Dark square color
- Board size (standard 8x8)
- Square size

### Piece Settings
- White piece color
- White piece border color
- Black piece color
- Black piece border color
- Piece size
- Border width
- 3D effect toggle
- Piece style (classic, modern, minimalist)

### Effects Settings
- Glow effect toggle
- Glow size
- Shadow options

## Export Options

- Export individual pieces as SVG or PNG
- Export complete set as a ZIP file
- Export board with pieces as SVG
- Export/import settings as JSON

## File Structure

```
chesspieces/
├── README.md
├── index.html
├── css/
│   └── chess-pieces.css
├── js/
│   ├── chess-pieces.js
│   ├── settings-manager.js
│   └── ui-controls.js
├── samples/
│   ├── white-pawn.svg
│   ├── white-rook.svg
│   ├── white-knight.svg
│   ├── white-bishop.svg
│   ├── white-queen.svg
│   ├── white-king.svg
│   ├── black-pawn.svg
│   ├── black-rook.svg
│   ├── black-knight.svg
│   ├── black-bishop.svg
│   ├── black-queen.svg
│   ├── black-king.svg
│   ├── light-square.svg
│   └── dark-square.svg
└── svg/
    └── defaults.json
```

## Development

The Chess Pieces Generator is built with vanilla JavaScript and uses SVG for rendering the pieces. The code is organized into three main components:

1. `chess-pieces.js` - Core classes for creating and manipulating chess pieces
2. `settings-manager.js` - Handles saving and loading settings
3. `ui-controls.js` - Manages the user interface

To modify or extend the generator, you can edit these files directly.

## Accessibility

The Chess Pieces Generator is designed to be accessible to all users, including those who use assistive technologies. ARIA attributes are used throughout the interface to improve the experience for screen reader users.

## License

This project is part of the GamePieceGenerators collection and is available under the MIT License.
