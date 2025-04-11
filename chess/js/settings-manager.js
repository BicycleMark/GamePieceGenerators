/**
 * Settings Manager for the Chess Piece Generator
 * Handles saving and loading settings
 */
class SettingsManager {
  /**
   * Constructor for the SettingsManager class
   * @param {string} storageKey - The key to use for localStorage
   */
  constructor(storageKey = 'chess-settings') {
    this.storageKey = storageKey;
    this.defaultSettings = {
      // Piece settings
      pieceType: 'bishop',
      theme: 'dark',
      pieceSize: 150,
      
      // Export settings
      exportScale: 2,
      exportFormat: 'svg',
      
      // Version for compatibility
      version: '1.0.0'
    };
    
    // Initialize settings
    this.settings = this.loadSettings();
  }
  
  /**
   * Load settings from localStorage
   * @returns {Object} - The loaded settings or default settings if none exist
   */
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with default settings to ensure all properties exist
        return { ...this.defaultSettings, ...parsedSettings };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    return { ...this.defaultSettings };
  }
  
  /**
   * Save settings to localStorage
   * @returns {boolean} - Whether the save was successful
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
   * @param {string} key - The setting key to get
   * @returns {any} - The setting value
   */
  getSetting(key) {
    return this.settings[key];
  }
  
  /**
   * Set a specific setting
   * @param {string} key - The setting key to set
   * @param {any} value - The value to set
   * @returns {boolean} - Whether the set was successful
   */
  setSetting(key, value) {
    if (key in this.settings) {
      this.settings[key] = value;
      return true;
    }
    return false;
  }
  
  /**
   * Reset settings to defaults
   * @returns {Object} - The default settings
   */
  resetSettings() {
    this.settings = { ...this.defaultSettings };
    this.saveSettings();
    return this.settings;
  }
  
  /**
   * Export settings as JSON
   * @returns {string} - The settings as a JSON string
   */
  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  }
  
  /**
   * Import settings from JSON
   * @param {string} json - The JSON string to import
   * @returns {boolean} - Whether the import was successful
   */
  importSettings(json) {
    try {
      const importedSettings = JSON.parse(json);
      // Validate imported settings
      if (typeof importedSettings !== 'object' || importedSettings === null) {
        throw new Error('Invalid settings format');
      }
      
      // Merge with default settings to ensure all properties exist
      this.settings = { ...this.defaultSettings, ...importedSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
  
  /**
   * Create a preset with the current settings
   * @param {string} name - The name of the preset
   * @returns {Object} - The created preset
   */
  createPreset(name) {
    const preset = {
      name,
      settings: { ...this.settings },
      created: new Date().toISOString()
    };
    
    // Get existing presets
    let presets = this.getPresets();
    
    // Add the new preset
    presets.push(preset);
    
    // Save presets
    localStorage.setItem(`${this.storageKey}-presets`, JSON.stringify(presets));
    
    return preset;
  }
  
  /**
   * Get all saved presets
   * @returns {Array} - Array of preset objects
   */
  getPresets() {
    try {
      const savedPresets = localStorage.getItem(`${this.storageKey}-presets`);
      if (savedPresets) {
        return JSON.parse(savedPresets);
      }
    } catch (error) {
      console.error('Error loading presets:', error);
    }
    
    return [];
  }
  
  /**
   * Load a preset
   * @param {string} presetName - The name of the preset to load
   * @returns {boolean} - Whether the preset was loaded successfully
   */
  loadPreset(presetName) {
    const presets = this.getPresets();
    const preset = presets.find(p => p.name === presetName);
    
    if (preset && preset.settings) {
      // Merge with default settings to ensure all properties exist
      this.settings = { ...this.defaultSettings, ...preset.settings };
      this.saveSettings();
      return true;
    }
    
    return false;
  }
  
  /**
   * Delete a preset
   * @param {string} presetName - The name of the preset to delete
   * @returns {boolean} - Whether the preset was deleted successfully
   */
  deletePreset(presetName) {
    let presets = this.getPresets();
    const initialLength = presets.length;
    
    presets = presets.filter(p => p.name !== presetName);
    
    if (presets.length !== initialLength) {
      localStorage.setItem(`${this.storageKey}-presets`, JSON.stringify(presets));
      return true;
    }
    
    return false;
  }
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
