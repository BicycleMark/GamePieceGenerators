# GamePieceGenerators

A collection of web-based tools for generating customizable game pieces and UI elements for game development, UI design, or other creative projects.

## Tools

### Digits Generator

Located in the `/digits` directory, this tool allows you to create customizable seven-segment display digits for games, UI elements, or other creative projects.

- Generate SVG and PNG seven-segment displays
- Customize colors, effects, and dimensions
- Export individual digits or complete sets
- Save and load your settings
- Real-time preview of changes

### Minesweeper Tile Generator

Located in the `/tiles` directory, this tool allows you to create customizable minesweeper-style tiles for games, UI elements, or other creative projects.

- Generate SVG and PNG tiles for minesweeper-style games
- Customize colors, effects, and dimensions
- Export individual tiles or complete tile sets
- Save and load your settings
- Real-time preview of changes

## Usage

Each generator is a standalone web application that can be opened directly in a browser. No server or build process is required.

1. Open the desired generator's `index.html` file in a web browser
2. Customize the appearance using the controls
3. Preview changes in real-time
4. Export as SVG or PNG
5. Use "Save All" to export a complete set

## Development

### Project Structure

```
GamePieceGenerators/
├── .gitignore
├── README.md
├── digits/
│   ├── README.md
│   ├── index.html
│   ├── metadata.json
│   ├── css/
│   │   └── seven-segment.css
│   ├── js/
│   │   ├── jszip.min.js
│   │   ├── metadata-generator.js
│   │   ├── post-process-zip.js
│   │   ├── settings-manager.js
│   │   ├── seven-segment.js
│   │   └── ui-controls-simple.js
│   └── svg/
│       ├── defaults.json
│       └── digit-8.svg
└── tiles/
    ├── README.md
    ├── index.html
    ├── metadata.json
    ├── css/
    │   └── minesweeper-tiles.css
    ├── js/
    │   ├── jszip.min.js
    │   ├── metadata-generator.js
    │   ├── minesweeper-tiles.js
    │   ├── post-process-zip.js
    │   ├── settings-manager.js
    │   └── ui-controls.js
    ├── samples/
    │   ├── unplayed.svg
    │   ├── pressed.svg
    │   ├── flagged.svg
    │   ├── revealed_mine.svg
    │   ├── wrong_guess.svg
    │   ├── neighbor_0_image.svg
    │   ├── neighbor_1_image.svg
    │   ├── neighbor_2_image.svg
    │   ├── neighbor_3_image.svg
    │   ├── neighbor_4_image.svg
    │   ├── neighbor_5_image.svg
    │   ├── neighbor_6_image.svg
    │   ├── neighbor_7_image.svg
    │   └── neighbor_8_image.svg
    └── svg/
        └── defaults.json
```

### Adding New Generators

To add a new generator:

1. Create a new directory for your generator
2. Follow the structure of existing generators
3. Implement the core rendering logic
4. Create a UI for customization
5. Add export functionality
6. Update this README.md to include your new generator

## License

MIT License
