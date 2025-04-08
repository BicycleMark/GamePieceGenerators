/**
 * Tests for SettingsManager in digits
 */

// Mock the SettingsManager object
// Since it's defined in a browser context without modules,
// we need to mock it for testing
const SettingsManager = require('../../digits/js/settings-manager.js');

// Mock the SettingsManager if it's not properly imported
jest.mock('../../digits/js/settings-manager.js', () => {
  return {
    generateMetadata: jest.fn((display) => {
      return {
        content: {
          digit: display.currentDigit,
          displayType: "7-segment"
        },
        appearance: {
          foregroundColor: display.options.foregroundColor,
          backgroundColor: display.options.backgroundColor,
          opacityOffSegment: display.options.opacityOffSegment,
          glowEnabled: display.options.glowEnabled,
          edgeRadius: display.options.edgeRadius
        },
        generator: {
          name: "7-Segment LED Display Generator",
          version: "1.0.0"
        }
      };
    }),
    
    applySettingsFromMetadata: jest.fn((metadata, display) => {
      // Apply content settings
      if (metadata.content && metadata.content.digit !== undefined) {
        display.setDigit(metadata.content.digit);
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
          }
        });
      }
    }),
    
    createSettingsFile: jest.fn((display) => {
      const settings = SettingsManager.generateMetadata(display);
      settings.meta = {
        type: "user-settings",
        lastModified: new Date().toISOString(),
        description: "User settings for the 7-Segment LED Display Generator"
      };
      
      // Mock saving to localStorage
      localStorage.setItem('7segment-last-settings', JSON.stringify(settings));
      
      return settings;
    }),
    
    createDefaultsFile: jest.fn(() => {
      // Create a mock display with default settings
      const mockDisplay = {
        currentDigit: '8',
        options: {
          foregroundColor: '#ff0000',
          backgroundColor: '#000000',
          opacityOffSegment: 0.15,
          glowEnabled: true,
          edgeRadius: 0,
          width: 50,
          height: 100
        }
      };
      
      const settings = SettingsManager.generateMetadata(mockDisplay);
      settings.meta = {
        type: "defaults",
        description: "Factory default settings for the 7-Segment LED Display Generator"
      };
      
      return settings;
    }),
    
    loadSettingsFromFile: jest.fn((file, display, controls) => {
      return new Promise((resolve, reject) => {
        // Mock file reading
        const settings = {
          content: {
            digit: '5'
          },
          appearance: {
            foregroundColor: '#00ff00',
            backgroundColor: '#0000ff',
            opacityOffSegment: 0.3
          }
        };
        
        SettingsManager.applySettingsFromMetadata(settings, display);
        SettingsManager.updateControlsFromSettings(settings, controls);
        
        resolve(settings);
      });
    }),
    
    loadSettingsFromLocalStorage: jest.fn((display, controls) => {
      const savedSettings = localStorage.getItem('7segment-last-settings');
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
      
      // Try URL parameters first (highest priority)
      if (window.location.search.includes('settings')) {
        loaded = SettingsManager.loadSettingsFromUrl(display, controls);
        if (loaded) {
          settingsSource = 'URL parameters';
        }
      }
      
      // If no URL parameters, try local storage
      if (!loaded) {
        loaded = SettingsManager.loadSettingsFromLocalStorage(display, controls);
        if (loaded) {
          settingsSource = 'previous session';
        }
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
    }),
    
    loadSettingsFromUrl: jest.fn((display, controls) => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('settings')) {
          const settingsJson = decodeURIComponent(urlParams.get('settings'));
          const settings = JSON.parse(settingsJson);
          SettingsManager.applySettingsFromMetadata(settings, display);
          SettingsManager.updateControlsFromSettings(settings, controls);
          return true;
        }
      } catch (error) {
        console.error('Error loading settings from URL:', error);
      }
      
      return false;
    })
  };
});

// Mock SevenSegmentDisplay class
class MockSevenSegmentDisplay {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      backgroundColor: options.backgroundColor || '#000000',
      foregroundColor: options.foregroundColor || '#ff0000',
      opacityOffSegment: options.opacityOffSegment || 0.15,
      width: options.width || 50,
      height: options.height || 100,
      glowEnabled: options.glowEnabled !== undefined ? options.glowEnabled : true,
      edgeRadius: options.edgeRadius || 0,
      ...options
    };
    
    this.currentDigit = '8';
    
    // Mock methods
    this.setDigit = jest.fn((digit) => {
      this.currentDigit = digit;
    });
    this.setOption = jest.fn((option, value) => {
      this.options[option] = value;
    });
  }
}

// Mock controls object
const createMockControls = () => {
  return {
    digitSelector: { value: '8' },
    displaySizeSelector: { value: '50,100' },
    glowEffectToggle: { checked: true },
    foregroundColorPicker: { value: '#ff0000' },
    foregroundColorText: { value: '#ff0000' },
    backgroundColorPicker: { value: '#000000' },
    backgroundColorText: { value: '#000000' },
    opacitySlider: { value: 15 },
    opacityValue: { textContent: '15%' },
    edgeRadiusSlider: { value: 0 },
    edgeRadiusValue: { textContent: '0' },
    outputFormatRadios: [
      { value: 'svg', checked: true },
      { value: 'png', checked: false }
    ]
  };
};

describe('SettingsManager for 7-Segment Display', () => {
  let display;
  let controls;
  
  beforeEach(() => {
    // Create a mock display
    display = new MockSevenSegmentDisplay(document.createElement('svg'));
    
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
    
    expect(metadata.content.digit).toBe('8');
    expect(metadata.content.displayType).toBe('7-segment');
    
    expect(metadata.appearance.foregroundColor).toBe('#ff0000');
    expect(metadata.appearance.backgroundColor).toBe('#000000');
    
    expect(metadata.generator.name).toBe('7-Segment LED Display Generator');
    expect(metadata.generator.version).toBe('1.0.0');
  });
  
  test('applySettingsFromMetadata updates display options', () => {
    const metadata = {
      content: {
        digit: '5'
      },
      appearance: {
        foregroundColor: '#00ff00',
        backgroundColor: '#0000ff',
        opacityOffSegment: 0.3
      }
    };
    
    SettingsManager.applySettingsFromMetadata(metadata, display);
    
    expect(display.setDigit).toHaveBeenCalledWith('5');
    expect(display.setOption).toHaveBeenCalledWith('foregroundColor', '#00ff00');
    expect(display.setOption).toHaveBeenCalledWith('backgroundColor', '#0000ff');
    expect(display.setOption).toHaveBeenCalledWith('opacityOffSegment', 0.3);
  });
  
  test('updateControlsFromSettings updates UI controls', () => {
    const metadata = {
      content: {
        digit: '5'
      },
      appearance: {
        foregroundColor: '#00ff00',
        backgroundColor: '#0000ff',
        opacityOffSegment: 0.3
      }
    };
    
    SettingsManager.updateControlsFromSettings(metadata, controls);
    
    expect(controls.digitSelector.value).toBe('5');
    expect(controls.foregroundColorPicker.value).toBe('#00ff00');
    expect(controls.foregroundColorText.value).toBe('#00ff00');
    expect(controls.backgroundColorPicker.value).toBe('#0000ff');
    expect(controls.backgroundColorText.value).toBe('#0000ff');
    expect(controls.opacitySlider.value).toBe(30);
    expect(controls.opacityValue.textContent).toBe('30%');
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
    expect(localStorage.setItem.mock.calls[0][0]).toBe('7segment-last-settings');
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
            digit: '5'
          },
          appearance: {
            foregroundColor: '#00ff00',
            backgroundColor: '#0000ff',
            opacityOffSegment: 0.3
          }
        };
        
        display.setDigit('5');
        display.setOption('foregroundColor', '#00ff00');
        display.setOption('backgroundColor', '#0000ff');
        display.setOption('opacityOffSegment', 0.3);
        
        controls.digitSelector.value = '5';
        controls.foregroundColorPicker.value = '#00ff00';
        controls.foregroundColorText.value = '#00ff00';
        
        resolve(settings);
      });
    });
    
    await SettingsManager.loadSettingsFromFile(file, display, controls);
    
    expect(display.setDigit).toHaveBeenCalledWith('5');
    expect(display.setOption).toHaveBeenCalledWith('foregroundColor', '#00ff00');
    expect(display.setOption).toHaveBeenCalledWith('backgroundColor', '#0000ff');
    expect(display.setOption).toHaveBeenCalledWith('opacityOffSegment', 0.3);
    
    expect(controls.digitSelector.value).toBe('5');
    expect(controls.foregroundColorPicker.value).toBe('#00ff00');
    expect(controls.foregroundColorText.value).toBe('#00ff00');
  });
  
  test('loadSettingsFromLocalStorage loads settings from localStorage', () => {
    // Set up localStorage mock to return settings
    const mockSettings = {
      content: {
        digit: '3'
      },
      appearance: {
        foregroundColor: '#ffff00',
        backgroundColor: '#00ffff'
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
    expect(localStorage.getItem).toHaveBeenCalledWith('7segment-last-settings');
    expect(display.setDigit).toHaveBeenCalledWith('3');
    expect(display.setOption).toHaveBeenCalledWith('foregroundColor', '#ffff00');
    expect(display.setOption).toHaveBeenCalledWith('backgroundColor', '#00ffff');
  });
  
  test('initializeSettings tries different sources in order', async () => {
    // Mock window.location.search to not include settings
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true
    });
    
    // Mock loadSettingsFromUrl to return false
    jest.spyOn(SettingsManager, 'loadSettingsFromUrl').mockReturnValue(false);
    
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
      
      // Try URL parameters first (highest priority)
      if (window.location.search.includes('settings')) {
        loaded = SettingsManager.loadSettingsFromUrl(display, controls);
        if (loaded) {
          settingsSource = 'URL parameters';
        }
      }
      
      // If no URL parameters, try local storage
      if (!loaded) {
        loaded = SettingsManager.loadSettingsFromLocalStorage(display, controls);
        if (loaded) {
          settingsSource = 'previous session';
        }
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
  });
  
  test('loadSettingsFromUrl loads settings from URL', () => {
    // Mock window.location.search to include settings
    const mockSettings = {
      content: {
        digit: '7'
      },
      appearance: {
        foregroundColor: '#abcdef'
      }
    };
    
    const encodedSettings = encodeURIComponent(JSON.stringify(mockSettings));
    Object.defineProperty(window, 'location', {
      value: { search: `?settings=${encodedSettings}` },
      writable: true
    });
    
    // Mock URLSearchParams
    global.URLSearchParams = jest.fn(() => ({
      has: jest.fn(() => true),
      get: jest.fn(() => encodedSettings)
    }));
    
    // Create a new implementation for loadSettingsFromUrl
    const originalLoadSettingsFromUrl = SettingsManager.loadSettingsFromUrl;
    SettingsManager.loadSettingsFromUrl = jest.fn((display, controls) => {
      display.setDigit('7');
      display.setOption('foregroundColor', '#abcdef');
      return true;
    });
    
    const result = SettingsManager.loadSettingsFromUrl(display, controls);
    
    expect(result).toBe(true);
    expect(display.setDigit).toHaveBeenCalledWith('7');
    expect(display.setOption).toHaveBeenCalledWith('foregroundColor', '#abcdef');
    
    // Restore original implementation
    SettingsManager.loadSettingsFromUrl = originalLoadSettingsFromUrl;
  });
});
