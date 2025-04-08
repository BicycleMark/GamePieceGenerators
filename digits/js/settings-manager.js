/**
 * Settings and Metadata Management for 7-Segment LED Display Generator
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
 * @param {SevenSegmentDisplay} display - The display instance
 * @returns {Object} - Metadata object
 */
function generateMetadata(display) {
  return {
    // Content information
    content: {
      digit: display.currentDigit,
      displayType: "7-segment"
    },
    // Appearance settings
    appearance: {
      foregroundColor: display.options.foregroundColor,
      backgroundColor: display.options.backgroundColor,
      opacityOffSegment: display.options.opacityOffSegment,
      glowEnabled: display.options.glowEnabled,
      edgeRadius: display.options.edgeRadius
    },
    // Generator information
    generator: {
      name: "7-Segment LED Display Generator",
      version: VERSION.toString(),
      versionDetails: VERSION.full(),
      buildDate: BUILD_DATE
    }
  };
}

/**
 * Apply settings from metadata to the display
 * @param {Object} metadata - Metadata object with settings
 * @param {SevenSegmentDisplay} display - The display instance
 */
function applySettingsFromMetadata(metadata, display) {
  // Apply content settings
  if (metadata.content && metadata.content.digit !== undefined) {
    display.setDigit(metadata.content.digit);
  }
  
  // Apply appearance settings
  if (metadata.appearance) {
    const appearance = metadata.appearance;
    
    if (appearance.foregroundColor) {
      display.setOption('foregroundColor', appearance.foregroundColor);
    }
    
    if (appearance.backgroundColor) {
      display.setOption('backgroundColor', appearance.backgroundColor);
    }
    
    if (appearance.opacityOffSegment !== undefined) {
      display.setOption('opacityOffSegment', appearance.opacityOffSegment);
    }
    
    if (appearance.glowEnabled !== undefined) {
      display.setOption('glowEnabled', appearance.glowEnabled);
    }
    
    if (appearance.edgeRadius !== undefined) {
      display.setOption('edgeRadius', appearance.edgeRadius);
    }
  }
}

/**
 * Update UI controls to reflect the settings from metadata
 * @param {Object} metadata - Metadata object with settings
 * @param {Object} controls - Object with UI control elements
 */
function updateControlsFromSettings(metadata, controls) {
  // Update digit selector
  if (metadata.content && metadata.content.digit !== undefined) {
    controls.digitSelector.value = metadata.content.digit;
  }
  
  // Update appearance controls
  if (metadata.appearance) {
    const appearance = metadata.appearance;
    
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
 * @param {SevenSegmentDisplay} display - The display instance
 */
function createSettingsFile(display) {
  const settings = generateMetadata(display);
  settings.meta = {
    type: "user-settings",
    lastModified: new Date().toISOString(),
    description: "User settings for the 7-Segment LED Display Generator"
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
  localStorage.setItem('7segment-last-settings', jsonString);
  
  return settings;
}

/**
 * Create a defaults.json file with factory default settings
 */
function createDefaultsFile() {
  // Create a temporary display with default settings
  const tempElement = document.createElement('div');
  // Use a mock display instead of SevenSegmentDisplay for testing
  const tempDisplay = {
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
  
  const settings = generateMetadata(tempDisplay);
  settings.meta = {
    type: "defaults",
    description: "Factory default settings for the 7-Segment LED Display Generator"
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
 * @param {SevenSegmentDisplay} display - The display instance
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
 * @param {SevenSegmentDisplay} display - The display instance
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
 * @param {SevenSegmentDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromLocalStorage(display, controls) {
  try {
    const savedSettings = localStorage.getItem('7segment-last-settings');
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
 * @param {SevenSegmentDisplay} display - The display instance
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
 * @param {SevenSegmentDisplay} display - The display instance
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
