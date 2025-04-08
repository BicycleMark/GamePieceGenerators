/**
 * Settings Manager for the Checker Pieces Generator
 * Handles saving and loading settings
 */
class SettingsManager {
  /**
   * Constructor for the SettingsManager class
   * @param {string} storageKey - The key to use for localStorage
   */
  constructor(storageKey = 'checkerpieces-settings') {
    this.storageKey = storageKey;
    this.defaultSettings = {
      // Board settings
      boardSize: 8,
      lightSquareColor: '#f5deb3',
      darkSquareColor: '#8b4513',
      squareSize: 90,
      
      // Piece settings
      redPieceColor: '#e74c3c',
      redPieceBorderColor: '#c0392b',
      blackPieceColor: '#2c3e50',
      blackPieceBorderColor: '#1a2530',
      pieceSize: 80,
      borderWidth: 3,
      is3D: true,
      
      // Crown settings
      crownColor: '#f1c40f',
      crownBorderColor: '#d4ac0d',
      crownStyle: 'classic',
      
      // Effects
      glowEnabled: false,
      glowColor: 'rgba(255, 255, 255, 0.7)',
      glowSize: 10,
      
      // Export settings
      exportScale: 2,
      exportFormat: 'svg',
      
      // UI settings
      showGrid: true,
      showCoordinates: false,
      
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
  
  /**
   * Apply settings to a CheckerBoard instance
   * @param {CheckerBoard} board - The CheckerBoard instance to apply settings to
   */
  applySettingsToBoard(board) {
    if (!board) return;
    
    // Apply board settings
    board.options.boardSize = this.settings.boardSize;
    board.options.lightSquareColor = this.settings.lightSquareColor;
    board.options.darkSquareColor = this.settings.darkSquareColor;
    board.options.squareSize = this.settings.squareSize;
    
    // Apply piece settings
    board.options.redPieceColor = this.settings.redPieceColor;
    board.options.redPieceBorderColor = this.settings.redPieceBorderColor;
    board.options.blackPieceColor = this.settings.blackPieceColor;
    board.options.blackPieceBorderColor = this.settings.blackPieceBorderColor;
    board.options.pieceSize = this.settings.pieceSize;
    board.options.borderWidth = this.settings.borderWidth;
    board.options.is3D = this.settings.is3D;
    
    // Update the board
    board.updateBoardColors(this.settings.lightSquareColor, this.settings.darkSquareColor);
    board.updatePieceColors(
      this.settings.redPieceColor,
      this.settings.redPieceBorderColor,
      this.settings.blackPieceColor,
      this.settings.blackPieceBorderColor
    );
  }
  
  /**
   * Apply settings to a CheckerPiece instance
   * @param {CheckerPiece} piece - The CheckerPiece instance to apply settings to
   * @param {string} type - The type of piece ('red' or 'black')
   */
  applySettingsToPiece(piece, type) {
    if (!piece) return;
    
    // Apply piece settings based on type
    if (type === 'red') {
      piece.setOption('pieceColor', this.settings.redPieceColor);
      piece.setOption('borderColor', this.settings.redPieceBorderColor);
    } else {
      piece.setOption('pieceColor', this.settings.blackPieceColor);
      piece.setOption('borderColor', this.settings.blackPieceBorderColor);
    }
    
    // Apply common settings
    piece.setOption('size', this.settings.pieceSize);
    piece.setOption('borderWidth', this.settings.borderWidth);
    piece.setOption('is3D', this.settings.is3D);
    piece.setOption('crownColor', this.settings.crownColor);
    piece.setOption('crownBorderColor', this.settings.crownBorderColor);
    piece.setOption('crownStyle', this.settings.crownStyle);
    piece.setOption('glowEnabled', this.settings.glowEnabled);
    piece.setOption('glowColor', this.settings.glowColor);
    piece.setOption('glowSize', this.settings.glowSize);
  }
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
