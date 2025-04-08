/**
 * Tests for the Checker Pieces Settings Manager
 */

// Mock localStorage
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
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Import the class to test
const SettingsManager = require('../../checkerpieces/js/settings-manager.js');

describe('SettingsManager', () => {
  let settingsManager;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Create a new SettingsManager instance
    settingsManager = new SettingsManager('test-settings');
  });
  
  test('initializes with default settings', () => {
    expect(settingsManager.settings).toBeDefined();
    expect(settingsManager.settings.boardSize).toBe(8);
    expect(settingsManager.settings.lightSquareColor).toBe('#f5deb3');
    expect(settingsManager.settings.darkSquareColor).toBe('#8b4513');
    expect(settingsManager.settings.redPieceColor).toBe('#e74c3c');
    expect(settingsManager.settings.blackPieceColor).toBe('#2c3e50');
  });
  
  test('loads settings from localStorage if available', () => {
    const customSettings = {
      boardSize: 10,
      lightSquareColor: '#ffffff',
      darkSquareColor: '#000000'
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customSettings));
    
    settingsManager = new SettingsManager('test-settings');
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-settings');
    expect(settingsManager.settings.boardSize).toBe(10);
    expect(settingsManager.settings.lightSquareColor).toBe('#ffffff');
    expect(settingsManager.settings.darkSquareColor).toBe('#000000');
    
    // Default values should still be present for properties not in customSettings
    expect(settingsManager.settings.redPieceColor).toBe('#e74c3c');
  });
  
  test('saves settings to localStorage', () => {
    settingsManager.saveSettings();
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings',
      JSON.stringify(settingsManager.settings)
    );
  });
  
  test('gets a specific setting', () => {
    expect(settingsManager.getSetting('boardSize')).toBe(8);
    expect(settingsManager.getSetting('lightSquareColor')).toBe('#f5deb3');
  });
  
  test('sets a specific setting', () => {
    settingsManager.setSetting('boardSize', 12);
    expect(settingsManager.settings.boardSize).toBe(12);
    
    settingsManager.setSetting('lightSquareColor', '#eeeeee');
    expect(settingsManager.settings.lightSquareColor).toBe('#eeeeee');
  });
  
  test('returns false when setting an invalid property', () => {
    const result = settingsManager.setSetting('invalidProperty', 'value');
    expect(result).toBe(false);
    expect(settingsManager.settings.invalidProperty).toBeUndefined();
  });
  
  test('resets settings to defaults', () => {
    // Change some settings
    settingsManager.setSetting('boardSize', 12);
    settingsManager.setSetting('lightSquareColor', '#eeeeee');
    
    // Reset settings
    const result = settingsManager.resetSettings();
    
    expect(result).toEqual(settingsManager.defaultSettings);
    expect(settingsManager.settings.boardSize).toBe(8);
    expect(settingsManager.settings.lightSquareColor).toBe('#f5deb3');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  test('exports settings as JSON', () => {
    const exportedSettings = settingsManager.exportSettings();
    const parsedSettings = JSON.parse(exportedSettings);
    
    expect(parsedSettings).toEqual(settingsManager.settings);
  });
  
  test('imports settings from JSON', () => {
    const customSettings = {
      boardSize: 10,
      lightSquareColor: '#ffffff',
      darkSquareColor: '#000000'
    };
    
    const result = settingsManager.importSettings(JSON.stringify(customSettings));
    
    expect(result).toBe(true);
    expect(settingsManager.settings.boardSize).toBe(10);
    expect(settingsManager.settings.lightSquareColor).toBe('#ffffff');
    expect(settingsManager.settings.darkSquareColor).toBe('#000000');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  test('returns false when importing invalid JSON', () => {
    const result = settingsManager.importSettings('invalid json');
    
    expect(result).toBe(false);
    expect(settingsManager.settings.boardSize).toBe(8); // Default value
  });
  
  test('creates a preset with current settings', () => {
    const presetName = 'Test Preset';
    const preset = settingsManager.createPreset(presetName);
    
    expect(preset.name).toBe(presetName);
    expect(preset.settings).toEqual(settingsManager.settings);
    expect(preset.created).toBeDefined();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings-presets',
      JSON.stringify([preset])
    );
  });
  
  test('gets all saved presets', () => {
    const preset = {
      name: 'Test Preset',
      settings: { ...settingsManager.settings },
      created: new Date().toISOString()
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([preset]));
    
    const presets = settingsManager.getPresets();
    
    expect(presets).toHaveLength(1);
    expect(presets[0].name).toBe('Test Preset');
  });
  
  test('loads a preset', () => {
    const preset = {
      name: 'Test Preset',
      settings: {
        boardSize: 10,
        lightSquareColor: '#ffffff',
        darkSquareColor: '#000000'
      },
      created: new Date().toISOString()
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([preset]));
    
    const result = settingsManager.loadPreset('Test Preset');
    
    expect(result).toBe(true);
    expect(settingsManager.settings.boardSize).toBe(10);
    expect(settingsManager.settings.lightSquareColor).toBe('#ffffff');
    expect(settingsManager.settings.darkSquareColor).toBe('#000000');
  });
  
  test('returns false when loading a non-existent preset', () => {
    const result = settingsManager.loadPreset('Non-existent Preset');
    
    expect(result).toBe(false);
  });
  
  test('deletes a preset', () => {
    const presets = [
      {
        name: 'Preset 1',
        settings: { ...settingsManager.settings },
        created: new Date().toISOString()
      },
      {
        name: 'Preset 2',
        settings: { ...settingsManager.settings },
        created: new Date().toISOString()
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(presets));
    
    const result = settingsManager.deletePreset('Preset 1');
    
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings-presets',
      JSON.stringify([presets[1]])
    );
  });
  
  test('returns false when deleting a non-existent preset', () => {
    const presets = [
      {
        name: 'Preset 1',
        settings: { ...settingsManager.settings },
        created: new Date().toISOString()
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(presets));
    
    const result = settingsManager.deletePreset('Non-existent Preset');
    
    expect(result).toBe(false);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
