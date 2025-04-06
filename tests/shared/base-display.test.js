/**
 * Tests for a potential BaseDisplay class that could be shared between
 * MinesweeperTileDisplay and SevenSegmentDisplay
 */

// This is a proposed base class that would contain shared functionality
class BaseDisplay {
  /**
   * Constructor for the BaseDisplay class
   * @param {HTMLElement} element - The SVG element to render the display in
   * @param {Object} options - Configuration options
   * @param {Object} defaultOptions - Default options for the specific display type
   */
  constructor(element, options = {}, defaultOptions = {}) {
    this.element = element;
    this.options = {
      ...defaultOptions,
      ...options
    };
    
    this.init();
  }
  
  /**
   * Initialize the display
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set the viewBox and dimensions
    this.element.setAttribute('viewBox', this.getViewBox());
    this.updateDimensions();
    
    // Add the defs section with filters
    this.addDefs();
    
    // Create the display elements
    this.createElements();
    
    // Apply initial styling
    this.updateStyles();
    
    // Set initial state
    this.setState(this.getDefaultState());
  }
  
  /**
   * Get the viewBox for the SVG
   * @returns {string} - The viewBox attribute value
   */
  getViewBox() {
    return '0 0 100 100';
  }
  
  /**
   * Update the dimensions of the display
   */
  updateDimensions() {
    this.element.style.width = `${this.options.width || 100}px`;
    this.element.style.height = `${this.options.height || 100}px`;
  }
  
  /**
   * Add the defs section with filters
   */
  addDefs() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.element.appendChild(defs);
  }
  
  /**
   * Create the display elements
   */
  createElements() {
    // To be implemented by subclasses
  }
  
  /**
   * Update the display styles based on current options
   */
  updateStyles() {
    // To be implemented by subclasses
  }
  
  /**
   * Get the default state for the display
   * @returns {string} - The default state
   */
  getDefaultState() {
    return '';
  }
  
  /**
   * Set the display to show a specific state
   * @param {string} state - The state to display
   */
  setState(state) {
    // To be implemented by subclasses
  }
  
  /**
   * Update a specific option and refresh the display
   * @param {string} option - The option name to update
   * @param {any} value - The new value for the option
   */
  setOption(option, value) {
    this.options[option] = value;
    this.updateStyles();
  }
  
  /**
   * Export the current display as an SVG string
   * @returns {string} - The SVG as a string
   */
  exportSVG() {
    // Clone the SVG to avoid modifying the original
    const svgClone = this.element.cloneNode(true);
    
    // Add XML declaration and doctype
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
    
    // Add metadata with settings
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metadata.innerHTML = this.getMetadataContent();
    svgClone.appendChild(metadata);
    
    // Add embedded CSS
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = this.getStyleContent();
    svgClone.appendChild(style);
    
    // Serialize to string
    const svgString = new XMLSerializer().serializeToString(svgClone);
    
    // Return with XML declaration
    return `${xmlDeclaration}\n${svgString}`;
  }
  
  /**
   * Get the metadata content for the SVG
   * @returns {string} - The metadata content
   */
  getMetadataContent() {
    return `<settings>${JSON.stringify(this.options)}</settings>`;
  }
  
  /**
   * Get the style content for the SVG
   * @returns {string} - The style content
   */
  getStyleContent() {
    return '';
  }
  
  /**
   * Create a download URL for the current SVG
   * @returns {string} - Object URL for the SVG
   */
  createSVGUrl() {
    const svgString = this.exportSVG();
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
  }
  
  /**
   * Export the current display as a PNG
   * @param {Function} callback - Function to call with the PNG URL
   * @param {number} scale - Scale factor for the PNG (default: 2)
   */
  exportAsPNG(callback, scale = 2) {
    const svgString = this.exportSVG();
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    
    // Create an image element to load the SVG
    const img = new Image();
    img.onload = () => {
      // Create a canvas with appropriate dimensions
      const canvas = document.createElement('canvas');
      canvas.width = this.options.width * scale;
      canvas.height = this.options.height * scale;
      
      // Draw the image to the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to PNG and return via callback
      const pngUrl = canvas.toDataURL('image/png');
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Return the PNG URL
      callback(pngUrl);
    };
    
    // Set the source to the SVG URL
    img.src = url;
  }
  
  /**
   * Resize the display
   * @param {number} width - New width in pixels
   * @param {number} height - New height in pixels (optional, defaults to width)
   */
  resize(width, height = width) {
    this.options.width = width;
    this.options.height = height;
    this.updateDimensions();
    this.updateStyles();
  }
}

describe('BaseDisplay', () => {
  let display;
  let element;
  
  beforeEach(() => {
    // Create a properly mocked SVG element with all required methods
    element = {
      innerHTML: '',
      style: {},
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      appendChild: jest.fn(),
      cloneNode: jest.fn(() => ({
        appendChild: jest.fn()
      }))
    };
    
    // Create a new instance of BaseDisplay
    display = new BaseDisplay(element, {
      width: 200,
      height: 200,
      color: '#ff0000'
    }, {
      width: 100,
      height: 100,
      color: '#000000'
    });
    
    // Mock methods that would be implemented by subclasses
    display.createElements = jest.fn();
    display.updateStyles = jest.fn();
    display.setState = jest.fn();
    display.getDefaultState = jest.fn(() => 'default');
    
    // Mock the addDefs method to avoid setting innerHTML
    display.addDefs = jest.fn();
  });
  
  test('initializes with merged options', () => {
    expect(display.element).toBe(element);
    expect(display.options.width).toBe(200);
    expect(display.options.height).toBe(200);
    expect(display.options.color).toBe('#ff0000');
  });
  
  test('init calls necessary methods', () => {
    // Reset the innerHTML to ensure it's empty before init
    element.innerHTML = '';
    
    // Mock getAttribute to return the expected viewBox
    element.getAttribute.mockReturnValue('0 0 100 100');
    
    display.init();
    
    expect(display.element.innerHTML).toBe('');
    expect(display.element.setAttribute).toHaveBeenCalledWith('viewBox', '0 0 100 100');
    expect(display.element.style.width).toBe('200px');
    expect(display.element.style.height).toBe('200px');
    
    expect(display.createElements).toHaveBeenCalled();
    expect(display.updateStyles).toHaveBeenCalled();
    expect(display.setState).toHaveBeenCalledWith('default');
  });
  
  test('setOption updates option and calls updateStyles', () => {
    display.setOption('color', '#00ff00');
    
    expect(display.options.color).toBe('#00ff00');
    expect(display.updateStyles).toHaveBeenCalled();
  });
  
  test('exportSVG returns SVG string with metadata', () => {
    // Mock XMLSerializer
    const mockSerializeToString = jest.fn(() => '<svg></svg>');
    global.XMLSerializer = jest.fn(() => ({
      serializeToString: mockSerializeToString
    }));
    
    const svg = display.exportSVG();
    
    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
    expect(mockSerializeToString).toHaveBeenCalled();
  });
  
  test('createSVGUrl returns URL for SVG', () => {
    // Mock Blob and URL.createObjectURL
    global.Blob = jest.fn(() => ({}));
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    
    const url = display.createSVGUrl();
    
    expect(global.Blob).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(url).toBe('mock-url');
  });
  
  test('exportAsPNG calls callback with PNG URL', (done) => {
    // Mock necessary objects and methods
    global.Blob = jest.fn(() => ({}));
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    
    // Mock Image
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 0);
      }
    };
    
    // Mock canvas and context
    const mockContext = {
      drawImage: jest.fn()
    };
    const mockCanvas = {
      getContext: jest.fn(() => mockContext),
      toDataURL: jest.fn(() => 'mock-png-url'),
      width: 0,
      height: 0
    };
    global.document.createElement = jest.fn((tag) => {
      if (tag === 'canvas') {
        return mockCanvas;
      }
      return {};
    });
    
    // Mock URL.revokeObjectURL
    global.URL.revokeObjectURL = jest.fn();
    
    display.exportAsPNG((url) => {
      expect(url).toBe('mock-png-url');
      expect(mockContext.drawImage).toHaveBeenCalled();
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
      done();
    });
  });
  
  test('resize updates dimensions and calls updateStyles', () => {
    display.resize(300, 400);
    
    expect(display.options.width).toBe(300);
    expect(display.options.height).toBe(400);
    expect(display.element.style.width).toBe('300px');
    expect(display.element.style.height).toBe('400px');
    expect(display.updateStyles).toHaveBeenCalled();
  });
  
  test('resize with single parameter sets both width and height', () => {
    display.resize(300);
    
    expect(display.options.width).toBe(300);
    expect(display.options.height).toBe(300);
  });
});

/**
 * Tests for a potential shared SettingsManager that could be used by both
 * MinesweeperTileDisplay and SevenSegmentDisplay
 */
describe('Shared SettingsManager', () => {
  // This is a conceptual test to demonstrate how a shared SettingsManager could work
  
  // Mock display classes
  class MockMinesweeperTileDisplay {
    constructor() {
      this.currentState = 'unplayed';
      this.options = {
        unplayedColor: '#4a90e2',
        revealedColor: '#C0C0C0'
      };
      this.setState = jest.fn();
      this.setOption = jest.fn();
    }
  }
  
  class MockSevenSegmentDisplay {
    constructor() {
      this.currentDigit = '8';
      this.options = {
        foregroundColor: '#ff0000',
        backgroundColor: '#000000'
      };
      this.setDigit = jest.fn();
      this.setOption = jest.fn();
    }
  }
  
  // Shared SettingsManager concept
  const SharedSettingsManager = {
    // Generic metadata generator that works with any display type
    generateMetadata: (display, displayType) => {
      // Common metadata structure
      const metadata = {
        generator: {
          name: displayType === 'minesweeper' ? 'Minesweeper Tile Generator' : '7-Segment LED Display Generator',
          version: '1.0.0'
        }
      };
      
      // Add display-specific content
      if (displayType === 'minesweeper') {
        metadata.content = {
          tileState: display.currentState,
          displayType: 'minesweeper-tile'
        };
        metadata.appearance = { ...display.options };
      } else if (displayType === '7segment') {
        metadata.content = {
          digit: display.currentDigit,
          displayType: '7-segment'
        };
        metadata.appearance = { ...display.options };
      }
      
      return metadata;
    },
    
    // Generic settings applier that works with any display type
    applySettingsFromMetadata: (metadata, display, displayType) => {
      // Apply content settings based on display type
      if (metadata.content) {
        if (displayType === 'minesweeper' && metadata.content.tileState) {
          display.setState(metadata.content.tileState);
        } else if (displayType === '7segment' && metadata.content.digit !== undefined) {
          display.setDigit(metadata.content.digit);
        }
      }
      
      // Apply appearance settings (works for any display type)
      if (metadata.appearance) {
        for (const [key, value] of Object.entries(metadata.appearance)) {
          if (value !== undefined) {
            display.setOption(key, value);
          }
        }
      }
    },
    
    // Generic settings file creator
    createSettingsFile: (display, displayType) => {
      const settings = SharedSettingsManager.generateMetadata(display, displayType);
      settings.meta = {
        type: 'user-settings',
        lastModified: new Date().toISOString(),
        description: `User settings for the ${displayType === 'minesweeper' ? 'Minesweeper Tile' : '7-Segment LED Display'} Generator`
      };
      
      // Save to localStorage with appropriate key
      const storageKey = displayType === 'minesweeper' ? 'minesweeper-last-settings' : '7segment-last-settings';
      localStorage.setItem(storageKey, JSON.stringify(settings));
      
      return settings;
    }
  };
  
  test('generateMetadata works for MinesweeperTileDisplay', () => {
    const display = new MockMinesweeperTileDisplay();
    const metadata = SharedSettingsManager.generateMetadata(display, 'minesweeper');
    
    expect(metadata).toHaveProperty('content');
    expect(metadata).toHaveProperty('appearance');
    expect(metadata).toHaveProperty('generator');
    
    expect(metadata.content.tileState).toBe('unplayed');
    expect(metadata.content.displayType).toBe('minesweeper-tile');
    
    expect(metadata.appearance.unplayedColor).toBe('#4a90e2');
    expect(metadata.appearance.revealedColor).toBe('#C0C0C0');
    
    expect(metadata.generator.name).toBe('Minesweeper Tile Generator');
  });
  
  test('generateMetadata works for SevenSegmentDisplay', () => {
    const display = new MockSevenSegmentDisplay();
    const metadata = SharedSettingsManager.generateMetadata(display, '7segment');
    
    expect(metadata).toHaveProperty('content');
    expect(metadata).toHaveProperty('appearance');
    expect(metadata).toHaveProperty('generator');
    
    expect(metadata.content.digit).toBe('8');
    expect(metadata.content.displayType).toBe('7-segment');
    
    expect(metadata.appearance.foregroundColor).toBe('#ff0000');
    expect(metadata.appearance.backgroundColor).toBe('#000000');
    
    expect(metadata.generator.name).toBe('7-Segment LED Display Generator');
  });
  
  test('applySettingsFromMetadata works for MinesweeperTileDisplay', () => {
    const display = new MockMinesweeperTileDisplay();
    const metadata = {
      content: {
        tileState: 'neighbor_1'
      },
      appearance: {
        unplayedColor: '#ff0000',
        revealedColor: '#00ff00'
      }
    };
    
    SharedSettingsManager.applySettingsFromMetadata(metadata, display, 'minesweeper');
    
    expect(display.setState).toHaveBeenCalledWith('neighbor_1');
    expect(display.setOption).toHaveBeenCalledWith('unplayedColor', '#ff0000');
    expect(display.setOption).toHaveBeenCalledWith('revealedColor', '#00ff00');
  });
  
  test('applySettingsFromMetadata works for SevenSegmentDisplay', () => {
    const display = new MockSevenSegmentDisplay();
    const metadata = {
      content: {
        digit: '5'
      },
      appearance: {
        foregroundColor: '#00ff00',
        backgroundColor: '#0000ff'
      }
    };
    
    SharedSettingsManager.applySettingsFromMetadata(metadata, display, '7segment');
    
    expect(display.setDigit).toHaveBeenCalledWith('5');
    expect(display.setOption).toHaveBeenCalledWith('foregroundColor', '#00ff00');
    expect(display.setOption).toHaveBeenCalledWith('backgroundColor', '#0000ff');
  });
  
  test('createSettingsFile works for MinesweeperTileDisplay', () => {
    const display = new MockMinesweeperTileDisplay();
    
    // Create a mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
    
    const settings = SharedSettingsManager.createSettingsFile(display, 'minesweeper');
    
    expect(settings).toHaveProperty('content');
    expect(settings).toHaveProperty('appearance');
    expect(settings).toHaveProperty('generator');
    expect(settings).toHaveProperty('meta');
    
    expect(settings.meta.type).toBe('user-settings');
    expect(settings.meta.description).toContain('Minesweeper Tile');
    
    expect(localStorage.setItem).toHaveBeenCalledWith('minesweeper-last-settings', expect.any(String));
  });
  
  test('createSettingsFile works for SevenSegmentDisplay', () => {
    const display = new MockSevenSegmentDisplay();
    
    // localStorage should already be mocked from the previous test
    
    const settings = SharedSettingsManager.createSettingsFile(display, '7segment');
    
    expect(settings).toHaveProperty('content');
    expect(settings).toHaveProperty('appearance');
    expect(settings).toHaveProperty('generator');
    expect(settings).toHaveProperty('meta');
    
    expect(settings.meta.type).toBe('user-settings');
    expect(settings.meta.description).toContain('7-Segment LED Display');
    
    expect(localStorage.setItem).toHaveBeenCalledWith('7segment-last-settings', expect.any(String));
  });
});
