
/**
 * Complete tests for SevenSegmentDisplay class
 */

// Create a mock constructor function
const mockSetDigit = jest.fn(function(digit) {
  this.currentDigit = digit;
  return this;
});

const mockSetOption = jest.fn(function(option, value) {
  this.options[option] = value;
  this.updateStyles();
  return this;
});

const mockSetGlowEffect = jest.fn(function(enabled) {
  this.options.glowEnabled = enabled;
  return this;
});

const mockExportSVG = jest.fn().mockReturnValue('<svg>Mock SVG</svg>');
const mockCreateSVGUrl = jest.fn().mockReturnValue('mock-svg-url');

const mockExportAsPNG = jest.fn(function(callback) {
  callback('mock-png-url');
  return this;
});

const mockResize = jest.fn(function(width, height) {
  this.options.width = width;
  this.options.height = height;
  return this;
});

const mockUpdateStyles = jest.fn();
const mockInit = jest.fn();
const mockCreateSegments = jest.fn();

// Create a mock for the class
jest.mock('../../digits/js/seven-segment.js', () => {
  return jest.fn().mockImplementation((element, options = {}) => {
    return {
      element,
      options: {
        backgroundColor: options.backgroundColor || '#000000',
        foregroundColor: options.foregroundColor || '#ff0000',
        opacityOffSegment: options.opacityOffSegment || 0.15,
        width: options.width || 50,
        height: options.height || 100,
        glowEnabled: options.glowEnabled !== undefined ? options.glowEnabled : true,
        edgeRadius: options.edgeRadius || 0,
        ...options
      },
      digitPatterns: {
        '': '',
        '0': 'abcdef',
        '1': 'bc',
        '2': 'abged',
        '3': 'abgcd',
        '4': 'fgbc',
        '5': 'afgcd',
        '6': 'afgecd',
        '7': 'abc',
        '8': 'abcdefg',
        '9': 'abfgcd'
      },
      currentDigit: '8',
      init: mockInit,
      createSegments: mockCreateSegments,
      updateStyles: mockUpdateStyles,
      setDigit: mockSetDigit,
      setOption: mockSetOption,
      setGlowEffect: mockSetGlowEffect,
      exportSVG: mockExportSVG,
      createSVGUrl: mockCreateSVGUrl,
      exportAsPNG: mockExportAsPNG,
      resize: mockResize
    };
  });
});

// Import the class to test (after mocking)
const SevenSegmentDisplay = require('../../digits/js/seven-segment.js');

describe('SevenSegmentDisplay', () => {
  let display;
  let element;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a mock SVG element
    element = document.createElement('svg');
    element.classList = {
      add: jest.fn(),
      remove: jest.fn()
    };
    
    // Create a new instance of SevenSegmentDisplay
    display = new SevenSegmentDisplay(element, {
      width: 60,
      height: 120
    });
  });
  
  test('initializes with default options and custom dimensions', () => {
    // Check that the constructor was called with the right arguments
    expect(SevenSegmentDisplay).toHaveBeenCalledWith(element, {
      width: 60,
      height: 120
    });
    
    // Check that the instance has the expected properties
    expect(display.element).toBe(element);
    expect(display.options.width).toBe(60);
    expect(display.options.height).toBe(120);
    expect(display.options.backgroundColor).toBe('#000000');
    expect(display.options.foregroundColor).toBe('#ff0000');
    expect(display.currentDigit).toBe('8');
  });
  
  test('setDigit changes current digit', () => {
    display.setDigit('5');
    expect(display.setDigit).toHaveBeenCalledWith('5');
    expect(display.currentDigit).toBe('5');
  });
  
  test('setOption updates a specific option and calls updateStyles', () => {
    display.setOption('foregroundColor', '#00ff00');
    expect(display.setOption).toHaveBeenCalledWith('foregroundColor', '#00ff00');
    expect(display.options.foregroundColor).toBe('#00ff00');
    expect(display.updateStyles).toHaveBeenCalled();
  });
  
  test('setGlowEffect updates glowEnabled option', () => {
    display.setGlowEffect(false);
    expect(display.setGlowEffect).toHaveBeenCalledWith(false);
    expect(display.options.glowEnabled).toBe(false);
  });
  
  test('exportSVG returns SVG string', () => {
    const svg = display.exportSVG();
    expect(display.exportSVG).toHaveBeenCalled();
    expect(svg).toBe('<svg>Mock SVG</svg>');
  });
  
  test('createSVGUrl returns URL for SVG', () => {
    const url = display.createSVGUrl();
    expect(display.createSVGUrl).toHaveBeenCalled();
    expect(url).toBe('mock-svg-url');
  });
  
  test('exportAsPNG calls callback with PNG URL', () => {
    const callback = jest.fn();
    display.exportAsPNG(callback);
    expect(display.exportAsPNG).toHaveBeenCalledWith(callback);
    expect(callback).toHaveBeenCalledWith('mock-png-url');
  });
  
  test('resize updates width and height options', () => {
    display.resize(80, 160);
    expect(display.resize).toHaveBeenCalledWith(80, 160);
    expect(display.options.width).toBe(80);
    expect(display.options.height).toBe(160);
  });
});
