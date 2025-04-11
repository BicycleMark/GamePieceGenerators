/**
 * Tests for Chess Pieces Generator
 */

const { ChessPiece } = require('../../chess/js/chess-pieces');
const ChessBoard = require('../../chess/js/chess-board');

// Mock document and SVG elements
const setupMocks = () => {
  // Mock SVG element
  const mockSvgElement = {
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    appendChild: jest.fn(),
    querySelector: jest.fn(() => ({
      appendChild: jest.fn()
    })),
    innerHTML: '',
    outerHTML: '<svg></svg>'
  };
  
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
  
  global.document.createElement = jest.fn((type) => {
    if (type === 'canvas') {
      return mockCanvas;
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
  
  return { mockSvgElement };
};

describe('ChessPiece', () => {
  let chessPiece;
  let mockSvgElement;
  
  beforeEach(() => {
    const mocks = setupMocks();
    mockSvgElement = mocks.mockSvgElement;
    
    // Create a new chess piece for each test
    const { ChessPiece } = require('../../chess/js/chess-pieces');
    chessPiece = new ChessPiece(mockSvgElement);
  });
  
  test('should initialize with default options', () => {
    // Check that SVG element attributes were set
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('xmlns', 'http://www.w3.org/2000/svg');
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('viewBox', '0 0 100 100');
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('width', '80px');
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('height', '80px');
    
    // Check that default options were set
    expect(chessPiece.options.pieceType).toBe('pawn');
    expect(chessPiece.options.pieceColor).toBe('white');
    expect(chessPiece.options.pieceColorValue).toBe('#FFFFFF');
    expect(chessPiece.options.borderColorValue).toBe('#CCCCCC');
  });
  
  test('should initialize with custom options', () => {
    const customOptions = {
      pieceType: 'king',
      pieceColor: 'black',
      pieceColorValue: '#000000',
      borderColorValue: '#333333',
      size: 100,
      borderWidth: 4,
      is3D: false,
      style: 'modern'
    };
    
    const { ChessPiece } = require('../../chess/js/chess-pieces');
    chessPiece = new ChessPiece(mockSvgElement, customOptions);
    
    // Check that SVG element attributes were set with custom values
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('width', '100px');
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('height', '100px');
    
    // Check that custom options were set
    expect(chessPiece.options.pieceType).toBe('king');
    expect(chessPiece.options.pieceColor).toBe('black');
    expect(chessPiece.options.pieceColorValue).toBe('#000000');
    expect(chessPiece.options.borderColorValue).toBe('#333333');
    expect(chessPiece.options.size).toBe(100);
    expect(chessPiece.options.borderWidth).toBe(4);
    expect(chessPiece.options.is3D).toBe(false);
    expect(chessPiece.options.style).toBe('modern');
  });
  
  test('should get path data for different piece types', () => {
    // Test pawn path data
    chessPiece.options.pieceType = 'pawn';
    chessPiece.options.pieceColor = 'white';
    let pathData = chessPiece.getPiecePathData();
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData[0].d).toBeDefined();
    
    // Test rook path data
    chessPiece.options.pieceType = 'rook';
    pathData = chessPiece.getPiecePathData();
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData[0].d).toBeDefined();
    
    // Test knight path data
    chessPiece.options.pieceType = 'knight';
    pathData = chessPiece.getPiecePathData();
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData[0].d).toBeDefined();
    
    // Test bishop path data
    chessPiece.options.pieceType = 'bishop';
    pathData = chessPiece.getPiecePathData();
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData[0].d).toBeDefined();
    
    // Test queen path data
    chessPiece.options.pieceType = 'queen';
    pathData = chessPiece.getPiecePathData();
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData[0].d).toBeDefined();
    
    // Test king path data
    chessPiece.options.pieceType = 'king';
    pathData = chessPiece.getPiecePathData();
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData[0].d).toBeDefined();
  });
  
  test('should set options and re-render', () => {
    // Spy on init method
    const initSpy = jest.spyOn(chessPiece, 'init');
    
    // Set a single option
    const setOptionResult = chessPiece.setOption('pieceType', 'king');
    expect(setOptionResult).toBe(true);
    expect(chessPiece.options.pieceType).toBe('king');
    expect(initSpy).toHaveBeenCalled();
    
    // Set multiple options
    initSpy.mockClear();
    const setOptionsResult = chessPiece.setOptions({
      pieceColor: 'black',
      pieceColorValue: '#000000',
      borderColorValue: '#333333'
    });
    expect(setOptionsResult).toBe(true);
    expect(chessPiece.options.pieceColor).toBe('black');
    expect(chessPiece.options.pieceColorValue).toBe('#000000');
    expect(chessPiece.options.borderColorValue).toBe('#333333');
    expect(initSpy).toHaveBeenCalled();
  });
  
  test('should resize the piece', () => {
    const resizeResult = chessPiece.resize(120);
    expect(resizeResult).toBe(true);
    expect(chessPiece.options.size).toBe(120);
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('width', '120px');
    expect(mockSvgElement.setAttribute).toHaveBeenCalledWith('height', '120px');
  });
  
  test('should toggle effects', () => {
    // Spy on init method
    const initSpy = jest.spyOn(chessPiece, 'init');
    
    // Toggle glow effect
    const setGlowResult = chessPiece.setGlowEffect(true);
    expect(setGlowResult).toBe(true);
    expect(chessPiece.options.glowEnabled).toBe(true);
    expect(initSpy).toHaveBeenCalled();
    
    // Toggle shadow effect
    initSpy.mockClear();
    const setShadowResult = chessPiece.setShadowEffect(true);
    expect(setShadowResult).toBe(true);
    expect(chessPiece.options.shadowEnabled).toBe(true);
    expect(initSpy).toHaveBeenCalled();
    
    // Toggle 3D effect
    initSpy.mockClear();
    const set3DResult = chessPiece.set3DEffect(false);
    expect(set3DResult).toBe(true);
    expect(chessPiece.options.is3D).toBe(false);
    expect(initSpy).toHaveBeenCalled();
  });
  
  test('should export as SVG', () => {
    const svgString = chessPiece.exportSVG();
    expect(typeof svgString).toBe('string');
    expect(svgString).toBe('<svg></svg>');
  });
  
  test('should export as PNG', async () => {
    const pngDataUrl = await chessPiece.exportPNG();
    expect(typeof pngDataUrl).toBe('string');
    expect(pngDataUrl).toBe('data:image/png;base64,mockdata');
  });
});

describe('ChessBoard', () => {
  let chessBoard;
  let mockBoardElement;
  
  beforeEach(() => {
    setupMocks();
    
    // Mock board element
    mockBoardElement = {
      innerHTML: '',
      appendChild: jest.fn(),
      classList: {
        add: jest.fn()
      },
      style: {},
      querySelectorAll: jest.fn(() => []),
      querySelector: jest.fn(() => null)
    };
    
    // Create a new chess board for each test
    chessBoard = new ChessBoard(mockBoardElement);
  });
  
  test('should initialize with default options', () => {
    // Check that board element attributes were set
    expect(mockBoardElement.classList.add).toHaveBeenCalledWith('chess-board');
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
      darkSquareColor: '#769656'
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
  });
  
  test('should update board colors', () => {
    // Mock light and dark squares
    const mockLightSquares = [
      { style: {} },
      { style: {} }
    ];
    const mockDarkSquares = [
      { style: {} },
      { style: {} }
    ];
    
    mockBoardElement.querySelectorAll.mockImplementation((selector) => {
      if (selector === '.light-square') {
        return mockLightSquares;
      }
      if (selector === '.dark-square') {
        return mockDarkSquares;
      }
      return [];
    });
    
    // Update board colors
    chessBoard.updateBoardColors('#EEEED2', '#769656');
    
    // Check that options were updated
    expect(chessBoard.options.lightSquareColor).toBe('#EEEED2');
    expect(chessBoard.options.darkSquareColor).toBe('#769656');
    
    // Check that square colors were updated
    expect(mockLightSquares[0].style.backgroundColor).toBe('#EEEED2');
    expect(mockLightSquares[1].style.backgroundColor).toBe('#EEEED2');
    expect(mockDarkSquares[0].style.backgroundColor).toBe('#769656');
    expect(mockDarkSquares[1].style.backgroundColor).toBe('#769656');
  });
  
  test('should add and remove pieces', () => {
    // Mock square element
    const mockSquare = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      querySelector: jest.fn(() => ({ parentNode: mockSquare }))
    };
    
    // Mock querySelector to return the square
    mockBoardElement.querySelector.mockImplementation(() => mockSquare);
    
    // Add a piece
    const piece = chessBoard.addPiece('pawn', 'white', 1, 2);
    
    // Check that the piece was added
    expect(piece).toBeDefined();
    expect(mockSquare.appendChild).toHaveBeenCalled();
    expect(chessBoard.pieces.length).toBe(1);
    expect(chessBoard.pieces[0].type).toBe('pawn');
    expect(chessBoard.pieces[0].color).toBe('white');
    expect(chessBoard.pieces[0].row).toBe(1);
    expect(chessBoard.pieces[0].col).toBe(2);
    
    // Remove the piece
    const removeResult = chessBoard.removePiece(1, 2);
    
    // Check that the piece was removed
    expect(removeResult).toBe(true);
    expect(mockSquare.removeChild).toHaveBeenCalled();
    expect(chessBoard.pieces.length).toBe(0);
  });
  
  test('should clear the board', () => {
    // Mock SVG elements
    const mockSvgElements = [
      { parentNode: { removeChild: jest.fn() } },
      { parentNode: { removeChild: jest.fn() } }
    ];
    
    // Mock querySelectorAll to return SVG elements
    mockBoardElement.querySelectorAll.mockImplementation(() => mockSvgElements);
    
    // Add some pieces to the board
    chessBoard.pieces = [
      { row: 0, col: 0 },
      { row: 1, col: 1 }
    ];
    
    // Clear the board
    const clearResult = chessBoard.clearBoard();
    
    // Check that the board was cleared
    expect(clearResult).toBe(true);
    expect(mockSvgElements[0].parentNode.removeChild).toHaveBeenCalled();
    expect(mockSvgElements[1].parentNode.removeChild).toHaveBeenCalled();
    expect(chessBoard.pieces.length).toBe(0);
  });
  
  test('should setup initial position', () => {
    // Spy on clearBoard and addPiece methods
    const clearBoardSpy = jest.spyOn(chessBoard, 'clearBoard').mockImplementation(() => true);
    const addPieceSpy = jest.spyOn(chessBoard, 'addPiece').mockImplementation(() => ({}));
    
    // Setup initial position
    const setupResult = chessBoard.setupInitialPosition();
    
    // Check that the board was cleared
    expect(clearBoardSpy).toHaveBeenCalled();
    
    // Check that pieces were added
    expect(addPieceSpy).toHaveBeenCalledTimes(32); // 16 pawns + 16 pieces
    
    // Check specific piece positions
    expect(addPieceSpy).toHaveBeenCalledWith('pawn', 'white', 6, 0);
    expect(addPieceSpy).toHaveBeenCalledWith('pawn', 'black', 1, 0);
    expect(addPieceSpy).toHaveBeenCalledWith('rook', 'white', 7, 0);
    expect(addPieceSpy).toHaveBeenCalledWith('knight', 'white', 7, 1);
    expect(addPieceSpy).toHaveBeenCalledWith('bishop', 'white', 7, 2);
    expect(addPieceSpy).toHaveBeenCalledWith('queen', 'white', 7, 3);
    expect(addPieceSpy).toHaveBeenCalledWith('king', 'white', 7, 4);
    
    // Check that the setup was successful
    expect(setupResult).toBe(true);
  });
  
  test('should update piece colors', () => {
    // Add some pieces to the board
    chessBoard.pieces = [
      { color: 'white', piece: { setOptions: jest.fn() } },
      { color: 'black', piece: { setOptions: jest.fn() } }
    ];
    
    // Update piece colors
    const updateResult = chessBoard.updatePieceColors('#E8E8E8', '#DDDDDD', '#202020', '#444444');
    
    // Check that options were updated
    expect(chessBoard.options.whitePieceColor).toBe('#E8E8E8');
    expect(chessBoard.options.whitePieceBorder).toBe('#DDDDDD');
    expect(chessBoard.options.blackPieceColor).toBe('#202020');
    expect(chessBoard.options.blackPieceBorder).toBe('#444444');
    
    // Check that piece colors were updated
    expect(chessBoard.pieces[0].piece.setOptions).toHaveBeenCalledWith({
      pieceColorValue: '#E8E8E8',
      borderColorValue: '#DDDDDD'
    });
    expect(chessBoard.pieces[1].piece.setOptions).toHaveBeenCalledWith({
      pieceColorValue: '#202020',
      borderColorValue: '#444444'
    });
    
    // Check that the update was successful
    expect(updateResult).toBe(true);
  });
  
  test('should update piece style', () => {
    // Add some pieces to the board
    chessBoard.pieces = [
      { piece: { setOption: jest.fn() } },
      { piece: { setOption: jest.fn() } }
    ];
    
    // Update piece style
    const updateResult = chessBoard.updatePieceStyle('modern');
    
    // Check that options were updated
    expect(chessBoard.options.style).toBe('modern');
    
    // Check that piece styles were updated
    expect(chessBoard.pieces[0].piece.setOption).toHaveBeenCalledWith('style', 'modern');
    expect(chessBoard.pieces[1].piece.setOption).toHaveBeenCalledWith('style', 'modern');
    
    // Check that the update was successful
    expect(updateResult).toBe(true);
  });
  
  test('should toggle effects', () => {
    // Add some pieces to the board
    chessBoard.pieces = [
      { piece: { set3DEffect: jest.fn(), setGlowEffect: jest.fn(), setShadowEffect: jest.fn() } },
      { piece: { set3DEffect: jest.fn(), setGlowEffect: jest.fn(), setShadowEffect: jest.fn() } }
    ];
    
    // Toggle 3D effect
    const toggle3DResult = chessBoard.toggle3DEffect(false);
    
    // Check that options were updated
    expect(chessBoard.options.is3D).toBe(false);
    
    // Check that piece effects were updated
    expect(chessBoard.pieces[0].piece.set3DEffect).toHaveBeenCalledWith(false);
    expect(chessBoard.pieces[1].piece.set3DEffect).toHaveBeenCalledWith(false);
    
    // Check that the toggle was successful
    expect(toggle3DResult).toBe(true);
    
    // Toggle glow effect
    const toggleGlowResult = chessBoard.toggleGlowEffect(true);
    
    // Check that options were updated
    expect(chessBoard.options.glowEnabled).toBe(true);
    
    // Check that piece effects were updated
    expect(chessBoard.pieces[0].piece.setGlowEffect).toHaveBeenCalledWith(true);
    expect(chessBoard.pieces[1].piece.setGlowEffect).toHaveBeenCalledWith(true);
    
    // Check that the toggle was successful
    expect(toggleGlowResult).toBe(true);
    
    // Toggle shadow effect
    const toggleShadowResult = chessBoard.toggleShadowEffect(false);
    
    // Check that options were updated
    expect(chessBoard.options.shadowEnabled).toBe(false);
    
    // Check that piece effects were updated
    expect(chessBoard.pieces[0].piece.setShadowEffect).toHaveBeenCalledWith(false);
    expect(chessBoard.pieces[1].piece.setShadowEffect).toHaveBeenCalledWith(false);
    
    // Check that the toggle was successful
    expect(toggleShadowResult).toBe(true);
  });
});
