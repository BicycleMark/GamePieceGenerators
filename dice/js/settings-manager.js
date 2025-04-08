/**
 * Dice Generator Settings Manager
 * Manages settings and presets for the Dice Generator
 */

class SettingsManager {
  /**
   * Initialize the settings manager
   * @param {string} storageKey - Key for localStorage
   */
  constructor(storageKey = 'dice-generator-settings') {
    this.storageKey = storageKey;
    this.presetsKey = `${storageKey}-presets`;
    
    // Default settings
    this.defaultSettings = {
      dice: {
        type: 'd6',
        size: 100,
        color: '#FFFFFF',
        material: 'plastic',
        pipColor: '#000000',
        pipStyle: 'dots',
        borderWidth: 2,
        borderColor: '#CCCCCC',
        roundness: 10,
        texture: 'smooth'
      },
      animation: {
        speed: 1.0,
        friction: 0.8,
        gravity: 9.8,
        bounciness: 0.7,
        spinTime: 2000,
        rollTime: 3000
      },
      camera: {
        angle: 45,
        distance: 300,
        autoRotate: false
      },
      lighting: {
        ambient: '#FFFFFF',
        directional: '#FFFFFF',
        intensity: 0.8,
        shadows: true
      },
      export: {
        format: 'png',
        quality: 0.9,
        transparent: true,
        animationFrames: 24,
        animationLoop: true
      }
    };
    
    // Load settings from localStorage or use defaults
    this.settings = this.loadSettings();
    
    // Available materials
    this.materials = [
      { id: 'plastic', name: 'Plastic', preview: 'plastic.jpg' },
      { id: 'metal', name: 'Metal', preview: 'metal.jpg' },
      { id: 'wood', name: 'Wood', preview: 'wood.jpg' },
      { id: 'marble', name: 'Marble', preview: 'marble.jpg' },
      { id: 'glass', name: 'Glass', preview: 'glass.jpg' }
    ];
    
    // Available pip styles
    this.pipStyles = [
      { id: 'dots', name: 'Dots' },
      { id: 'numbers', name: 'Numbers' },
      { id: 'symbols', name: 'Symbols' }
    ];
    
    // Available textures
    this.textures = [
      { id: 'smooth', name: 'Smooth' },
      { id: 'rough', name: 'Rough' },
      { id: 'bumpy', name: 'Bumpy' }
    ];
    
    // Color schemes
    this.colorSchemes = {
      classic: {
        dice: {
          color: '#FFFFFF',
          pipColor: '#000000',
          borderColor: '#CCCCCC'
        }
      },
      modern: {
        dice: {
          color: '#4A90E2',
          pipColor: '#FFFFFF',
          borderColor: '#2A70C2'
        }
      },
      dark: {
        dice: {
          color: '#333333',
          pipColor: '#FFFFFF',
          borderColor: '#555555'
        }
      },
      neon: {
        dice: {
          color: '#000000',
          pipColor: '#00FF00',
          borderColor: '#00CC00'
        }
      },
      wooden: {
        dice: {
          color: '#8B4513',
          pipColor: '#FFFFFF',
          borderColor: '#5D2E0D',
          material: 'wood'
        }
      }
    };
  }
  
  /**
   * Load settings from localStorage
   * @returns {Object} The loaded settings or default settings
   */
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    return JSON.parse(JSON.stringify(this.defaultSettings));
  }
  
  /**
   * Save settings to localStorage
   * @returns {boolean} True if successful, false otherwise
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
   * @param {string} category - The settings category
   * @param {string} key - The setting key
   * @returns {*} The setting value
   */
  getSetting(category, key) {
    if (this.settings[category] && this.settings[category][key] !== undefined) {
      return this.settings[category][key];
    }
    
    if (this.defaultSettings[category] && this.defaultSettings[category][key] !== undefined) {
      return this.defaultSettings[category][key];
    }
    
    return null;
  }
  
  /**
   * Set a specific setting
   * @param {string} category - The settings category
   * @param {string} key - The setting key
   * @param {*} value - The setting value
   * @returns {boolean} True if successful, false otherwise
   */
  setSetting(category, key, value) {
    if (!this.settings[category]) {
      this.settings[category] = {};
    }
    
    this.settings[category][key] = value;
    return true;
  }
  
  /**
   * Reset settings to defaults
   * @returns {Object} The default settings
   */
  resetSettings() {
    this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
    this.saveSettings();
    return this.settings;
  }
  
  /**
   * Export settings as JSON
   * @returns {string} JSON string of settings
   */
  exportSettings() {
    return JSON.stringify(this.settings);
  }
  
  /**
   * Import settings from JSON
   * @param {string} json - JSON string of settings
   * @returns {boolean} True if successful, false otherwise
   */
  importSettings(json) {
    try {
      const importedSettings = JSON.parse(json);
      this.settings = importedSettings;
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
  
  /**
   * Get all presets
   * @returns {Array} Array of presets
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
   * Create a new preset
   * @param {string} name - Preset name
   * @returns {Object} The created preset
   */
  createPreset(name) {
    const presets = this.getPresets();
    
    const preset = {
      id: Date.now().toString(),
      name: name,
      settings: JSON.parse(JSON.stringify(this.settings))
    };
    
    presets.push(preset);
    
    try {
      localStorage.setItem(this.presetsKey, JSON.stringify(presets));
    } catch (error) {
      console.error('Error saving preset:', error);
    }
    
    return preset;
  }
  
  /**
   * Load a preset
   * @param {string} presetNameOrId - Preset name or ID
   * @returns {boolean} True if successful, false otherwise
   */
  loadPreset(presetNameOrId) {
    const presets = this.getPresets();
    
    const preset = presets.find(p => 
      p.id === presetNameOrId || p.name === presetNameOrId
    );
    
    if (preset) {
      this.settings = JSON.parse(JSON.stringify(preset.settings));
      this.saveSettings();
      return true;
    }
    
    return false;
  }
  
  /**
   * Delete a preset
   * @param {string} presetNameOrId - Preset name or ID
   * @returns {boolean} True if successful, false otherwise
   */
  deletePreset(presetNameOrId) {
    const presets = this.getPresets();
    
    const filteredPresets = presets.filter(p => 
      p.id !== presetNameOrId && p.name !== presetNameOrId
    );
    
    if (filteredPresets.length !== presets.length) {
      try {
        localStorage.setItem(this.presetsKey, JSON.stringify(filteredPresets));
        return true;
      } catch (error) {
        console.error('Error deleting preset:', error);
      }
    }
    
    // Don't save settings when preset doesn't exist
    return false;
  }
  
  /**
   * Apply a color scheme
   * @param {string} schemeName - Name of the color scheme
   * @returns {boolean} True if successful, false otherwise
   */
  applyColorScheme(schemeName) {
    const scheme = this.colorSchemes[schemeName];
    
    if (!scheme) {
      // Don't save settings when scheme doesn't exist
      return false;
    }
    
    // Apply scheme settings to current settings
    for (const category in scheme) {
      for (const key in scheme[category]) {
        this.setSetting(category, key, scheme[category][key]);
      }
    }
    
    this.saveSettings();
    return true;
  }
}

// Export for use in Node.js environments (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
