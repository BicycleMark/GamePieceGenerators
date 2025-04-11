/**
 * Tests for Chess Pieces Generator Settings Manager
 */

const SettingsManager = require('../../chess/js/settings-manager');

describe('Chess Pieces Settings Manager', () => {
  let settingsManager;
  let originalLocalStorage;
  
  // Mock localStorage
  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        store
      };
    })();
    
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Create a new settings manager for each test
    settingsManager = new SettingsManager('test-chess-pieces-settings');
  });
  
  // Restore original localStorage
  afterEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });
  
  test('should initialize with default settings', () => {
    // Check that default settings are set
    expect(settingsManager.settings).toBeDefined();
    expect(settingsManager.settings.board).toBeDefined();
    expect(settingsManager.settings.pieces).toBeDefined();
    expect(settingsManager.settings.effects).toBeDefined();
    
    // Check specific default values
    expect(settingsManager.settings.board.lightSquareColor).toBe('#F0D9B5');
    expect(settingsManager.settings.board.darkSquareColor).toBe('#B58863');
    expect(settingsManager.settings.pieces.whiteColor).toBe('#FFFFFF');
    expect(settingsManager.settings.pieces.blackColor).toBe('#000000');
  });
  
  test('should save and load settings from localStorage', () => {
    // Modify some settings
    settingsManager.setSetting('board', 'lightSquareColor', '#EEEED2');
    settingsManager.setSetting('pieces', 'whiteColor', '#E8E8E8');
    
    // Save settings
    const saveResult = settingsManager.saveSettings();
    expect(saveResult).toBe(true);
    
    // Check that localStorage.setItem was called with the correct key and value
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test-chess-pieces-settings',
      expect.any(String)
    );
    
    // Create a new settings manager to load settings from localStorage
    const newSettingsManager = new SettingsManager('test-chess-pieces-settings');
    
    // Check that settings were loaded correctly
    expect(newSettingsManager.settings.board.lightSquareColor).toBe('#EEEED2');
    expect(newSettingsManager.settings.pieces.whiteColor).toBe('#E8E8E8');
  });
  
  test('should get and set individual settings', () => {
    // Get default settings
    expect(settingsManager.getSetting('board', 'lightSquareColor')).toBe('#F0D9B5');
    expect(settingsManager.getSetting('pieces', 'whiteColor')).toBe('#FFFFFF');
    
    // Set new values
    settingsManager.setSetting('board', 'lightSquareColor', '#EEEED2');
    settingsManager.setSetting('pieces', 'whiteColor', '#E8E8E8');
    
    // Get updated values
    expect(settingsManager.getSetting('board', 'lightSquareColor')).toBe('#EEEED2');
    expect(settingsManager.getSetting('pieces', 'whiteColor')).toBe('#E8E8E8');
  });
  
  test('should reset settings to defaults', () => {
    // Modify some settings
    settingsManager.setSetting('board', 'lightSquareColor', '#EEEED2');
    settingsManager.setSetting('pieces', 'whiteColor', '#E8E8E8');
    
    // Reset settings
    const resetSettings = settingsManager.resetSettings();
    
    // Check that settings were reset to defaults
    expect(resetSettings.board.lightSquareColor).toBe('#EEEED2');
    expect(resetSettings.pieces.whiteColor).toBe('#E8E8E8');
    
    // Check that the settings manager's settings were updated
    expect(settingsManager.settings.board.lightSquareColor).toBe('#EEEED2');
    expect(settingsManager.settings.pieces.whiteColor).toBe('#E8E8E8');
  });
  
  test('should export and import settings', () => {
    // Modify some settings
    settingsManager.setSetting('board', 'lightSquareColor', '#EEEED2');
    settingsManager.setSetting('pieces', 'whiteColor', '#E8E8E8');
    
    // Export settings
    const exportedSettings = settingsManager.exportSettings();
    
    // Create a new settings manager
    const newSettingsManager = new SettingsManager('test-chess-pieces-settings-2');
    
    // Import settings
    const importResult = newSettingsManager.importSettings(exportedSettings);
    expect(importResult).toBe(true);
    
    // Check that settings were imported correctly
    expect(newSettingsManager.settings.board.lightSquareColor).toBe('#EEEED2');
    expect(newSettingsManager.settings.pieces.whiteColor).toBe('#E8E8E8');
  });
  
  test('should create, load, and delete presets', () => {
    // Modify some settings
    settingsManager.setSetting('board', 'lightSquareColor', '#EEEED2');
    settingsManager.setSetting('pieces', 'whiteColor', '#E8E8E8');
    
    // Create a preset
    const preset = settingsManager.createPreset('Test Preset');
    expect(preset.name).toBe('Test Preset');
    expect(preset.settings.board.lightSquareColor).toBe('#EEEED2');
    expect(preset.settings.pieces.whiteColor).toBe('#E8E8E8');
    
    // Get presets
    const presets = settingsManager.getPresets();
    expect(presets.length).toBe(1);
    expect(presets[0].name).toBe('Test Preset');
    
    // Modify settings again
    settingsManager.setSetting('board', 'lightSquareColor', '#FFFFFF');
    settingsManager.setSetting('pieces', 'whiteColor', '#FFFFFF');
    
    // Load preset
    const loadResult = settingsManager.loadPreset('Test Preset');
    expect(loadResult).toBe(true);
    
    // Check that settings were loaded from preset
    expect(settingsManager.settings.board.lightSquareColor).toBe('#EEEED2');
    expect(settingsManager.settings.pieces.whiteColor).toBe('#E8E8E8');
    
    // Delete preset
    const deleteResult = settingsManager.deletePreset('Test Preset');
    expect(deleteResult).toBe(true);
    
    // Check that preset was deleted
    const presetsAfterDelete = settingsManager.getPresets();
    expect(presetsAfterDelete.length).toBe(0);
  });
  
  test('should apply color schemes', () => {
    // Apply classic color scheme
    const classicResult = settingsManager.applyColorScheme('classic');
    expect(classicResult).toBe(true);
    expect(settingsManager.settings.board.lightSquareColor).toBe('#F0D9B5');
    expect(settingsManager.settings.board.darkSquareColor).toBe('#B58863');
    expect(settingsManager.settings.pieces.whiteColor).toBe('#FFFFFF');
    expect(settingsManager.settings.pieces.blackColor).toBe('#000000');
    
    // Apply modern color scheme
    const modernResult = settingsManager.applyColorScheme('modern');
    expect(modernResult).toBe(true);
    expect(settingsManager.settings.board.lightSquareColor).toBe('#EEEED2');
    expect(settingsManager.settings.board.darkSquareColor).toBe('#769656');
    expect(settingsManager.settings.pieces.whiteColor).toBe('#E8E8E8');
    expect(settingsManager.settings.pieces.blackColor).toBe('#202020');
    
    // Apply invalid color scheme
    const invalidResult = settingsManager.applyColorScheme('invalid');
    expect(invalidResult).toBe(false);
  });
});
