/**
 * Tests for Chess Board
 */

const ChessBoard = require('../../chess/js/chess-board');

// Mock document and SVG elements
const setupMocks = () => {
  // Mock document.createElementNS
  global.document = {
    createElementNS: jest.fn(() => ({
      setAttribute: jest.fn(),
      appendChild: jest.fn()
    }))
  };
  
  // Mock Image
  global.Image = class {
    constructor() {
      this.style = {};
      this.onload = null;
      this.onerror = null;
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  };
  
  // Mock URL.createObjectURL and URL.revokeObjectURL
  global.URL = {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn()
  };
  
  // Mock Blob
  global.Blob = class {
    constructor() {}
  };
  
  // Mock canvas
  const mockContext = {
    drawImage: jest.fn()
  };
  
  const mockCanvas = {
    getContext: jest.fn(() => mockContext),
    toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
    width: 0,
    height: 0
  };
  
  // Mock XMLSerializer
  global.XMLSerializer = class {
    serializeToString() {
      return '<svg></svg>';
    }
  };
  
  // Mock DOMParser
  global.DOMParser = class {
    parseFromString() {
      return {
        documentElement: {
          setAttribute: jest.fn(),
          appendChild: jest.fn()
        }
      };
    }
  };
  
  global.document.createElement = jest.fn((type) => {
    if (type === 'canvas') {
      return mockCanvas;
    }
    if (type === 'img') {
      return new Image();
    }
    return {
      setAttribute: jest.fn(),
      appendChild: jest.fn(),
      click: jest.fn(),
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      },
      style: {},
      dataset: {}
    };
  });
  
  // Mock fetch
  global.fetch = jest.fn(() => 
    Promise.resolve({
      text: () => Promise.resolve('<svg></svg>')
    })
  );
  
  // Mock importNode
  global.document.importNode = jest.fn(() => ({
    setAttribute: jest.fn(),
    appendChild: jest.fn()
  }));
  
  // Mock board element
  const mockBoardElement = {
    innerHTML: '',
    appendChild: jest.fn(),
    style: {}
  };
  
  return { mockBoardElement };
};

describe('ChessBoard', () => {
  let chessBoard;
  let mockBoardElement;
  
  beforeEach(() => {
    const mocks = setupMocks();
    mockBoardElement = mocks.mockBoardElement;
    
    // Create a new chess board for each test
    chessBoard = new ChessBoard(mockBoardElement);
  });
  
  test('should initialize with default options', () => {
    // Check that board element attributes were set
    expect(mockBoardElement.style.display).toBe('grid');
    expect(mockBoardElement.style.gridTemplateColumns).toBe('repeat(8, 60px)');
    expect(mockBoardElement.style.gridTemplateRows).toBe('repeat(8, 60px)');
    expect(mockBoardElement.style.width).toBe('480px');
    expect(mockBoardElement.style.height).toBe('480px');
    
    // Check that default options were set
    expect(chessBoard.options.boardSize).toBe(8);
    expect(chessBoard.options.squareSize).toBe(60);
    expect(chessBoard.options.lightSquareColor).toBe('#F0D9B5');
    expect(chessBoard.options.darkSquareColor).toBe('#B58863');
  });
  
  test('should initialize with custom options', () => {
    const customOptions = {
      boardSize: 10,
      squareSize: 50,
      lightSquareColor: '#EEEED2',
      darkSquareColor: '#769656',
      theme: 'light',
      showCoordinates: true
    };
    
    chessBoard = new ChessBoard(mockBoardElement, customOptions);
    
    // Check that board element attributes were set with custom values
    expect(mockBoardElement.style.gridTemplateColumns).toBe('repeat(10, 50px)');
    expect(mockBoardElement.style.gridTemplateRows).toBe('repeat(10, 50px)');
    expect(mockBoardElement.style.width).toBe('500px');
    expect(mockBoardElement.style.height).toBe('500px');
    
    // Check that custom options were set
    expect(chessBoard.options.boardSize).toBe(10);
    expect(chessBoard.options.squareSize).toBe(50);
    expect(chessBoard.options.lightSquareColor).toBe('#EEEED2');
    expect(chessBoard.options.darkSquareColor).toBe('#769656');
    expect(chessBoard.options.theme).toBe('light');
    expect(chessBoard.options.showCoordinates).toBe(true);
  });
  
  test('should add pieces to the board', () => {
    // Mock square element
    const mockSquare = {
      appendChild: jest.fn()
    };
    
    // Add square to squares array
    chessBoard.squares = [[null, null], [null, mockSquare]];
    
    // Add a piece
    const piece = chessBoard.addPiece('pawn', 'white', 1, 1);
    
    // Check that the piece was added
    expect(piece).toBeDefined();
    expect(mockSquare.appendChild).toHaveBeenCalled();
    expect(chessBoard.pieces.length).toBe(1);
    expect(chessBoard.pieces[0].type).toBe('pawn');
    expect(chessBoard.pieces[0].color).toBe('white');
    expect(chessBoard.pieces[0].row).toBe(1);
    expect(chessBoard.pieces[0].col).toBe(1);
  });
  
  test('should clear the board', () => {
    // Add some pieces to the board
    chessBoard.pieces = [
      { element: { parentNode: { removeChild: jest.fn() } } },
      { element: { parentNode: { removeChild: jest.fn() } } }
    ];
    
    // Clear the board
    chessBoard.clearBoard();
    
    // Check that the board was cleared
    expect(chessBoard.pieces.length).toBe(0);
  });
  
  test('should update board colors', () => {
    // Setup squares
    chessBoard.squares = [
      [{ style: {} }, { style: {} }],
      [{ style: {} }, { style: {} }]
    ];
    
    // Update board colors
    chessBoard.updateBoardColors('#EEEED2', '#769656');
    
    // Check that options were updated
    expect(chessBoard.options.lightSquareColor).toBe('#EEEED2');
    expect(chessBoard.options.darkSquareColor).toBe('#769656');
    
    // Check that square colors were updated
    expect(chessBoard.squares[0][0].style.backgroundColor).toBe('#EEEED2');
    expect(chessBoard.squares[0][1].style.backgroundColor).toBe('#769656');
    expect(chessBoard.squares[1][0].style.backgroundColor).toBe('#769656');
    expect(chessBoard.squares[1][1].style.backgroundColor).toBe('#EEEED2');
  });
  
  test('should update theme', () => {
    // Spy on init method
    const initSpy = jest.spyOn(chessBoard, 'init');
    
    // Update theme
    chessBoard.updateTheme('light');
    
    // Check that options were updated
    expect(chessBoard.options.theme).toBe('light');
    
    // Check that init was called to rebuild the board
    expect(initSpy).toHaveBeenCalled();
  });
  
  test('should export as SVG', () => {
    const svgString = chessBoard.exportSVG();
    expect(typeof svgString).toBe('string');
    expect(svgString).toBe('<svg></svg>');
  });
});
