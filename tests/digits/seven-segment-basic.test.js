/**
 * Basic tests for SevenSegmentDisplay class
 */

// Import the base class first
const BaseDisplay = require('../../shared/js/base-display.js');

// Import the class to test
const SevenSegmentDisplay = require('../../digits/js/seven-segment.js');

// Mock document methods needed for testing
global.document = {
  createElement: jest.fn(() => ({
    innerHTML: '',
    style: {},
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    },
    cloneNode: jest.fn(() => ({
      appendChild: jest.fn()
    }))
  })),
  createElementNS: jest.fn(() => ({
    setAttribute: jest.fn(),
    innerHTML: '',
    textContent: ''
  }))
};

// Mock XMLSerializer
global.XMLSerializer = function() {
  return {
    serializeToString: jest.fn(() => '<svg></svg>')
  };
};

// Mock URL
global.URL = {
  createObjectURL: jest.fn(() => 'blob:url'),
  revokeObjectURL: jest.fn()
};

// Mock Image
global.Image = function() {
  return {
    onload: null,
    src: null
  };
};

describe('SevenSegmentDisplay', () => {
  let display;
  let element;
  
  beforeEach(() => {
    // Create a mock SVG element
    element = document.createElement('svg');
    
    // Create a new instance of SevenSegmentDisplay
    display = new SevenSegmentDisplay(element, {
      width: 60,
      height: 120
    });
  });
  
  // Test that the class exists
  test('SevenSegmentDisplay class exists', () => {
    expect(typeof SevenSegmentDisplay).toBe('function');
  });
  
  // Test that the class has the expected methods
  test('SevenSegmentDisplay has expected methods', () => {
    // Methods specific to SevenSegmentDisplay
    const specificMethods = [
      'createElements', // renamed from createSegments
      'setDigit',
      'updateStyles',
      'setGlowEffect',
      'getViewBox'
    ];
    
    // Methods inherited from BaseDisplay
    const inheritedMethods = [
      'init',
      'setOption',
      'exportSVG',
      'createSVGUrl',
      'exportAsPNG',
      'resize'
    ];
    
    // Check specific methods
    const proto = SevenSegmentDisplay.prototype;
    specificMethods.forEach(method => {
      expect(typeof proto[method]).toBe('function');
    });
    
    // Check inherited methods
    inheritedMethods.forEach(method => {
      // These methods might be on the prototype chain, not directly on the prototype
      expect(typeof display[method]).toBe('function');
    });
  });
  
  // Test constructor
  test('constructor initializes with default options and custom dimensions', () => {
    expect(display.element).toBe(element);
    expect(display.options.width).toBe(60);
    expect(display.options.height).toBe(120);
    expect(display.options.backgroundColor).toBe('#000000');
    expect(display.options.foregroundColor).toBe('#ff0000');
    expect(display.currentDigit).toBe('8');
  });
  
  // Test setDigit method
  test('setDigit method exists and can be called', () => {
    expect(() => display.setDigit('5')).not.toThrow();
  });
  
  // Test setOption method
  test('setOption method exists and can be called', () => {
    expect(() => display.setOption('foregroundColor', '#00ff00')).not.toThrow();
  });
  
  // Test setGlowEffect method
  test('setGlowEffect method exists and can be called', () => {
    expect(() => display.setGlowEffect(false)).not.toThrow();
  });
  
  // Test exportSVG method
  test('exportSVG method exists and returns a string', () => {
    const svg = display.exportSVG();
    expect(typeof svg).toBe('string');
  });
  
  // Test createSVGUrl method
  test('createSVGUrl method exists and returns a string', () => {
    const url = display.createSVGUrl();
    expect(typeof url).toBe('string');
  });
  
  // Test exportAsPNG method
  test('exportAsPNG method exists and can be called with a callback', () => {
    const callback = jest.fn();
    expect(() => display.exportAsPNG(callback)).not.toThrow();
  });
  
  // Test resize method
  test('resize method exists and can be called', () => {
    expect(() => display.resize(80, 160)).not.toThrow();
  });
});
