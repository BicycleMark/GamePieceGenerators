# GamePieceGenerators

A collection of web-based tools for generating customizable game pieces and UI elements for game development, UI design, or other creative projects.

## Tools

### Chess Pieces Generator

Located in the `/chesspieces` directory, this tool allows you to create customizable chess pieces for games, UI elements, or other creative projects.

- Generate SVG and PNG chess pieces
- Customize colors, effects, and dimensions
- Support for all standard chess pieces (pawn, rook, knight, bishop, queen, king)
- Customizable board square colors
- Export individual pieces or complete sets
- Save and load your settings
- Real-time preview of changes

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

### Checker Pieces Generator

Located in the `/checkerpieces` directory, this tool allows you to create customizable checker pieces for games, UI elements, or other creative projects.

- Generate SVG and PNG checker pieces
- Customize colors, effects, and dimensions
- Support for regular and crowned (king) pieces
- Customizable board square colors
- Export individual pieces or complete sets
- Save and load your settings
- Real-time preview of changes

### 3D Dice Generator

Located in the `/dice` directory, this tool allows you to create customizable 3D dice with physics-based animations for games, UI elements, or other creative projects.

- Generate 3D dice with realistic rendering using Three.js
- Physics-based animations for rolling and spinning
- Customize colors, materials, and pip styles
- Multiple dice types (d6)
- Export as SVG, PNG, or animated GIF
- Save and load your settings
- Real-time 3D preview with camera controls

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
├── chesspieces/
│   ├── README.md
│   ├── index.html
│   ├── metadata.json
│   ├── css/
│   │   └── chess-pieces.css
│   ├── js/
│   │   ├── chess-pieces.js
│   │   ├── settings-manager.js
│   │   └── ui-controls.js
│   ├── samples/
│   │   ├── white-pawn.svg
│   │   ├── white-rook.svg
│   │   ├── white-knight.svg
│   │   ├── white-bishop.svg
│   │   ├── white-queen.svg
│   │   ├── white-king.svg
│   │   ├── black-pawn.svg
│   │   ├── black-rook.svg
│   │   ├── black-knight.svg
│   │   ├── black-bishop.svg
│   │   ├── black-queen.svg
│   │   ├── black-king.svg
│   │   ├── light-square.svg
│   │   └── dark-square.svg
│   └── svg/
│       └── defaults.json
├── dice/
│   ├── README.md
│   ├── index.html
│   ├── metadata.json
│   ├── css/
│   │   └── dice.css
│   ├── js/
│   │   ├── dice.js
│   │   ├── settings-manager.js
│   │   └── ui-controls.js
│   ├── samples/
│   │   ├── dice-d6-white.svg
│   │   ├── dice-d6-red.svg
│   │   ├── dice-d6-blue.svg
│   │   └── dice-d6-green.svg
│   └── svg/
│       └── defaults.json
├── checkerpieces/
│   ├── README.md
│   ├── index.html
│   ├── metadata.json
│   ├── css/
│   │   └── checker-pieces.css
│   ├── js/
│   │   ├── checker-pieces.js
│   │   ├── settings-manager.js
│   │   └── ui-controls.js
│   ├── samples/
│   │   ├── crown.svg
│   │   ├── red-piece.svg
│   │   ├── black-piece.svg
│   │   ├── red-king.svg
│   │   ├── black-king.svg
│   │   ├── light-square.svg
│   │   └── dark-square.svg
│   └── svg/
│       └── defaults.json
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

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Whenever changes are pushed to the `main` branch, the following process occurs:

1. GitHub Actions workflow is triggered
2. Dependencies are installed and tests are run
3. The site is built and deployed to GitHub Pages

You can access the deployed site at: https://bicyclemark.github.io/GamePieceGenerators/

### Initial Setup (Required)

**Before the first deployment**, you must manually enable GitHub Pages in your repository settings:

1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Under "Build and deployment" > "Source", select "Deploy from a branch"
4. Under "Branch", select "gh-pages" and "/ (root)"
5. Click "Save"

This is a one-time setup that must be completed before the GitHub Actions workflow can successfully deploy your site.

### GitHub Actions Workflow

The deployment is handled automatically by the workflow defined in `.github/workflows/deploy.yml`. This workflow:

- Runs on pushes to the `main` branch
- Sets up Node.js and installs dependencies
- Runs tests to ensure everything is working
- Deploys the site to the `gh-pages` branch
- GitHub Pages then serves the content from the `gh-pages` branch

If you need to modify the deployment process, you can edit the workflow file.

## License

MIT License
