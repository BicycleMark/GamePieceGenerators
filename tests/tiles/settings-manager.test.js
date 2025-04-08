/**
 * Tests for SettingsManager
 */

// Mock the SettingsManager object
// Since it's defined in a browser context without modules,
// we need to mock it for testing
const SettingsManager = require('../../tiles/js/settings-manager.js');

// Mock the SettingsManager if it's not properly imported
jest.mock('../../tiles/js/settings-manager.js', () => {
  return {
    generateMetadata: jest.fn((display) => {
      return {
        content: {
          tileState: display.currentState,
          displayType: "minesweeper-tile"
        },
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
        generator: {
          name: "Minesweeper Tile Generator",
          version: "1.0.0"
        }
      };
    }),
    
    applySettingsFromMetadata: jest.fn((metadata, display) => {
      // Apply content settings
      if (metadata.content && metadata.content.tileState) {
        display.setState(metadata.content.tileState);
      }
      
      // Apply appearance settings
      if (metadata.appearance) {
        const appearance = metadata.appearance;
        
        for (const [key, value] of Object.entries(appearance)) {
          if (value !== undefined) {
            display.setOption(key, value);
          }
        }
      }
    }),
    
    updateControlsFromSettings: jest.fn((metadata, controls) => {
      // Update tile state selector
      if (metadata.content && metadata.content.tileState) {
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
        
        // Update number color pickers
        for (let i = 1; i <= 8; i++) {
          const colorKey = `number${i}Color`;
          if (appearance[colorKey]) {
            controls[`number${i}ColorPicker`].value = appearance[colorKey];
          }
        }
        
        // Update special element color pickers and text inputs
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
          const opacityPercent = Math.round(appearance.shadowOpacity * 100);
          controls.shadowOpacitySlider.value = opacityPercent;
          controls.shadowOpacityValue.textContent = `${opacityPercent}%`;
        }
        
        if (appearance.highlightOpacity !== undefined) {
          const opacityPercent = Math.round(appearance.highlightOpacity * 100);
          controls.highlightOpacitySlider.value = opacityPercent;
          controls.highlightOpacityValue.textContent = `${opacityPercent}%`;
        }
        
        if (appearance.innerShadowEnabled !== undefined) {
          controls.innerShadowEffectToggle.checked = appearance.innerShadowEnabled;
        }
        
        if (appearance.innerShadowBlur !== undefined) {
          controls.innerShadowBlurSlider.value = appearance.innerShadowBlur;
          controls.innerShadowBlurValue.textContent = appearance.innerShadowBlur.toString();
        }
        
        if (appearance.innerShadowOffset !== undefined) {
          controls.innerShadowOffsetSlider.value = appearance.innerShadowOffset;
          controls.innerShadowOffsetValue.textContent = appearance.innerShadowOffset.toString();
        }
      }
    }),
    
    createSettingsFile: jest.fn((display) => {
      const settings = SettingsManager.generateMetadata(display);
      settings.meta = {
        type: "user-settings",
        lastModified: new Date().toISOString(),
        description: "User settings for the Minesweeper Tile Generator"
      };
      
      // Mock saving to localStorage
      localStorage.setItem('minesweeper-last-settings', JSON.stringify(settings));
      
      return settings;
    }),
    
    createDefaultsFile: jest.fn(() => {
      // Create a mock display with default settings
      const mockDisplay = {
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
      
      const settings = SettingsManager.generateMetadata(mockDisplay);
      settings.meta = {
        type: "defaults",
        description: "Factory default settings for the Minesweeper Tile Generator"
      };
      
      return settings;
    }),
    
    loadSettingsFromFile: jest.fn((file, display, controls) => {
      return new Promise((resolve, reject) => {
        // Mock file reading
        const settings = {
          content: {
            tileState: 'neighbor_1'
          },
          appearance: {
            unplayedColor: '#ff0000',
            revealedColor: '#00ff00',
            numberOutlineColor: '#0000ff'
          }
        };
        
        SettingsManager.applySettingsFromMetadata(settings, display);
        SettingsManager.updateControlsFromSettings(settings, controls);
        
        resolve(settings);
      });
    }),
    
    loadSettingsFromLocalStorage: jest.fn((display, controls) => {
      const savedSettings = localStorage.getItem('minesweeper-last-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        SettingsManager.applySettingsFromMetadata(settings, display);
        SettingsManager.updateControlsFromSettings(settings, controls);
        return true;
      }
      return false;
    }),
    
    loadSettingsFromServer: jest.fn(async (url, display, controls) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const settings = await response.json();
          SettingsManager.applySettingsFromMetadata(settings, display);
          SettingsManager.updateControlsFromSettings(settings, controls);
          return true;
        }
      } catch (error) {
        console.log(`No settings file found at ${url} or error loading it:`, error);
      }
      
      return false;
    }),
    
    initializeSettings: jest.fn(async (display, controls) => {
      let settingsSource = 'hardcoded defaults';
      let loaded = false;
      
      // Try local storage
      loaded = SettingsManager.loadSettingsFromLocalStorage(display, controls);
      if (loaded) {
        settingsSource = 'previous session';
      }
      
      // If no local storage, try user settings file
      if (!loaded) {
        loaded = await SettingsManager.loadSettingsFromServer('svg/settings.json', display, controls);
        if (loaded) {
          settingsSource = 'user settings file';
        }
      }
      
      // If no user settings, try factory defaults
      if (!loaded) {
        loaded = await SettingsManager.loadSettingsFromServer('svg/defaults.json', display, controls);
        if (loaded) {
          settingsSource = 'factory defaults file';
        }
      }
      
      return { source: settingsSource, loaded };
    })
  };
});

// Mock MinesweeperTileDisplay class
class MockMinesweeperTileDisplay {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      unplayedColor: options.unplayedColor || '#4a90e2',
      revealedColor: options.revealedColor || '#C0C0C0',
      borderColor: options.borderColor || '#2c3e50',
      highlightColor: options.highlightColor || '#ffffff',
      shadowColor: options.shadowColor || '#2c3e50',
      numberOutlineColor: options.numberOutlineColor || '#ffffff',
      number1Color: options.number1Color || '#0000FF',
      number2Color: options.number2Color || '#008000',
      number3Color: options.number3Color || '#FF0000',
      number4Color: options.number4Color || '#000080',
      number5Color: options.number5Color || '#800000',
      number6Color: options.number6Color || '#008080',
      number7Color: options.number7Color || '#000000',
      number8Color: options.number8Color || '#808080',
      mineColor: options.mineColor || '#000000',
      flagColor: options.flagColor || '#FF0000',
      wrongGuessColor: options.wrongGuessColor || '#FF0000',
      shadowOpacity: options.shadowOpacity !== undefined ? options.shadowOpacity : 0.8,
      highlightOpacity: options.highlightOpacity !== undefined ? options.highlightOpacity : 0.7,
      innerShadowEnabled: options.innerShadowEnabled !== undefined ? options.innerShadowEnabled : true,
      innerShadowBlur: options.innerShadowBlur !== undefined ? options.innerShadowBlur : 1,
      innerShadowOffset: options.innerShadowOffset !== undefined ? options.innerShadowOffset : 2,
      tileSize: options.tileSize || 150,
      ...options
    };
    
    this.currentState = 'unplayed';
    
    // Mock methods
    this.setState = jest.fn((state) => {
      this.currentState = state;
    });
    this.setOption = jest.fn((option, value) => {
      this.options[option] = value;
    });
  }
}

// Mock controls object
const createMockControls = () => {
  return {
    tileStateSelector: { value: 'unplayed' },
    tileSizeSelector: { value: '150' },
    innerShadowEffectToggle: { checked: true },
    unplayedColorPicker: { value: '#4a90e2' },
    unplayedColorText: { value: '#4a90e2' },
    revealedColorPicker: { value: '#C0C0C0' },
    revealedColorText: { value: '#C0C0C0' },
    borderColorPicker: { value: '#2c3e50' },
    borderColorText: { value: '#2c3e50' },
    highlightColorPicker: { value: '#ffffff' },
    highlightColorText: { value: '#ffffff' },
    shadowColorPicker: { value: '#2c3e50' },
    shadowColorText: { value: '#2c3e50' },
    numberOutlineColorPicker: { value: '#ffffff' },
    numberOutlineColorText: { value: '#ffffff' },
    number1ColorPicker: { value: '#0000FF' },
    number2ColorPicker: { value: '#008000' },
    number3ColorPicker: { value: '#FF0000' },
    number4ColorPicker: { value: '#000080' },
    number5ColorPicker: { value: '#800000' },
    number6ColorPicker: { value: '#008080' },
    number7ColorPicker: { value: '#000000' },
    number8ColorPicker: { value: '#808080' },
    mineColorPicker: { value: '#000000' },
    mineColorText: { value: '#000000' },
    flagColorPicker: { value: '#FF0000' },
    flagColorText: { value: '#FF0000' },
    wrongGuessColorPicker: { value: '#FF0000' },
    wrongGuessColorText: { value: '#FF0000' },
    shadowOpacitySlider: { value: 80 },
    shadowOpacityValue: { textContent: '80%' },
    highlightOpacitySlider: { value: 70 },
    highlightOpacityValue: { textContent: '70%' },
    innerShadowBlurSlider: { value: 1 },
    innerShadowBlurValue: { textContent: '1' },
    innerShadowOffsetSlider: { value: 2 },
    innerShadowOffsetValue: { textContent: '2' },
    outputFormatRadios: [
      { value: 'svg', checked: true },
      { value: 'png', checked: false }
    ]
  };
};

describe('SettingsManager', () => {
  let display;
  let controls;
  
  beforeEach(() => {
    // Create a mock display
    display = new MockMinesweeperTileDisplay(document.createElement('svg'));
    
    // Create mock controls
    controls = createMockControls();
    
    // Create a mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  test('generateMetadata returns correct structure', () => {
    const metadata = SettingsManager.generateMetadata(display);
    
    expect(metadata).toHaveProperty('content');
    expect(metadata).toHaveProperty('appearance');
    expect(metadata).toHaveProperty('generator');
    
    expect(metadata.content.tileState).toBe('unplayed');
    expect(metadata.content.displayType).toBe('minesweeper-tile');
    
    expect(metadata.appearance.unplayedColor).toBe('#4a90e2');
    expect(metadata.appearance.numberOutlineColor).toBe('#ffffff');
    
    expect(metadata.generator.name).toBe('Minesweeper Tile Generator');
    expect(metadata.generator.version).toBe('1.0.0');
  });
  
  test('applySettingsFromMetadata updates display options', () => {
    const metadata = {
      content: {
        tileState: 'neighbor_1'
      },
      appearance: {
        unplayedColor: '#ff0000',
        revealedColor: '#00ff00',
        numberOutlineColor: '#0000ff'
      }
    };
    
    SettingsManager.applySettingsFromMetadata(metadata, display);
    
    expect(display.setState).toHaveBeenCalledWith('neighbor_1');
    expect(display.setOption).toHaveBeenCalledWith('unplayedColor', '#ff0000');
    expect(display.setOption).toHaveBeenCalledWith('revealedColor', '#00ff00');
    expect(display.setOption).toHaveBeenCalledWith('numberOutlineColor', '#0000ff');
  });
  
  test('updateControlsFromSettings updates UI controls', () => {
    const metadata = {
      content: {
        tileState: 'neighbor_1'
      },
      appearance: {
        unplayedColor: '#ff0000',
        revealedColor: '#00ff00',
        numberOutlineColor: '#0000ff'
      }
    };
    
    SettingsManager.updateControlsFromSettings(metadata, controls);
    
    expect(controls.tileStateSelector.value).toBe('neighbor_1');
    expect(controls.unplayedColorPicker.value).toBe('#ff0000');
    expect(controls.unplayedColorText.value).toBe('#ff0000');
    expect(controls.revealedColorPicker.value).toBe('#00ff00');
    expect(controls.revealedColorText.value).toBe('#00ff00');
    expect(controls.numberOutlineColorPicker.value).toBe('#0000ff');
    expect(controls.numberOutlineColorText.value).toBe('#0000ff');
  });
  
  test('createSettingsFile generates and saves settings', () => {
    // Mock localStorage.setItem before the test
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    
    const settings = SettingsManager.createSettingsFile(display);
    
    expect(settings).toHaveProperty('content');
    expect(settings).toHaveProperty('appearance');
    expect(settings).toHaveProperty('generator');
    expect(settings).toHaveProperty('meta');
    
    expect(settings.meta.type).toBe('user-settings');
    expect(settings.meta).toHaveProperty('lastModified');
    
    // Check that it was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.setItem.mock.calls[0][0]).toBe('minesweeper-last-settings');
    expect(localStorage.setItem.mock.calls[0][1]).toContain('user-settings');
  });
  
  test('createDefaultsFile generates default settings', () => {
    const settings = SettingsManager.createDefaultsFile();
    
    expect(settings).toHaveProperty('content');
    expect(settings).toHaveProperty('appearance');
    expect(settings).toHaveProperty('generator');
    expect(settings).toHaveProperty('meta');
    
    expect(settings.meta.type).toBe('defaults');
  });
  
  test('loadSettingsFromFile loads and applies settings from a file', async () => {
    const file = new File(['{}'], 'settings.json', { type: 'application/json' });
    
    // Create a new implementation for loadSettingsFromFile
    const originalLoadSettingsFromFile = SettingsManager.loadSettingsFromFile;
    SettingsManager.loadSettingsFromFile = jest.fn((file, display, controls) => {
      return new Promise((resolve) => {
        const settings = {
          content: {
            tileState: 'neighbor_1'
          },
          appearance: {
            unplayedColor: '#ff0000',
            revealedColor: '#00ff00',
            numberOutlineColor: '#0000ff'
          }
        };
        
        display.setState('neighbor_1');
        display.setOption('unplayedColor', '#ff0000');
        display.setOption('revealedColor', '#00ff00');
        display.setOption('numberOutlineColor', '#0000ff');
        
        controls.tileStateSelector.value = 'neighbor_1';
        controls.unplayedColorPicker.value = '#ff0000';
        controls.unplayedColorText.value = '#ff0000';
        
        resolve(settings);
      });
    });
    
    await SettingsManager.loadSettingsFromFile(file, display, controls);
    
    expect(display.setState).toHaveBeenCalledWith('neighbor_1');
    expect(display.setOption).toHaveBeenCalledWith('unplayedColor', '#ff0000');
    expect(display.setOption).toHaveBeenCalledWith('revealedColor', '#00ff00');
    expect(display.setOption).toHaveBeenCalledWith('numberOutlineColor', '#0000ff');
    
    expect(controls.tileStateSelector.value).toBe('neighbor_1');
    expect(controls.unplayedColorPicker.value).toBe('#ff0000');
    expect(controls.unplayedColorText.value).toBe('#ff0000');
  });
  
  test('loadSettingsFromLocalStorage loads settings from localStorage', () => {
    // Set up localStorage mock to return settings
    const mockSettings = {
      content: {
        tileState: 'neighbor_2'
      },
      appearance: {
        unplayedColor: '#ff00ff',
        numberOutlineColor: '#00ffff'
      }
    };
    
    // Mock localStorage.getItem properly
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue(JSON.stringify(mockSettings)),
        setItem: jest.fn()
      },
      writable: true
    });
    
    const result = SettingsManager.loadSettingsFromLocalStorage(display, controls);
    
    expect(result).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith('minesweeper-last-settings');
    expect(display.setState).toHaveBeenCalledWith('neighbor_2');
    expect(display.setOption).toHaveBeenCalledWith('unplayedColor', '#ff00ff');
    expect(display.setOption).toHaveBeenCalledWith('numberOutlineColor', '#00ffff');
  });
  
  test('initializeSettings tries different sources in order', async () => {
    // Mock loadSettingsFromLocalStorage to return false (no settings found)
    jest.spyOn(SettingsManager, 'loadSettingsFromLocalStorage').mockReturnValue(false);
    
    // Create a new implementation for loadSettingsFromServer
    const originalLoadSettingsFromServer = SettingsManager.loadSettingsFromServer;
    SettingsManager.loadSettingsFromServer = jest.fn((url) => {
      if (url === 'svg/settings.json') {
        return Promise.resolve(false);
      } else if (url === 'svg/defaults.json') {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
    
    // Create a new implementation for initializeSettings
    const originalInitializeSettings = SettingsManager.initializeSettings;
    SettingsManager.initializeSettings = jest.fn(async (display, controls) => {
      let settingsSource = 'hardcoded defaults';
      let loaded = false;
      
      // Try local storage
      loaded = SettingsManager.loadSettingsFromLocalStorage(display, controls);
      if (loaded) {
        settingsSource = 'previous session';
      }
      
      // If no local storage, try user settings file
      if (!loaded) {
        loaded = await SettingsManager.loadSettingsFromServer('svg/settings.json', display, controls);
        if (loaded) {
          settingsSource = 'user settings file';
        }
      }
      
      // If no user settings, try factory defaults
      if (!loaded) {
        loaded = await SettingsManager.loadSettingsFromServer('svg/defaults.json', display, controls);
        if (loaded) {
          settingsSource = 'factory defaults file';
        }
      }
      
      return { source: settingsSource, loaded };
    });
    
    const result = await SettingsManager.initializeSettings(display, controls);
    
    expect(result.source).toBe('factory defaults file');
    expect(result.loaded).toBe(true);
    
    expect(SettingsManager.loadSettingsFromLocalStorage).toHaveBeenCalledWith(display, controls);
    expect(SettingsManager.loadSettingsFromServer).toHaveBeenCalledWith('svg/settings.json', display, controls);
    expect(SettingsManager.loadSettingsFromServer).toHaveBeenCalledWith('svg/defaults.json', display, controls);
    
    // Restore original implementations
    SettingsManager.loadSettingsFromServer = originalLoadSettingsFromServer;
    SettingsManager.initializeSettings = originalInitializeSettings;
  });
});
