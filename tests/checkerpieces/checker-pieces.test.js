/**
 * Tests for the Checker Pieces Generator
 */

// Mock DOM elements
const mockSvgElement = {
  innerHTML: '',
  setAttribute: jest.fn(),
  style: {},
  appendChild: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  removeChild: jest.fn(),
  cloneNode: jest.fn(() => ({
    ...mockSvgElement,
    children: []
  }))
};

// Mock document methods
document.createElementNS = jest.fn(() => ({
  ...mockSvgElement,
  setAttribute: jest.fn(),
  style: {},
  appendChild: jest.fn(),
  textContent: ''
}));

// Import the classes to test
const { CheckerPiece, CheckerBoard } = require('../../checkerpieces/js/checker-pieces.js');

describe('CheckerPiece', () => {
  let checkerPiece;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new CheckerPiece instance
    checkerPiece = new CheckerPiece(mockSvgElement);
  });
  
  test('initializes with default options', () => {
    expect(checkerPiece.options.pieceColor).toBe('#e74c3c');
    expect(checkerPiece.options.borderColor).toBe('#c0392b');
    expect(checkerPiece.options.size).toBe(80);
    expect(checkerPiece.options.borderWidth).toBe(3);
    expect(checkerPiece.options.is3D).toBe(true);
    expect(checkerPiece.options.isCrowned).toBe(false);
  });
  
  test('initializes with custom options', () => {
    const customOptions = {
      pieceColor: '#000000',
      borderColor: '#333333',
      size: 100,
      borderWidth: 5,
      is3D: false,
      isCrowned: true
    };
    
    checkerPiece = new CheckerPiece(mockSvgElement, customOptions);
    
    expect(checkerPiece.options.pieceColor).toBe('#000000');
    expect(checkerPiece.options.borderColor).toBe('#333333');
    expect(checkerPiece.options.size).toBe(100);
    expect(checkerPiece.options.borderWidth).toBe(5);
    expect(checkerPiece.options.is3D).toBe(false);
    expect(checkerPiece.options.isCrowned).toBe(true);
  });
  
  test('creates SVG elements during initialization', () => {
    expect(document.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'defs');
    expect(document.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'circle');
    expect(mockSvgElement.appendChild).toHaveBeenCalled();
  });
  
  test('setCrowned toggles the crowned state', () => {
    // Initially not crowned
    expect(checkerPiece.options.isCrowned).toBe(false);
    
    // Set to crowned
    checkerPiece.setCrowned(true);
    expect(checkerPiece.options.isCrowned).toBe(true);
    
    // Set back to not crowned
    checkerPiece.setCrowned(false);
    expect(checkerPiece.options.isCrowned).toBe(false);
  });
  
  test('setGlowEffect toggles the glow effect', () => {
    // Initially glow is disabled
    expect(checkerPiece.options.glowEnabled).toBe(false);
    
    // Enable glow
    checkerPiece.setGlowEffect(true);
    expect(checkerPiece.options.glowEnabled).toBe(true);
    
    // Disable glow
    checkerPiece.setGlowEffect(false);
    expect(checkerPiece.options.glowEnabled).toBe(false);
  });
  
  test('setOption updates a specific option', () => {
    checkerPiece.setOption('pieceColor', '#00ff00');
    expect(checkerPiece.options.pieceColor).toBe('#00ff00');
    
    checkerPiece.setOption('borderWidth', 10);
    expect(checkerPiece.options.borderWidth).toBe(10);
  });
  
  test('resize updates the size option and element style', () => {
    checkerPiece.resize(120);
    expect(checkerPiece.options.size).toBe(120);
    expect(mockSvgElement.style.width).toBe('120px');
    expect(mockSvgElement.style.height).toBe('120px');
  });
});

describe('CheckerBoard', () => {
  let checkerBoard;
  const mockBoardElement = {
    innerHTML: '',
    style: {},
    appendChild: jest.fn(),
    querySelector: jest.fn(() => ({
      appendChild: jest.fn(),
      querySelector: jest.fn(() => ({
        removeChild: jest.fn()
      }))
    })),
    querySelectorAll: jest.fn(() => [])
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    document.createElement = jest.fn(() => ({
      className: '',
      style: {},
      dataset: {},
      classList: {
        add: jest.fn()
      },
      appendChild: jest.fn()
    }));
    
    // Create a new CheckerBoard instance
    checkerBoard = new CheckerBoard(mockBoardElement);
  });
  
  test('initializes with default options', () => {
    expect(checkerBoard.options.boardSize).toBe(8);
    expect(checkerBoard.options.lightSquareColor).toBe('#f5deb3');
    expect(checkerBoard.options.darkSquareColor).toBe('#8b4513');
    expect(checkerBoard.options.redPieceColor).toBe('#e74c3c');
    expect(checkerBoard.options.blackPieceColor).toBe('#2c3e50');
  });
  
  test('initializes with custom options', () => {
    const customOptions = {
      boardSize: 10,
      lightSquareColor: '#ffffff',
      darkSquareColor: '#000000',
      redPieceColor: '#ff0000',
      blackPieceColor: '#000000'
    };
    
    checkerBoard = new CheckerBoard(mockBoardElement, customOptions);
    
    expect(checkerBoard.options.boardSize).toBe(10);
    expect(checkerBoard.options.lightSquareColor).toBe('#ffffff');
    expect(checkerBoard.options.darkSquareColor).toBe('#000000');
    expect(checkerBoard.options.redPieceColor).toBe('#ff0000');
    expect(checkerBoard.options.blackPieceColor).toBe('#000000');
  });
  
  test('creates board squares during initialization', () => {
    // For an 8x8 board, we should create 64 squares
    expect(document.createElement).toHaveBeenCalledTimes(64);
    expect(mockBoardElement.appendChild).toHaveBeenCalledTimes(64);
  });
  
  test('updateBoardColors updates the board colors', () => {
    const lightSquares = [{ style: {} }, { style: {} }];
    const darkSquares = [{ style: {} }, { style: {} }];
    
    mockBoardElement.querySelectorAll.mockImplementation((selector) => {
      if (selector === '.light-square') return lightSquares;
      if (selector === '.dark-square') return darkSquares;
      return [];
    });
    
    checkerBoard.updateBoardColors('#eeeeee', '#222222');
    
    expect(checkerBoard.options.lightSquareColor).toBe('#eeeeee');
    expect(checkerBoard.options.darkSquareColor).toBe('#222222');
    
    lightSquares.forEach(square => {
      expect(square.style.backgroundColor).toBe('#eeeeee');
    });
    
    darkSquares.forEach(square => {
      expect(square.style.backgroundColor).toBe('#222222');
    });
  });
  
  test('addPiece adds a piece to the board', () => {
    const mockSquare = {
      appendChild: jest.fn()
    };
    
    mockBoardElement.querySelector.mockReturnValue(mockSquare);
    
    const piece = checkerBoard.addPiece('red', 0, 0);
    
    expect(mockBoardElement.querySelector).toHaveBeenCalledWith('.board-square[data-row="0"][data-col="0"]');
    expect(mockSquare.appendChild).toHaveBeenCalled();
    expect(checkerBoard.pieces.length).toBe(1);
    expect(piece).toBeDefined();
  });
  
  test('removePiece removes a piece from the board', () => {
    // Add a piece first
    const mockSquare = {
      appendChild: jest.fn(),
      querySelector: jest.fn(() => 'svg-element'),
      removeChild: jest.fn()
    };
    
    mockBoardElement.querySelector.mockReturnValue(mockSquare);
    
    checkerBoard.addPiece('red', 0, 0);
    expect(checkerBoard.pieces.length).toBe(1);
    
    // Now remove it
    const result = checkerBoard.removePiece(0, 0);
    
    expect(result).toBe(true);
    expect(mockSquare.removeChild).toHaveBeenCalledWith('svg-element');
    expect(checkerBoard.pieces.length).toBe(0);
  });
  
  test('setupInitialPosition sets up the initial board position', () => {
    // Mock the addPiece method
    checkerBoard.addPiece = jest.fn();
    
    checkerBoard.setupInitialPosition();
    
    // For an 8x8 board, we should have 24 pieces (12 per side)
    expect(checkerBoard.addPiece).toHaveBeenCalledTimes(24);
  });
});
