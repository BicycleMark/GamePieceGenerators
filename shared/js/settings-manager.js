/**
 * SharedSettingsManager - A shared settings manager for display components
 * This module contains shared functionality between the Minesweeper Tile and 7-Segment LED Display settings managers
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
 * @param {Object} display - The display instance
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 * @returns {Object} - Metadata object
 */
function generateMetadata(display, displayType) {
  // Common metadata structure
  const metadata = {
    generator: {
      name: displayType === 'minesweeper' ? 'Minesweeper Tile Generator' : '7-Segment LED Display Generator',
      version: VERSION.toString(),
      versionDetails: VERSION.full(),
      buildDate: BUILD_DATE
    }
  };
  
  // Add display-specific content
  if (displayType === 'minesweeper') {
    metadata.content = {
      tileState: display.currentState,
      displayType: 'minesweeper-tile'
    };
    metadata.appearance = { ...display.options };
  } else if (displayType === '7segment') {
    metadata.content = {
      digit: display.currentDigit,
      displayType: '7-segment'
    };
    metadata.appearance = { ...display.options };
  }
  
  return metadata;
}

/**
 * Apply settings from metadata to the display
 * @param {Object} metadata - Metadata object with settings
 * @param {Object} display - The display instance
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 */
function applySettingsFromMetadata(metadata, display, displayType) {
  // Apply content settings based on display type
  if (metadata.content) {
    if (displayType === 'minesweeper' && metadata.content.tileState !== undefined) {
      display.setState(metadata.content.tileState);
    } else if (displayType === '7segment' && metadata.content.digit !== undefined) {
      display.setDigit(metadata.content.digit);
    }
  }
  
  // Apply appearance settings (works for any display type)
  if (metadata.appearance) {
    const appearance = metadata.appearance;
    
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
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 */
function updateControlsFromSettings(metadata, controls, displayType) {
  // Update content controls based on display type
  if (metadata.content) {
    if (displayType === 'minesweeper' && metadata.content.tileState !== undefined) {
      controls.tileStateSelector.value = metadata.content.tileState;
    } else if (displayType === '7segment' && metadata.content.digit !== undefined) {
      controls.digitSelector.value = metadata.content.digit;
    }
  }
  
  // Update appearance controls
  if (metadata.appearance) {
    const appearance = metadata.appearance;
    
    // Update common controls
    if (displayType === 'minesweeper') {
      // Update minesweeper-specific controls
      updateMinesweeperControls(appearance, controls);
    } else if (displayType === '7segment') {
      // Update 7-segment-specific controls
      updateSevenSegmentControls(appearance, controls);
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
 * Update Minesweeper-specific controls
 * @param {Object} appearance - Appearance settings
 * @param {Object} controls - UI controls
 */
function updateMinesweeperControls(appearance, controls) {
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

/**
 * Update 7-Segment-specific controls
 * @param {Object} appearance - Appearance settings
 * @param {Object} controls - UI controls
 */
function updateSevenSegmentControls(appearance, controls) {
  if (appearance.foregroundColor) {
    controls.foregroundColorPicker.value = appearance.foregroundColor;
    controls.foregroundColorText.value = appearance.foregroundColor;
  }
  
  if (appearance.backgroundColor) {
    controls.backgroundColorPicker.value = appearance.backgroundColor;
    controls.backgroundColorText.value = appearance.backgroundColor;
  }
  
  if (appearance.opacityOffSegment !== undefined) {
    const opacityPercent = Math.round(appearance.opacityOffSegment * 100);
    controls.opacitySlider.value = opacityPercent;
    controls.opacityValue.textContent = `${opacityPercent}%`;
  }
  
  if (appearance.glowEnabled !== undefined) {
    controls.glowEffectToggle.checked = appearance.glowEnabled;
  }
  
  if (appearance.edgeRadius !== undefined) {
    controls.edgeRadiusSlider.value = appearance.edgeRadius;
    controls.edgeRadiusValue.textContent = appearance.edgeRadius.toString();
  }
}

/**
 * Create a settings.json file with current settings
 * @param {Object} display - The display instance
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 */
function createSettingsFile(display, displayType) {
  const settings = generateMetadata(display, displayType);
  settings.meta = {
    type: "user-settings",
    lastModified: new Date().toISOString(),
    description: `User settings for the ${displayType === 'minesweeper' ? 'Minesweeper Tile' : '7-Segment LED Display'} Generator`
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
  
  // Also save to local storage with appropriate key
  const storageKey = displayType === 'minesweeper' ? 'minesweeper-last-settings' : '7segment-last-settings';
  localStorage.setItem(storageKey, jsonString);
  
  return settings;
}

/**
 * Create a defaults.json file with factory default settings
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 */
function createDefaultsFile(displayType) {
  // Create a temporary display with default settings
  let tempDisplay;
  
  if (displayType === 'minesweeper') {
    tempDisplay = {
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
  } else if (displayType === '7segment') {
    tempDisplay = {
      currentDigit: '8',
      options: {
        backgroundColor: '#000000',
        foregroundColor: '#ff0000',
        opacityOffSegment: 0.15,
        width: 50,
        height: 100,
        glowEnabled: true,
        edgeRadius: 0
      }
    };
  }
  
  const settings = generateMetadata(tempDisplay, displayType);
  settings.meta = {
    type: "defaults",
    description: `Factory default settings for the ${displayType === 'minesweeper' ? 'Minesweeper Tile' : '7-Segment LED Display'} Generator`
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
 * @param {Object} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 * @returns {Promise<Object>} - Promise resolving to the loaded settings
 */
function loadSettingsFromFile(file, display, controls, displayType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const settings = JSON.parse(e.target.result);
        applySettingsFromMetadata(settings, display, displayType);
        updateControlsFromSettings(settings, controls, displayType);
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
 * @param {Object} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromUrl(display, controls, displayType) {
  try {
    // Check if window and location are defined
    if (typeof window === 'undefined' || !window.location || !window.location.search) {
      console.log('Window or location not available for URL parameter loading');
      return false;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('settings')) {
      const settingsJson = decodeURIComponent(urlParams.get('settings'));
      const settings = JSON.parse(settingsJson);
      applySettingsFromMetadata(settings, display, displayType);
      updateControlsFromSettings(settings, controls, displayType);
      return true;
    }
  } catch (error) {
    console.error('Error loading settings from URL:', error);
  }
  
  return false;
}

/**
 * Try to load settings from local storage
 * @param {Object} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromLocalStorage(display, controls, displayType) {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.log('localStorage is not available');
      return false;
    }
    
    const storageKey = displayType === 'minesweeper' ? 'minesweeper-last-settings' : '7segment-last-settings';
    const savedSettings = localStorage.getItem(storageKey);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      applySettingsFromMetadata(settings, display, displayType);
      updateControlsFromSettings(settings, controls, displayType);
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
 * @param {Object} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 * @returns {Promise<boolean>} - Promise resolving to whether settings were loaded
 */
async function loadSettingsFromServer(url, display, controls, displayType) {
  try {
    // Check if fetch is available
    if (typeof fetch === 'undefined') {
      console.log('fetch is not available');
      return false;
    }
    
    const response = await fetch(url);
    if (response.ok) {
      const settings = await response.json();
      applySettingsFromMetadata(settings, display, displayType);
      updateControlsFromSettings(settings, controls, displayType);
      return true;
    }
  } catch (error) {
    console.log(`No settings file found at ${url} or error loading it:`, error);
  }
  
  return false;
}

/**
 * Initialize settings with proper fallbacks
 * @param {Object} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @param {string} displayType - The type of display ('minesweeper' or '7segment')
 * @returns {Promise<Object>} - Promise resolving to the settings source info
 */
async function initializeSettings(display, controls, displayType) {
  let settingsSource = 'hardcoded defaults';
  let loaded = false;
  
  // Try URL parameters first (highest priority)
  try {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('settings')) {
          loaded = loadSettingsFromUrl(display, controls, displayType);
          if (loaded) {
            settingsSource = 'URL parameters';
          }
        }
      } catch (urlError) {
        console.error('Error parsing URL parameters:', urlError);
      }
    }
  } catch (error) {
    console.error('Error checking URL parameters:', error);
  }
  
  // If no URL parameters, try local storage
  if (!loaded) {
    try {
      loaded = loadSettingsFromLocalStorage(display, controls, displayType);
      if (loaded) {
        settingsSource = 'previous session';
      }
    } catch (storageError) {
      console.error('Error loading from local storage:', storageError);
    }
  }
  
  // If no local storage, try user settings file
  if (!loaded) {
    try {
      loaded = await loadSettingsFromServer('svg/settings.json', display, controls, displayType);
      if (loaded) {
        settingsSource = 'user settings file';
      }
    } catch (serverError) {
      console.error('Error loading from settings.json:', serverError);
    }
  }
  
  // If no user settings, try factory defaults
  if (!loaded) {
    try {
      loaded = await loadSettingsFromServer('svg/defaults.json', display, controls, displayType);
      if (loaded) {
        settingsSource = 'factory defaults file';
      }
    } catch (defaultsError) {
      console.error('Error loading from defaults.json:', defaultsError);
    }
  }
  
  // Log the settings source
  console.log(`Settings initialized from: ${settingsSource}`);
  
  return { source: settingsSource, loaded };
}

// Create the SharedSettingsManager object
var SharedSettingsManagerObj = {
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
  window.SharedSettingsManager = SharedSettingsManagerObj;
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SharedSettingsManagerObj;
}
