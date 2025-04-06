/**
 * Settings and Metadata Management for Minesweeper Tile Generator
 */

// Version information
const VERSION = {
  MAJOR: 1,
  MINOR: 0,
  PATCH: 0,
  toString: function() {
    return `${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
  },
  full: function() {
    return {
      major: this.MAJOR,
      minor: this.MINOR,
      patch: this.PATCH,
      string: this.toString()
    };
  }
};

// Build date (updated when the code is built/deployed)
const BUILD_DATE = new Date().toISOString();

/**
 * Generate metadata object with all settings and information
 * @param {MinesweeperTileDisplay} display - The display instance
 * @returns {Object} - Metadata object
 */
function generateMetadata(display) {
  return {
    // Content information
    content: {
      tileState: display.currentState,
      displayType: "minesweeper-tile"
    },
    // Appearance settings
    appearance: {
      unplayedColor: display.options.unplayedColor,
      revealedColor: display.options.revealedColor,
      borderColor: display.options.borderColor,
      highlightColor: display.options.highlightColor,
      shadowColor: display.options.shadowColor,
      numberOutlineColor: display.options.numberOutlineColor,
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
    // Generator information
    generator: {
      name: "Minesweeper Tile Generator",
      version: VERSION.toString(),
      versionDetails: VERSION.full(),
      buildDate: BUILD_DATE
    }
  };
}

/**
 * Apply settings from metadata to the display
 * @param {Object} metadata - Metadata object with settings
 * @param {MinesweeperTileDisplay} display - The display instance
 */
function applySettingsFromMetadata(metadata, display) {
  // Apply content settings
  if (metadata.content && metadata.content.tileState !== undefined) {
    display.setState(metadata.content.tileState);
  }
  
  // Apply appearance settings
  if (metadata.appearance) {
    const appearance = metadata.appearance;
    
    // Apply each appearance setting
    for (const [key, value] of Object.entries(appearance)) {
      if (value !== undefined) {
        display.setOption(key, value);
      }
    }
  }
}

/**
 * Update UI controls to reflect the settings from metadata
 * @param {Object} metadata - Metadata object with settings
 * @param {Object} controls - Object with UI control elements
 */
function updateControlsFromSettings(metadata, controls) {
  // Update tile state selector
  if (metadata.content && metadata.content.tileState !== undefined) {
    controls.tileStateSelector.value = metadata.content.tileState;
  }
  
  // Update appearance controls
  if (metadata.appearance) {
    const appearance = metadata.appearance;
    
    // Update color pickers and text inputs
    if (appearance.unplayedColor) {
      controls.unplayedColorPicker.value = appearance.unplayedColor;
      controls.unplayedColorText.value = appearance.unplayedColor;
    }
    
    if (appearance.revealedColor) {
      controls.revealedColorPicker.value = appearance.revealedColor;
      controls.revealedColorText.value = appearance.revealedColor;
    }
    
    if (appearance.borderColor) {
      controls.borderColorPicker.value = appearance.borderColor;
      controls.borderColorText.value = appearance.borderColor;
    }
    
    if (appearance.highlightColor) {
      controls.highlightColorPicker.value = appearance.highlightColor;
      controls.highlightColorText.value = appearance.highlightColor;
    }
    
    if (appearance.shadowColor) {
      controls.shadowColorPicker.value = appearance.shadowColor;
      controls.shadowColorText.value = appearance.shadowColor;
    }
    
    if (appearance.numberOutlineColor) {
      controls.numberOutlineColorPicker.value = appearance.numberOutlineColor;
      controls.numberOutlineColorText.value = appearance.numberOutlineColor;
    }
    
    // Update number colors
    for (let i = 1; i <= 8; i++) {
      const colorKey = `number${i}Color`;
      if (appearance[colorKey]) {
        controls[`number${i}ColorPicker`].value = appearance[colorKey];
      }
    }
    
    // Update special element colors
    if (appearance.mineColor) {
      controls.mineColorPicker.value = appearance.mineColor;
      controls.mineColorText.value = appearance.mineColor;
    }
    
    if (appearance.flagColor) {
      controls.flagColorPicker.value = appearance.flagColor;
      controls.flagColorText.value = appearance.flagColor;
    }
    
    if (appearance.wrongGuessColor) {
      controls.wrongGuessColorPicker.value = appearance.wrongGuessColor;
      controls.wrongGuessColorText.value = appearance.wrongGuessColor;
    }
    
    // Update sliders
    if (appearance.shadowOpacity !== undefined) {
      const shadowOpacityPercent = Math.round(appearance.shadowOpacity * 100);
      controls.shadowOpacitySlider.value = shadowOpacityPercent;
      controls.shadowOpacityValue.textContent = `${shadowOpacityPercent}%`;
    }
    
    if (appearance.highlightOpacity !== undefined) {
      const highlightOpacityPercent = Math.round(appearance.highlightOpacity * 100);
      controls.highlightOpacitySlider.value = highlightOpacityPercent;
      controls.highlightOpacityValue.textContent = `${highlightOpacityPercent}%`;
    }
    
    if (appearance.innerShadowBlur !== undefined) {
      controls.innerShadowBlurSlider.value = appearance.innerShadowBlur;
      controls.innerShadowBlurValue.textContent = appearance.innerShadowBlur.toString();
    }
    
    if (appearance.innerShadowOffset !== undefined) {
      controls.innerShadowOffsetSlider.value = appearance.innerShadowOffset;
      controls.innerShadowOffsetValue.textContent = appearance.innerShadowOffset.toString();
    }
    
    // Update toggles
    if (appearance.innerShadowEnabled !== undefined) {
      controls.innerShadowEffectToggle.checked = appearance.innerShadowEnabled;
    }
    
    // Update tile size
    if (appearance.tileSize !== undefined) {
      controls.tileSizeSelector.value = appearance.tileSize.toString();
    }
  }
  
  // Update output format if present
  if (metadata.export && metadata.export.format) {
    const format = metadata.export.format.toLowerCase();
    controls.outputFormatRadios.forEach(radio => {
      if (radio.value === format) {
        radio.checked = true;
        // Update copy button text if updateCopyButtonText function exists
        if (typeof updateCopyButtonText === 'function') {
          updateCopyButtonText();
        }
      }
    });
  }
}

/**
 * Create a settings.json file with current settings
 * @param {MinesweeperTileDisplay} display - The display instance
 */
function createSettingsFile(display) {
  const settings = generateMetadata(display);
  settings.meta = {
    type: "user-settings",
    lastModified: new Date().toISOString(),
    description: "User settings for the Minesweeper Tile Generator"
  };
  
  const jsonString = JSON.stringify(settings, null, 2);
  
  // Create download
  const blob = new Blob([jsonString], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'settings.json';
  link.click();
  
  URL.revokeObjectURL(url);
  
  // Also save to local storage
  localStorage.setItem('minesweeper-last-settings', jsonString);
  
  return settings;
}

/**
 * Create a defaults.json file with factory default settings
 */
function createDefaultsFile() {
  // Create a temporary display with default settings
  const tempElement = document.createElement('div');
  // Use a mock display instead of MinesweeperTileDisplay for testing
  const tempDisplay = {
    currentState: 'unplayed',
    options: {
      unplayedColor: '#4a90e2',
      revealedColor: '#C0C0C0',
      borderColor: '#2c3e50',
      highlightColor: '#ffffff',
      shadowColor: '#2c3e50',
      numberOutlineColor: '#ffffff',
      number1Color: '#0000FF',
      number2Color: '#008000',
      number3Color: '#FF0000',
      number4Color: '#000080',
      number5Color: '#800000',
      number6Color: '#008080',
      number7Color: '#000000',
      number8Color: '#808080',
      mineColor: '#000000',
      flagColor: '#FF0000',
      wrongGuessColor: '#FF0000',
      shadowOpacity: 0.8,
      highlightOpacity: 0.7,
      innerShadowEnabled: true,
      innerShadowBlur: 1,
      innerShadowOffset: 2,
      tileSize: 150
    }
  };
  
  const settings = generateMetadata(tempDisplay);
  settings.meta = {
    type: "defaults",
    description: "Factory default settings for the Minesweeper Tile Generator"
  };
  
  const jsonString = JSON.stringify(settings, null, 2);
  
  // Create download
  const blob = new Blob([jsonString], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'defaults.json';
  link.click();
  
  URL.revokeObjectURL(url);
  
  return settings;
}

/**
 * Load settings from a JSON file
 * @param {File} file - JSON file to load
 * @param {MinesweeperTileDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {Promise<Object>} - Promise resolving to the loaded settings
 */
function loadSettingsFromFile(file, display, controls) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const settings = JSON.parse(e.target.result);
        applySettingsFromMetadata(settings, display);
        updateControlsFromSettings(settings, controls);
        resolve(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
        reject(error);
      }
    };
    
    reader.onerror = function(e) {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Try to load settings from URL parameters
 * @param {MinesweeperTileDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromUrl(display, controls) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('settings')) {
      const settingsJson = decodeURIComponent(urlParams.get('settings'));
      const settings = JSON.parse(settingsJson);
      applySettingsFromMetadata(settings, display);
      updateControlsFromSettings(settings, controls);
      return true;
    }
  } catch (error) {
    console.error('Error loading settings from URL:', error);
  }
  
  return false;
}

/**
 * Try to load settings from local storage
 * @param {MinesweeperTileDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromLocalStorage(display, controls) {
  try {
    const savedSettings = localStorage.getItem('minesweeper-last-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      applySettingsFromMetadata(settings, display);
      updateControlsFromSettings(settings, controls);
      return true;
    }
  } catch (error) {
    console.error('Error loading settings from local storage:', error);
  }
  
  return false;
}

/**
 * Try to load settings from a JSON file on the server
 * @param {string} url - URL of the JSON file
 * @param {MinesweeperTileDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {Promise<boolean>} - Promise resolving to whether settings were loaded
 */
async function loadSettingsFromServer(url, display, controls) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const settings = await response.json();
      applySettingsFromMetadata(settings, display);
      updateControlsFromSettings(settings, controls);
      return true;
    }
  } catch (error) {
    console.log(`No settings file found at ${url} or error loading it:`, error);
  }
  
  return false;
}

/**
 * Initialize settings with proper fallbacks
 * @param {MinesweeperTileDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {Promise<Object>} - Promise resolving to the settings source info
 */
async function initializeSettings(display, controls) {
  let settingsSource = 'hardcoded defaults';
  let loaded = false;
  
  // Try URL parameters first (highest priority)
  if (window.location.search.includes('settings')) {
    loaded = loadSettingsFromUrl(display, controls);
    if (loaded) {
      settingsSource = 'URL parameters';
    }
  }
  
  // If no URL parameters, try local storage
  if (!loaded) {
    loaded = loadSettingsFromLocalStorage(display, controls);
    if (loaded) {
      settingsSource = 'previous session';
    }
  }
  
  // If no local storage, try user settings file
  if (!loaded) {
    loaded = await loadSettingsFromServer('svg/settings.json', display, controls);
    if (loaded) {
      settingsSource = 'user settings file';
    }
  }
  
  // If no user settings, try factory defaults
  if (!loaded) {
    loaded = await loadSettingsFromServer('svg/defaults.json', display, controls);
    if (loaded) {
      settingsSource = 'factory defaults file';
    }
  }
  
  // Log the settings source
  console.log(`Settings initialized from: ${settingsSource}`);
  
  return { source: settingsSource, loaded };
}

// Export functions
const SettingsManager = {
  generateMetadata,
  applySettingsFromMetadata,
  updateControlsFromSettings,
  createSettingsFile,
  createDefaultsFile,
  loadSettingsFromFile,
  loadSettingsFromUrl,
  loadSettingsFromLocalStorage,
  loadSettingsFromServer,
  initializeSettings,
  VERSION,
  BUILD_DATE
};

// For browser environment
if (typeof window !== 'undefined') {
  window.SettingsManager = SettingsManager;
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
