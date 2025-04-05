/**
 * Metadata Generator for Minesweeper Tile Generator
 * Generates metadata for the tiles and the project
 */

/**
 * Generate metadata for the project
 * @returns {Object} - Project metadata
 */
async function generateProjectMetadata() {
  try {
    // Fetch metadata from the metadata.json file
    const response = await fetch('metadata.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata.json: ${response.status} ${response.statusText}`);
    }
    
    const metadata = await response.json();
    
    // Add current timestamp
    metadata.timestamp = new Date().toISOString();
    
    // Update environment timestamp
    if (metadata.environment) {
      metadata.environment.timestamp = new Date().toISOString();
    }
    
    return metadata;
  } catch (error) {
    console.error('Error generating project metadata:', error);
    
    // Return basic metadata if fetch fails
    return {
      timestamp: new Date().toISOString(),
      repository: {
        url: "https://github.com/BicycleMark/GamePieceGenerators.git",
        branch: "main"
      },
      user: {
        name: "user",
        email: "user@example.com"
      },
      environment: {
        os: navigator.platform || "Unknown",
        appVersion: "1.0.0",
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Generate metadata for a specific tile
 * @param {MinesweeperTileDisplay} display - The tile display instance
 * @param {string} format - The export format (svg or png)
 * @param {string} filename - The filename for the exported tile
 * @returns {Object} - Tile metadata
 */
function generateTileMetadata(display, format, filename) {
  // Get base metadata from the display
  const metadata = {
    content: {
      tileState: display.currentState,
      displayType: "minesweeper-tile"
    },
    appearance: {
      unplayedColor: display.options.unplayedColor,
      revealedColor: display.options.revealedColor,
      borderColor: display.options.borderColor,
      highlightColor: display.options.highlightColor,
      shadowColor: display.options.shadowColor,
      number1Color: display.options.number1Color,
      number2Color: display.options.number2Color,
      number3Color: display.options.number3Color,
      number4Color: display.options.number4Color,
      number5Color: display.options.number5Color,
      number6Color: display.options.number6Color,
      number7Color: display.options.number7Color,
      number8Color: display.options.number8Color,
      mineColor: display.options.mineColor,
      flagColor: display.options.flagColor,
      wrongGuessColor: display.options.wrongGuessColor,
      shadowOpacity: display.options.shadowOpacity,
      highlightOpacity: display.options.highlightOpacity,
      innerShadowEnabled: display.options.innerShadowEnabled,
      innerShadowBlur: display.options.innerShadowBlur,
      innerShadowOffset: display.options.innerShadowOffset,
      tileSize: display.options.tileSize
    },
    export: {
      format: format,
      timestamp: new Date().toISOString(),
      filename: filename
    },
    meta: {
      type: "image-settings",
      description: `Settings used to generate ${filename}`
    }
  };
  
  return metadata;
}

/**
 * Generate metadata for a complete set of tiles
 * @param {MinesweeperTileDisplay} display - The tile display instance
 * @param {Array} tileStates - Array of tile states to include
 * @param {string} format - The export format (svg or png)
 * @returns {Promise<Object>} - Promise resolving to the complete metadata
 */
async function generateCompleteMetadata(display, tileStates, format) {
  // Get project metadata
  const projectMetadata = await generateProjectMetadata();
  
  // Generate metadata for each tile state
  const tilesMetadata = [];
  
  for (const state of tileStates) {
    // Generate filename
    let filename;
    if (state.startsWith('neighbor_')) {
      filename = `${state}_image.${format}`;
    } else {
      filename = `${state}.${format}`;
    }
    
    // Create a copy of the display with this state
    const stateMetadata = generateTileMetadata(display, format, filename);
    stateMetadata.content.tileState = state;
    
    tilesMetadata.push(stateMetadata);
  }
  
  // Create the complete metadata object
  const completeMetadata = {
    metadata: {
      timestamp: new Date().toISOString(),
      repository: projectMetadata.repository,
      user: projectMetadata.user,
      environment: projectMetadata.environment,
      appearance: display.options,
      generator: {
        name: "Minesweeper Tile Generator",
        version: "1.0.0",
        buildDate: BUILD_DATE || new Date().toISOString()
      }
    },
    tiles: tilesMetadata.map(metadata => ({
      tileState: metadata.content.tileState,
      export: metadata.export
    }))
  };
  
  return completeMetadata;
}

// Export functions
window.MetadataGenerator = {
  generateProjectMetadata,
  generateTileMetadata,
  generateCompleteMetadata
};
