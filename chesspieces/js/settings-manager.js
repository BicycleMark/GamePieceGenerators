/**
 * Settings Manager for Chess Pieces Generator
 * Handles saving, loading, and managing settings
 */
class SettingsManager {
  /**
   * Initialize the settings manager
   * @param {string} storageKey - Key to use for localStorage
   */
  constructor(storageKey = 'chess-pieces-settings') {
    this.storageKey = storageKey;
    this.presetsKey = `${storageKey}-presets`;
    
    // Default settings
    this.defaultSettings = {
      board: {
        lightSquareColor: '#F0D9B5',
        darkSquareColor: '#B58863',
        size: 8,
        squareSize: 60
      },
      pieces: {
        whiteColor: '#FFFFFF',
        whiteBorderColor: '#CCCCCC',
        blackColor: '#000000',
        blackBorderColor: '#333333',
        size: 50,
        borderWidth: 2,
        is3D: true,
        style: 'classic'
      },
      effects: {
        glowEnabled: false,
        glowSize: 5,
        glowColor: '#4A90E2',
        shadowEnabled: true,
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    };
    
    // Load settings from localStorage or use defaults
    this.settings = this.loadSettings();
  }
  
  /**
   * Load settings from localStorage
   * @returns {Object} The loaded settings or default settings
   */
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with default settings to ensure all properties exist
        return this.mergeWithDefaults(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    return { ...this.defaultSettings };
  }
  
  /**
   * Merge saved settings with defaults to ensure all properties exist
   * @param {Object} savedSettings - The settings loaded from storage
   * @returns {Object} Complete settings object with all required properties
   */
  mergeWithDefaults(savedSettings) {
    const mergedSettings = { ...this.defaultSettings };
    
    // Merge board settings
    if (savedSettings.board) {
      mergedSettings.board = { ...mergedSettings.board, ...savedSettings.board };
    }
    
    // Merge pieces settings
    if (savedSettings.pieces) {
      mergedSettings.pieces = { ...mergedSettings.pieces, ...savedSettings.pieces };
    }
    
    // Merge effects settings
    if (savedSettings.effects) {
      mergedSettings.effects = { ...mergedSettings.effects, ...savedSettings.effects };
    }
    
    return mergedSettings;
  }
  
  /**
   * Save current settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
  
  /**
   * Get a specific setting
   * @param {string} category - Category of the setting (board, pieces, effects)
   * @param {string} name - Name of the setting
   * @returns {any} The setting value
   */
  getSetting(category, name) {
    if (this.settings[category] && this.settings[category][name] !== undefined) {
      return this.settings[category][name];
    }
    
    // Return default if setting doesn't exist
    if (this.defaultSettings[category] && this.defaultSettings[category][name] !== undefined) {
      return this.defaultSettings[category][name];
    }
    
    return null;
  }
  
  /**
   * Set a specific setting
   * @param {string} category - Category of the setting (board, pieces, effects)
   * @param {string} name - Name of the setting
   * @param {any} value - Value to set
   * @returns {boolean} True if successful, false otherwise
   */
  setSetting(category, name, value) {
    if (!this.settings[category]) {
      return false;
    }
    
    this.settings[category][name] = value;
    return true;
  }
  
  /**
   * Reset settings to defaults
   * @returns {Object} The default settings
   */
  resetSettings() {
    this.settings = { ...this.defaultSettings };
    this.saveSettings();
    return this.settings;
  }
  
  /**
   * Export settings as JSON string
   * @returns {string} JSON string of current settings
   */
  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  }
  
  /**
   * Import settings from JSON string
   * @param {string} jsonString - JSON string of settings to import
   * @returns {boolean} True if successful, false otherwise
   */
  importSettings(jsonString) {
    try {
      const importedSettings = JSON.parse(jsonString);
      this.settings = this.mergeWithDefaults(importedSettings);
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
  
  /**
   * Create a preset with the current settings
   * @param {string} name - Name of the preset
   * @returns {Object} The created preset
   */
  createPreset(name) {
    const preset = {
      name,
      settings: { ...this.settings },
      created: new Date().toISOString()
    };
    
    // Load existing presets
    const presets = this.getPresets();
    
    // Add new preset
    presets.push(preset);
    
    // Save presets
    try {
      localStorage.setItem(this.presetsKey, JSON.stringify(presets));
    } catch (error) {
      console.error('Error saving preset:', error);
    }
    
    return preset;
  }
  
  /**
   * Get all saved presets
   * @returns {Array} Array of preset objects
   */
  getPresets() {
    try {
      const savedPresets = localStorage.getItem(this.presetsKey);
      if (savedPresets) {
        return JSON.parse(savedPresets);
      }
    } catch (error) {
      console.error('Error loading presets:', error);
    }
    
    return [];
  }
  
  /**
   * Load a preset by name
   * @param {string} name - Name of the preset to load
   * @returns {boolean} True if successful, false otherwise
   */
  loadPreset(name) {
    const presets = this.getPresets();
    const preset = presets.find(p => p.name === name);
    
    if (preset) {
      this.settings = this.mergeWithDefaults(preset.settings);
      this.saveSettings();
      return true;
    }
    
    return false;
  }
  
  /**
   * Delete a preset by name
   * @param {string} name - Name of the preset to delete
   * @returns {boolean} True if successful, false otherwise
   */
  deletePreset(name) {
    const presets = this.getPresets();
    const initialLength = presets.length;
    
    const filteredPresets = presets.filter(p => p.name !== name);
    
    if (filteredPresets.length < initialLength) {
      try {
        localStorage.setItem(this.presetsKey, JSON.stringify(filteredPresets));
        return true;
      } catch (error) {
        console.error('Error deleting preset:', error);
      }
    }
    
    return false;
  }
  
  /**
   * Apply a predefined color scheme
   * @param {string} schemeName - Name of the color scheme to apply
   * @returns {boolean} True if successful, false otherwise
   */
  applyColorScheme(schemeName) {
    const colorSchemes = {
      classic: {
        board: {
          lightSquareColor: '#F0D9B5',
          darkSquareColor: '#B58863'
        },
        pieces: {
          whiteColor: '#FFFFFF',
          whiteBorderColor: '#CCCCCC',
          blackColor: '#000000',
          blackBorderColor: '#333333'
        }
      },
      modern: {
        board: {
          lightSquareColor: '#EEEED2',
          darkSquareColor: '#769656'
        },
        pieces: {
          whiteColor: '#E8E8E8',
          whiteBorderColor: '#CCCCCC',
          blackColor: '#202020',
          blackBorderColor: '#333333'
        }
      },
      tournament: {
        board: {
          lightSquareColor: '#FFCE9E',
          darkSquareColor: '#D18B47'
        },
        pieces: {
          whiteColor: '#FFFAFA',
          whiteBorderColor: '#DDDDDD',
          blackColor: '#1A1110',
          blackBorderColor: '#444444'
        }
      },
      colorful: {
        board: {
          lightSquareColor: '#ECECD7',
          darkSquareColor: '#7389A9'
        },
        pieces: {
          whiteColor: '#E6BC5C',
          whiteBorderColor: '#D4A848',
          blackColor: '#7C4C3E',
          blackBorderColor: '#5A382E'
        }
      }
    };
    
    const scheme = colorSchemes[schemeName];
    if (!scheme) {
      return false;
    }
    
    // Apply board colors
    if (scheme.board) {
      Object.keys(scheme.board).forEach(key => {
        this.setSetting('board', key, scheme.board[key]);
      });
    }
    
    // Apply piece colors
    if (scheme.pieces) {
      Object.keys(scheme.pieces).forEach(key => {
        this.setSetting('pieces', key, scheme.pieces[key]);
      });
    }
    
    this.saveSettings();
    return true;
  }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
