/**
 * Chess Piece Generator
 * Core functionality for rendering chess pieces
 */

class ChessPiece {
  /**
   * Constructor for the ChessPiece class
   * @param {HTMLElement} element - The SVG element to render the piece in
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      pieceType: options.pieceType || 'bishop',
      theme: options.theme || 'dark',
      size: options.size || 150,
      ...options
    };
    
    this.init();
  }
  
  /**
   * Initialize the piece
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set the dimensions
    this.element.style.width = `${this.options.size}px`;
    this.element.style.height = `${this.options.size}px`;
    
    // Render the piece
    this.renderPiece();
  }
  
  /**
   * Render the chess piece
   */
  renderPiece() {
    const pieceType = this.options.pieceType;
    const theme = this.options.theme;
    
    // Determine the folder based on theme
    const folder = theme === 'dark' ? 'dark-theme' : 'white-theme';
    
    // Create an img element
    const img = document.createElement('img');
    img.src = `../chess/samples/${folder}/${pieceType}.svg`;
    img.style.width = '100%';
    img.style.height = '100%';
    
    // Add error handling
    img.onerror = () => {
      this.renderErrorState();
    };
    
    // Clear the element and add the img
    this.element.innerHTML = '';
    this.element.appendChild(img);
  }
  
  /**
   * Render an error state in the element
   */
  renderErrorState() {
    this.element.innerHTML = `
      <svg viewBox="0 0 150 150" width="100%" height="100%">
        <text x="75" y="75" text-anchor="middle" fill="red" font-size="12">
          Error loading piece
        </text>
      </svg>
    `;
  }
  
  /**
   * Set an option and update the piece
   * @param {string} option - The option to set
   * @param {any} value - The value to set
   */
  setOption(option, value) {
    if (this.options[option] === value) {
      return;
    }
    
    this.options[option] = value;
    
    if (option === 'size') {
      this.element.style.width = `${value}px`;
      this.element.style.height = `${value}px`;
    } else {
      this.renderPiece();
    }
  }
  
  /**
   * Export the piece as SVG
   * @returns {Promise<string>} - A promise that resolves to the SVG content
   */
  exportSVG() {
    return new Promise((resolve, reject) => {
      const img = this.element.querySelector('img');
      if (!img) {
        reject(new Error('No image found'));
        return;
      }
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', img.src, true);
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          // Parse the SVG content
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
          const svgElement = svgDoc.documentElement;
          
          // Set the dimensions
          svgElement.setAttribute('width', this.options.size);
          svgElement.setAttribute('height', this.options.size);
          
          // Convert to string
          const serializer = new XMLSerializer();
          resolve(serializer.serializeToString(svgElement));
        } else {
          reject(new Error(`Failed to load SVG: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error while loading SVG'));
      };
      
      xhr.send();
    });
  }
  
  /**
   * Export the piece as PNG
   * @param {Function} callback - The callback to call with the PNG data URL
   * @param {number} scale - The scale factor for the PNG
   */
  exportAsPNG(callback, scale = 2) {
    const img = this.element.querySelector('img');
    if (!img) {
      callback('');
      return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = this.options.size * scale;
    canvas.height = this.options.size * scale;
    
    const ctx = canvas.getContext('2d');
    
    // Create a new image to draw on the canvas
    const newImg = new Image();
    newImg.crossOrigin = 'Anonymous';
    
    newImg.onload = () => {
      ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      callback(dataUrl);
    };
    
    newImg.onerror = () => {
      console.error('Error loading image for PNG export');
      callback('');
    };
    
    newImg.src = img.src;
  }
}

class ChessBoard {
  /**
   * Constructor for the ChessBoard class
   * @param {HTMLElement} element - The element to render the board in
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      boardSize: options.boardSize || 8,
      squareSize: options.squareSize || 60,
      lightSquareColor: options.lightSquareColor || '#F0D9B5',
      darkSquareColor: options.darkSquareColor || '#B58863',
      ...options
    };
    
    this.pieces = [];
    this.squares = [];
    
    this.init();
  }
  
  /**
   * Initialize the board
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set up the grid
    this.element.style.display = 'grid';
    this.element.style.gridTemplateColumns = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.element.style.gridTemplateRows = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.element.style.width = `${this.options.boardSize * this.options.squareSize}px`;
    this.element.style.height = `${this.options.boardSize * this.options.squareSize}px`;
    
    // Create the squares
    this.createSquares();
  }
  
  /**
   * Create the squares for the board
   */
  createSquares() {
    this.squares = [];
    
    for (let row = 0; row < this.options.boardSize; row++) {
      this.squares[row] = [];
      
      for (let col = 0; col < this.options.boardSize; col++) {
        const isLight = (row + col) % 2 === 0;
        const square = document.createElement('div');
        
        square.className = isLight ? 'light-square' : 'dark-square';
        square.style.backgroundColor = isLight ? this.options.lightSquareColor : this.options.darkSquareColor;
        square.style.width = `${this.options.squareSize}px`;
        square.style.height = `${this.options.squareSize}px`;
        
        this.element.appendChild(square);
        this.squares[row][col] = square;
      }
    }
  }
  
  /**
   * Update the board colors
   * @param {string} lightColor - The color for light squares
   * @param {string} darkColor - The color for dark squares
   */
  updateBoardColors(lightColor, darkColor) {
    this.options.lightSquareColor = lightColor;
    this.options.darkSquareColor = darkColor;
    
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const isLight = (row + col) % 2 === 0;
        this.squares[row][col].style.backgroundColor = isLight ? lightColor : darkColor;
      }
    }
    
    return true;
  }
  
  /**
   * Add a piece to the board
   * @param {string} type - The type of piece
   * @param {string} color - The color of the piece
   * @param {number} row - The row to place the piece
   * @param {number} col - The column to place the piece
   */
  addPiece(type, color, row, col) {
    if (row < 0 || row >= this.options.boardSize || col < 0 || col >= this.options.boardSize) {
      return null;
    }
    
    const square = this.squares[row][col];
    const pieceElement = document.createElement('div');
    
    // Create the piece
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const piece = new ChessPiece(svgElement, {
      pieceType: type,
      pieceColor: color,
      size: this.options.squareSize * 0.8
    });
    
    // Add the piece to the square
    pieceElement.appendChild(svgElement);
    square.appendChild(pieceElement);
    
    // Add to the pieces array
    this.pieces.push({
      type,
      color,
      row,
      col,
      element: pieceElement,
      piece
    });
    
    return piece;
  }
  
  /**
   * Remove a piece from the board
   * @param {number} row - The row of the piece
   * @param {number} col - The column of the piece
   */
  removePiece(row, col) {
    const pieceIndex = this.pieces.findIndex(p => p.row === row && p.col === col);
    
    if (pieceIndex === -1) {
      return false;
    }
    
    const piece = this.pieces[pieceIndex];
    const square = this.squares[row][col];
    
    square.removeChild(piece.element);
    this.pieces.splice(pieceIndex, 1);
    
    return true;
  }
  
  /**
   * Clear the board of all pieces
   */
  clearBoard() {
    this.pieces.forEach(piece => {
      if (piece.element.parentNode) {
        piece.element.parentNode.removeChild(piece.element);
      }
    });
    
    this.pieces = [];
    return true;
  }
  
  /**
   * Set up the initial position
   */
  setupInitialPosition() {
    this.clearBoard();
    
    // Add pawns
    for (let col = 0; col < this.options.boardSize; col++) {
      this.addPiece('pawn', 'white', 6, col);
      this.addPiece('pawn', 'black', 1, col);
    }
    
    // Add other pieces
    const backRowPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    for (let col = 0; col < Math.min(this.options.boardSize, backRowPieces.length); col++) {
      this.addPiece(backRowPieces[col], 'white', 7, col);
      this.addPiece(backRowPieces[col], 'black', 0, col);
    }
    
    return true;
  }
  
  /**
   * Update the colors of all pieces
   * @param {string} whitePieceColor - The color for white pieces
   * @param {string} whitePieceBorder - The border color for white pieces
   * @param {string} blackPieceColor - The color for black pieces
   * @param {string} blackPieceBorder - The border color for black pieces
   */
  updatePieceColors(whitePieceColor, whitePieceBorder, blackPieceColor, blackPieceBorder) {
    this.options.whitePieceColor = whitePieceColor;
    this.options.whitePieceBorder = whitePieceBorder;
    this.options.blackPieceColor = blackPieceColor;
    this.options.blackPieceBorder = blackPieceBorder;
    
    this.pieces.forEach(pieceInfo => {
      if (pieceInfo.color === 'white') {
        pieceInfo.piece.setOptions({
          pieceColorValue: whitePieceColor,
          borderColorValue: whitePieceBorder
        });
      } else {
        pieceInfo.piece.setOptions({
          pieceColorValue: blackPieceColor,
          borderColorValue: blackPieceBorder
        });
      }
    });
    
    return true;
  }
  
  /**
   * Update the style of all pieces
   * @param {string} style - The style to set
   */
  updatePieceStyle(style) {
    this.options.style = style;
    
    this.pieces.forEach(pieceInfo => {
      pieceInfo.piece.setOption('style', style);
    });
    
    return true;
  }
  
  /**
   * Toggle 3D effect for all pieces
   * @param {boolean} enabled - Whether to enable 3D effect
   */
  toggle3DEffect(enabled) {
    this.options.is3D = enabled;
    
    this.pieces.forEach(pieceInfo => {
      pieceInfo.piece.set3DEffect(enabled);
    });
    
    return true;
  }
  
  /**
   * Toggle glow effect for all pieces
   * @param {boolean} enabled - Whether to enable glow effect
   */
  toggleGlowEffect(enabled) {
    this.options.glowEnabled = enabled;
    
    this.pieces.forEach(pieceInfo => {
      pieceInfo.piece.setGlowEffect(enabled);
    });
    
    return true;
  }
  
  /**
   * Toggle shadow effect for all pieces
   * @param {boolean} enabled - Whether to enable shadow effect
   */
  toggleShadowEffect(enabled) {
    this.options.shadowEnabled = enabled;
    
    this.pieces.forEach(pieceInfo => {
      pieceInfo.piece.setShadowEffect(enabled);
    });
    
    return true;
  }
  
  /**
   * Export the board as SVG
   * @returns {string} - The SVG content
   */
  exportSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.element.style.width);
    svg.setAttribute('height', this.element.style.height);
    svg.setAttribute('viewBox', `0 0 ${this.options.boardSize * this.options.squareSize} ${this.options.boardSize * this.options.squareSize}`);
    
    // Add the squares
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const isLight = (row + col) % 2 === 0;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        rect.setAttribute('x', col * this.options.squareSize);
        rect.setAttribute('y', row * this.options.squareSize);
        rect.setAttribute('width', this.options.squareSize);
        rect.setAttribute('height', this.options.squareSize);
        rect.setAttribute('fill', isLight ? this.options.lightSquareColor : this.options.darkSquareColor);
        
        svg.appendChild(rect);
      }
    }
    
    // Add the pieces
    // (In a real implementation, we would add the pieces to the SVG)
    
    // Convert to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  }
  
  /**
   * Export the board as PNG
   * @returns {Promise<string>} - A promise that resolves to the PNG data URL
   */
  exportPNG() {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = this.options.boardSize * this.options.squareSize;
        canvas.height = this.options.boardSize * this.options.squareSize;
        
        const ctx = canvas.getContext('2d');
        
        // Draw the squares
        for (let row = 0; row < this.options.boardSize; row++) {
          for (let col = 0; col < this.options.boardSize; col++) {
            const isLight = (row + col) % 2 === 0;
            
            ctx.fillStyle = isLight ? this.options.lightSquareColor : this.options.darkSquareColor;
            ctx.fillRect(
              col * this.options.squareSize,
              row * this.options.squareSize,
              this.options.squareSize,
              this.options.squareSize
            );
          }
        }
        
        // Draw the pieces
        // (In a real implementation, we would draw the pieces on the canvas)
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Export the classes
module.exports = {
  ChessPiece,
  ChessBoard
};
