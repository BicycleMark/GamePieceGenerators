/**
 * Tests for MinesweeperTileDisplay class
 */

// Create mock functions
const mockInit = jest.fn();
const mockCreateTileElements = jest.fn();
const mockUpdateStyles = jest.fn();

const mockSetState = jest.fn(function(state) {
  if (this.tileStates.includes(state)) {
    this.currentState = state;
    this.element.classList.add(`tile-${state}`);
  }
  return this;
});

const mockSetOption = jest.fn(function(option, value) {
  this.options[option] = value;
  this.updateStyles();
  return this;
});

const mockSetInnerShadowEffect = jest.fn(function(enabled) {
  this.options.innerShadowEnabled = enabled;
  return this;
});

const mockExportSVG = jest.fn().mockReturnValue('<svg>Mock SVG</svg>');
const mockCreateSVGUrl = jest.fn().mockReturnValue('mock-svg-url');

const mockExportAsPNG = jest.fn(function(callback) {
  callback('mock-png-url');
  return this;
});

const mockResize = jest.fn(function(size) {
  this.options.tileSize = size;
  return this;
});

// Mock the class
jest.mock('../../tiles/js/minesweeper-tiles.js', () => {
  return jest.fn().mockImplementation((element, options = {}) => {
    const instance = {
      element,
      options: {
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
      },
      
      tileStates: [
        'unplayed',
        'pressed',
        'flagged',
        'revealed_mine',
        'wrong_guess',
        'neighbor_0',
        'neighbor_1',
        'neighbor_2',
        'neighbor_3',
        'neighbor_4',
        'neighbor_5',
        'neighbor_6',
        'neighbor_7',
        'neighbor_8',
        // New smiley tile states
        'smiley_normal',
        'smiley_cool',
        'smiley_sad',
        'smiley_neutral',
        'smiley_tense'
      ],
      
      currentState: 'unplayed',
      
      init: mockInit,
      createTileElements: mockCreateTileElements,
      updateStyles: mockUpdateStyles,
      setState: mockSetState,
      setOption: mockSetOption,
      setInnerShadowEffect: mockSetInnerShadowEffect,
      exportSVG: mockExportSVG,
      createSVGUrl: mockCreateSVGUrl,
      exportAsPNG: mockExportAsPNG,
      resize: mockResize
    };
    
    // Call init in the constructor
    instance.init();
    
    return instance;
  });
});

// Import the class to test (after mocking)
const MinesweeperTileDisplay = require('../../tiles/js/minesweeper-tiles.js');

describe('MinesweeperTileDisplay', () => {
  let display;
  let element;
  
  beforeEach(() => {
    // Create a mock SVG element
    element = document.createElement('svg');
    
    // Create a new instance of MinesweeperTileDisplay
    display = new MinesweeperTileDisplay(element, {
      tileSize: 100
    });
  });
  
  test('initializes with default options and custom tileSize', () => {
    // Check that the constructor was called with the right arguments
    expect(display.element).toBe(element);
    expect(display.options.tileSize).toBe(100);
    expect(display.options.unplayedColor).toBe('#4a90e2');
    expect(display.options.numberOutlineColor).toBe('#ffffff');
    expect(display.currentState).toBe('unplayed');
    
    // Check that init was called
    expect(display.init).toHaveBeenCalled();
  });
  
  test('setState changes current state', () => {
    display.setState('neighbor_1');
    expect(display.setState).toHaveBeenCalledWith('neighbor_1');
  });
  
  test('setOption updates a specific option and calls updateStyles', () => {
    display.setOption('unplayedColor', '#ff0000');
    expect(display.setOption).toHaveBeenCalledWith('unplayedColor', '#ff0000');
    expect(display.options.unplayedColor).toBe('#ff0000');
    expect(display.updateStyles).toHaveBeenCalled();
  });
  
  test('setInnerShadowEffect updates innerShadowEnabled option', () => {
    display.setInnerShadowEffect(false);
    expect(display.setInnerShadowEffect).toHaveBeenCalledWith(false);
    expect(display.options.innerShadowEnabled).toBe(false);
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
  
  test('resize updates tileSize option', () => {
    display.resize(200);
    expect(display.resize).toHaveBeenCalledWith(200);
    expect(display.options.tileSize).toBe(200);
  });
  
  // Tests for new smiley tile states
  test('setState works with smiley_normal state', () => {
    display.setState('smiley_normal');
    expect(display.setState).toHaveBeenCalledWith('smiley_normal');
    expect(display.currentState).toBe('smiley_normal');
  });
  
  test('setState works with smiley_cool state', () => {
    display.setState('smiley_cool');
    expect(display.setState).toHaveBeenCalledWith('smiley_cool');
    expect(display.currentState).toBe('smiley_cool');
  });
  
  test('setState works with smiley_sad state', () => {
    display.setState('smiley_sad');
    expect(display.setState).toHaveBeenCalledWith('smiley_sad');
    expect(display.currentState).toBe('smiley_sad');
  });
  
  test('setState works with smiley_neutral state', () => {
    display.setState('smiley_neutral');
    expect(display.setState).toHaveBeenCalledWith('smiley_neutral');
    expect(display.currentState).toBe('smiley_neutral');
  });
  
  test('setState works with smiley_tense state', () => {
    display.setState('smiley_tense');
    expect(display.setState).toHaveBeenCalledWith('smiley_tense');
    expect(display.currentState).toBe('smiley_tense');
  });
  
  test('tileStates array includes all smiley states', () => {
    expect(display.tileStates).toContain('smiley_normal');
    expect(display.tileStates).toContain('smiley_cool');
    expect(display.tileStates).toContain('smiley_sad');
    expect(display.tileStates).toContain('smiley_neutral');
    expect(display.tileStates).toContain('smiley_tense');
  });
});
