/**
 * Tests for the Dice Generator Settings Manager
 */

const SettingsManager = require('../../dice/js/settings-manager.js');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SettingsManager', () => {
  let settingsManager;
  
  beforeEach(() => {
    localStorageMock.clear();
    settingsManager = new SettingsManager('test-settings');
  });
  
  test('should initialize with default settings', () => {
    expect(settingsManager.storageKey).toBe('test-settings');
    expect(settingsManager.presetsKey).toBe('test-settings-presets');
    expect(settingsManager.settings).toEqual(settingsManager.defaultSettings);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-settings');
  });
  
  test('should load settings from localStorage', () => {
    const testSettings = {
      dice: {
        type: 'd6',
        size: 150,
        color: '#FF0000',
        material: 'metal'
      }
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testSettings));
    
    const newSettingsManager = new SettingsManager('test-settings');
    
    expect(newSettingsManager.settings).toEqual(testSettings);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-settings');
  });
  
  test('should save settings to localStorage', () => {
    settingsManager.settings.dice.color = '#FF0000';
    settingsManager.saveSettings();
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings',
      JSON.stringify(settingsManager.settings)
    );
  });
  
  test('should get a specific setting', () => {
    expect(settingsManager.getSetting('dice', 'type')).toBe('d6');
    expect(settingsManager.getSetting('dice', 'size')).toBe(100);
    expect(settingsManager.getSetting('dice', 'color')).toBe('#FFFFFF');
    
    // Test non-existent setting
    expect(settingsManager.getSetting('nonexistent', 'key')).toBeNull();
  });
  
  test('should set a specific setting', () => {
    settingsManager.setSetting('dice', 'color', '#FF0000');
    expect(settingsManager.settings.dice.color).toBe('#FF0000');
    
    // Test setting a value in a non-existent category
    settingsManager.setSetting('newCategory', 'key', 'value');
    expect(settingsManager.settings.newCategory.key).toBe('value');
  });
  
  test('should reset settings to defaults', () => {
    settingsManager.settings.dice.color = '#FF0000';
    settingsManager.resetSettings();
    
    expect(settingsManager.settings).toEqual(settingsManager.defaultSettings);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings',
      JSON.stringify(settingsManager.defaultSettings)
    );
  });
  
  test('should export settings as JSON', () => {
    const json = settingsManager.exportSettings();
    expect(json).toBe(JSON.stringify(settingsManager.settings));
  });
  
  test('should import settings from JSON', () => {
    const testSettings = {
      dice: {
        type: 'd6',
        size: 150,
        color: '#FF0000',
        material: 'metal'
      }
    };
    
    settingsManager.importSettings(JSON.stringify(testSettings));
    
    expect(settingsManager.settings).toEqual(testSettings);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings',
      JSON.stringify(testSettings)
    );
  });
  
  test('should handle invalid JSON when importing settings', () => {
    const originalSettings = { ...settingsManager.settings };
    
    const result = settingsManager.importSettings('invalid json');
    
    expect(result).toBe(false);
    expect(settingsManager.settings).toEqual(originalSettings);
  });
  
  test('should get presets from localStorage', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    const presets = settingsManager.getPresets();
    
    expect(presets).toEqual(testPresets);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-settings-presets');
  });
  
  test('should create a new preset', () => {
    const presetName = 'Test Preset';
    const preset = settingsManager.createPreset(presetName);
    
    expect(preset.name).toBe(presetName);
    expect(preset.settings).toEqual(settingsManager.settings);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  test('should load a preset by name', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    const result = settingsManager.loadPreset('Preset 1');
    
    expect(result).toBe(true);
    expect(settingsManager.settings).toEqual(testPresets[0].settings);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings',
      JSON.stringify(testPresets[0].settings)
    );
  });
  
  test('should load a preset by id', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    const result = settingsManager.loadPreset('1');
    
    expect(result).toBe(true);
    expect(settingsManager.settings).toEqual(testPresets[0].settings);
  });
  
  test('should return false when loading a non-existent preset', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    const result = settingsManager.loadPreset('Non-existent Preset');
    
    expect(result).toBe(false);
    expect(settingsManager.settings).not.toEqual(testPresets[0].settings);
  });
  
  test('should delete a preset by name', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      },
      {
        id: '2',
        name: 'Preset 2',
        settings: { dice: { color: '#00FF00' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    const result = settingsManager.deletePreset('Preset 1');
    
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings-presets',
      JSON.stringify([testPresets[1]])
    );
  });
  
  test('should delete a preset by id', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      },
      {
        id: '2',
        name: 'Preset 2',
        settings: { dice: { color: '#00FF00' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    const result = settingsManager.deletePreset('1');
    
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-settings-presets',
      JSON.stringify([testPresets[1]])
    );
  });
  
  test('should return false when deleting a non-existent preset', () => {
    const testPresets = [
      {
        id: '1',
        name: 'Preset 1',
        settings: { dice: { color: '#FF0000' } }
      }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testPresets));
    
    // Clear previous calls to setItem
    localStorageMock.setItem.mockClear();
    
    const result = settingsManager.deletePreset('Non-existent Preset');
    
    expect(result).toBe(false);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
  
  test('should apply a color scheme', () => {
    const result = settingsManager.applyColorScheme('modern');
    
    expect(result).toBe(true);
    expect(settingsManager.settings.dice.color).toBe(settingsManager.colorSchemes.modern.dice.color);
    expect(settingsManager.settings.dice.pipColor).toBe(settingsManager.colorSchemes.modern.dice.pipColor);
    expect(settingsManager.settings.dice.borderColor).toBe(settingsManager.colorSchemes.modern.dice.borderColor);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  test('should return false when applying a non-existent color scheme', () => {
    // Clear previous calls to setItem
    localStorageMock.setItem.mockClear();
    
    const result = settingsManager.applyColorScheme('non-existent');
    
    expect(result).toBe(false);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
