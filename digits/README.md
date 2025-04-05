# 7-Segment LED Display Generator

An interactive tool for creating customizable 7-segment LED display SVGs and PNGs.

## Features

- Generate SVG or PNG files for 7-segment LED displays
- Customize colors, opacity, and glow effects
- Display any digit (0-9) or blank state
- Export individual images or all digits at once in a ZIP file
- Copy SVG code or PNG image directly to clipboard

## Usage

1. Open `index.html` in any modern web browser
2. Use the controls to customize your 7-segment display:
   - Select a digit (0-9 or blank)
   - Choose display size
   - Toggle glow effect
   - Set foreground and background colors
   - Adjust opacity of inactive segments
3. Export your creation:
   - "Save Current Image" - Download the currently displayed digit
   - "Save All Digits" - Download a ZIP file containing all 11 states (blank + 0-9)
   - "Copy SVG/PNG" - Copy the SVG code or PNG image to clipboard

## Customization Options

### Display Settings

- **Select Digit**: Choose which digit to display (blank, 0-9)
- **Display Size**: Change the physical dimensions of the display
- **Glow Effect**: Toggle the LED glow effect on/off

### Appearance

- **Foreground Color**: The color of active segments (default: red)
- **Background Color**: The background color of the display (default: black)
- **Off Segment Opacity**: How visible inactive segments are (default: 15%)
- **Edge Radius**: Control the roundness of the 4 corners of the display background (0-25, default: 0)

### Export Options

- **Output Format**: Choose between SVG or PNG output format
- **Save Current Image**: Download the currently displayed digit
- **Save All Digits**: Download a ZIP file containing all 11 states (blank + 0-9)
- **Copy SVG/PNG**: Copy the SVG code or PNG image to clipboard

## Technical Details

The generator creates SVG files with the following features:

- Clean, scalable vector graphics
- Embedded CSS for styling
- Metadata with settings information
- Proper SVG doctype and namespaces
- Optimized for web use

PNG files are generated from the SVG content for compatibility with applications that don't support SVG.

Each segment is defined as an SVG path with rounded corners, following the standard 7-segment display layout:

```
 aaaa
f    b
f    b
 gggg
e    c
e    c
 dddd
```

## Settings Management

The generator includes a comprehensive settings management system:

- **Save Settings**: Save your current settings to a JSON file
- **Load Settings**: Load settings from a previously saved JSON file
- **Create Defaults**: Generate a defaults.json file with factory settings

### Settings Files

The application uses several types of settings files:

- **settings.json**: User's saved settings
- **defaults.json**: Factory default settings
- **Individual JSON files**: Each exported image has a companion JSON file with the same base name

### Settings Hierarchy

When the application starts, it loads settings in this order:

1. URL parameters (highest priority)
2. Local storage (from previous session)
3. User settings file (settings.json)
4. Factory defaults file (defaults.json)
5. Hardcoded defaults (lowest priority)

### Metadata

All settings files include comprehensive metadata:

- Content information (digit, display type)
- Appearance settings (colors, opacity, glow, edge radius)
- Generator information (version, build date)
- Export details (format, timestamp, filename)

When using the "Save All Digits" feature, the ZIP file includes a `GeneratedDigits.json` file with enhanced metadata. This file uses an optimized structure with common information in the header and digit-specific information in an array:

```json
{
  "metadata": {
    // Common metadata shared by all digits
    "timestamp": "2025-04-05T21:48:40.508Z",
    "repository": { /* Git repository information */ },
    "user": { /* User information */ },
    "environment": { /* Environment information */ },
    "processing": { /* Processing information */ },
    "fileIntegrity": { /* File checksums */ },
    "appearance": {
      "foregroundColor": "#ff0000",
      "backgroundColor": "#000000",
      "opacityOffSegment": 0.15,
      "glowEnabled": true,
      "edgeRadius": 0
    },
    "generator": { /* Generator information */ }
  },
  "digits": [
    {
      "digit": "0",
      "export": {
        "format": "svg",
        "timestamp": "2025-04-05T21:48:38.123Z",
        "filename": "digit_0_image.svg"
      }
    },
    // ... other digits
  ]
}
```

The metadata section includes:

- **Git Repository Information**:
  - Repository URL
  - Branch name
  - Commit ID and message
  - Recent commits history
  - Git tags (if any)
- **User Information** (from Git configuration):
  - User name
  - User email
- **Environment Information**:
  - Operating system
  - CPU architecture (with Apple Silicon detection)
  - Browser details
  - Application version
- **Processing Information**:
  - Timestamp
  - Processing duration
  - Success/failure statistics
- **File Integrity**:
  - Checksums for all generated files

This comprehensive metadata ensures complete traceability and reproducibility of the generated files.

> **Note**: The application uses your Git configuration to include user information in the metadata. If you don't want this information included, you may need to adjust your Git configuration.

## Node.js Scripts

The application includes Node.js scripts for enhanced metadata generation:

- **metadata-generator.js**: Generates metadata with actual Git repository information and hardware detection (including Apple Silicon)
- **post-process-zip.js**: Post-processes ZIP files to replace placeholders with actual Git information and file checksums

### Using metadata-generator.js

The application now includes hardcoded Git repository information from the main branch. This ensures that the metadata in the GeneratedDigits.json file always shows the correct branch information.

If you want to update this information (for example, after making new commits), you can run the metadata-generator.js script:

```bash
node js/metadata-generator.js
```

This will generate a metadata.json file with the latest Git information, including:
- Current branch name
- Latest commit ID and message
- Recent commits history
- User information from Git configuration

> **Note**: The hardcoded metadata in the application is set to the main branch. If you're working on a different branch and want to update the metadata, you'll need to manually update the ui-controls-simple.js file.

### Using the Post-Process Script

After generating a ZIP file with the "Save All Digits" button, you can run the post-process script to add real Git information and file checksums:

```bash
node js/post-process-zip.js 7segment-digits-SVG-20250405.zip
```

This will create a new ZIP file with `-processed` added to the filename, containing the enhanced metadata.

## File Structure

- `index.html` - Main application page
- `css/seven-segment.css` - Styling for the 7-segment display
- `js/seven-segment.js` - Core display functionality
- `js/settings-manager.js` - Settings and metadata management
- `js/ui-controls-simple.js` - User interface controls
- `js/jszip.min.js` - Library for creating ZIP files
- `js/metadata-generator.js` - Node.js script for generating Git metadata
- `js/post-process-zip.js` - Node.js script for post-processing ZIP files with real Git data
- `svg/defaults.json` - Factory default settings

## Browser Compatibility

This tool works in all modern browsers that support:
- SVG
- CSS Variables
- ES6 JavaScript
- Blob API (for saving files)
- Canvas API (for PNG export)

## Hardware Detection

The application includes sophisticated hardware detection capabilities:

### Browser Environment
- Detects Apple Silicon Macs using multiple techniques:
  - WebAssembly SIMD support testing
  - Performance characteristics analysis
  - Canvas fingerprinting differences
  - User Agent string analysis
- Provides a confidence score for the detection
- Includes detailed detection information in the metadata

### Node.js Environment
- Detects Apple Silicon on macOS using system commands
- Includes CPU architecture information in the metadata
- Provides accurate platform information for traceability

This enhanced hardware detection ensures accurate system information in the metadata, which is particularly useful for M1/M2 Macs that might otherwise be reported as Intel machines.

## License

This project is open source and available for any use.
