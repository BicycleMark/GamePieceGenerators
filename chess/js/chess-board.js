/**
 * Chess Board class for rendering a chess board with pieces
 */
class ChessBoard {
  /**
   * Create a new chess board
   * @param {HTMLElement} container - Container element for the board
   * @param {Object} options - Options for the board
   */
  constructor(container, options = {}) {
    this.container = container;
    
    // Default options
    this.defaultOptions = {
      boardSize: 8,
      squareSize: 60,
      lightSquareColor: '#F0D9B5',
      darkSquareColor: '#B58863',
      theme: 'dark',
      showCoordinates: false
    };
    
    // Merge provided options with defaults
    this.options = { ...this.defaultOptions, ...options };
    
    // Initialize the board
    this.init();
  }
  
  /**
   * Initialize the board
   */
  init() {
    // Clear the container
    this.container.innerHTML = '';
    
    // Create the board element
    this.boardElement = document.createElement('div');
    this.boardElement.className = 'chess-board-grid';
    this.boardElement.style.display = 'grid';
    this.boardElement.style.gridTemplateColumns = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.boardElement.style.gridTemplateRows = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.boardElement.style.width = `${this.options.boardSize * this.options.squareSize}px`;
    this.boardElement.style.height = `${this.options.boardSize * this.options.squareSize}px`;
    this.boardElement.style.border = '1px solid #333';
    this.boardElement.style.margin = '0 auto';
    
    // Create the squares
    this.squares = [];
    for (let row = 0; row < this.options.boardSize; row++) {
      this.squares[row] = [];
      for (let col = 0; col < this.options.boardSize; col++) {
        const square = document.createElement('div');
        square.className = 'chess-square';
        square.dataset.row = row;
        square.dataset.col = col;
        
        // Set square color
        const isLight = (row + col) % 2 === 0;
        square.style.backgroundColor = isLight ? this.options.lightSquareColor : this.options.darkSquareColor;
        
        // Add coordinates if enabled
        if (this.options.showCoordinates) {
          if (row === 7) {
            // Add column labels (a-h) at the bottom
            const colLabel = document.createElement('div');
            colLabel.className = 'coordinate-label';
            colLabel.textContent = String.fromCharCode(97 + col); // 'a' is 97 in ASCII
            colLabel.style.position = 'absolute';
            colLabel.style.bottom = '2px';
            colLabel.style.right = '2px';
            colLabel.style.fontSize = '10px';
            colLabel.style.color = isLight ? '#B58863' : '#F0D9B5';
            square.appendChild(colLabel);
          }
          
          if (col === 0) {
            // Add row labels (1-8) on the left
            const rowLabel = document.createElement('div');
            rowLabel.className = 'coordinate-label';
            rowLabel.textContent = 8 - row;
            rowLabel.style.position = 'absolute';
            rowLabel.style.top = '2px';
            rowLabel.style.left = '2px';
            rowLabel.style.fontSize = '10px';
            rowLabel.style.color = isLight ? '#B58863' : '#F0D9B5';
            square.appendChild(rowLabel);
          }
        }
        
        // Make the square position relative for centering pieces
        square.style.position = 'relative';
        
        // Add to board
        this.boardElement.appendChild(square);
        this.squares[row][col] = square;
      }
    }
    
    // Add board to container
    this.container.appendChild(this.boardElement);
    
    // Initialize pieces array
    this.pieces = [];
    
    // Set up the initial position
    this.setupInitialPosition();
  }
  
  /**
   * Set up the initial position of the chess pieces
   */
  setupInitialPosition() {
    // Clear the board
    this.clearBoard();
    
    // Set up pawns
    for (let col = 0; col < this.options.boardSize; col++) {
      this.addPiece('pawn', 'white', 6, col);
      this.addPiece('pawn', 'black', 1, col);
    }
    
    // Set up other pieces
    const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let col = 0; col < Math.min(this.options.boardSize, pieceOrder.length); col++) {
      this.addPiece(pieceOrder[col], 'white', 7, col);
      this.addPiece(pieceOrder[col], 'black', 0, col);
    }
  }
  
  /**
   * Add a piece to the board
   * @param {string} type - Type of piece (pawn, rook, knight, bishop, queen, king)
   * @param {string} color - Color of piece (white, black)
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {Object} The piece object
   */
  addPiece(type, color, row, col) {
    // Check if the position is valid
    if (row < 0 || row >= this.options.boardSize || col < 0 || col >= this.options.boardSize) {
      console.error(`Invalid position: ${row}, ${col}`);
      return null;
    }
    
    // Get the square element
    const square = this.squares[row][col];
    
    // Determine the folder based on theme and color
    // For dark theme: white pieces are from white-theme, black pieces are from dark-theme
    // For light theme: white pieces are from dark-theme, black pieces are from white-theme
    let folder;
    if (this.options.theme === 'dark') {
      folder = color === 'white' ? 'white-theme' : 'dark-theme';
    } else {
      folder = color === 'white' ? 'dark-theme' : 'white-theme';
    }
    
    // Create img element for the piece
    const img = document.createElement('img');
    img.src = `../chess/samples/${folder}/${type}.svg`;
    img.className = 'chess-piece';
    img.alt = `${color} ${type}`;
    
    // Style the piece
    img.style.position = 'absolute';
    img.style.left = '50%';
    img.style.top = '50%';
    img.style.transform = 'translate(-50%, -50%)';
    img.style.width = '80%';
    img.style.height = '80%';
    
    // Add error handling
    img.onerror = () => {
      console.error(`Failed to load piece: ${color} ${type}`);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <rect width="100" height="100" fill="none" stroke="red" stroke-width="2" />
          <line x1="10" y1="10" x2="90" y2="90" stroke="red" stroke-width="2" />
          <line x1="90" y1="10" x2="10" y2="90" stroke="red" stroke-width="2" />
        </svg>
      `);
    };
    
    // Add the piece to the square
    square.appendChild(img);
    
    // Store the piece info
    const pieceInfo = { type, color, row, col, element: img };
    this.pieces.push(pieceInfo);
    
    return pieceInfo;
  }
  
  /**
   * Clear the board of all pieces
   */
  clearBoard() {
    // Remove all piece elements
    this.pieces.forEach(pieceInfo => {
      if (pieceInfo && pieceInfo.element && pieceInfo.element.parentNode) {
        pieceInfo.element.parentNode.removeChild(pieceInfo.element);
      }
    });
    
    // Clear the pieces array
    this.pieces = [];
  }
  
  /**
   * Update the board colors
   * @param {string} lightSquareColor - Color for light squares
   * @param {string} darkSquareColor - Color for dark squares
   */
  updateBoardColors(lightSquareColor, darkSquareColor) {
    this.options.lightSquareColor = lightSquareColor;
    this.options.darkSquareColor = darkSquareColor;
    
    // Update square colors
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const square = this.squares[row][col];
        const isLight = (row + col) % 2 === 0;
        square.style.backgroundColor = isLight ? lightSquareColor : darkSquareColor;
        
        // Update coordinate labels color if they exist
        if (this.options.showCoordinates) {
          const label = square.querySelector('.coordinate-label');
          if (label) {
            label.style.color = isLight ? darkSquareColor : lightSquareColor;
          }
        }
      }
    }
  }
  
  /**
   * Update the theme
   * @param {string} theme - Theme name ('dark' or 'light')
   */
  updateTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
      console.error(`Invalid theme: ${theme}`);
      return;
    }
    
    this.options.theme = theme;
    
    // Rebuild the board with the new theme
    this.init();
  }
  
  /**
   * Export the board as an SVG string
   * @returns {string} SVG string
   */
  exportSVG() {
    // Create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', `0 0 ${this.options.boardSize * 100} ${this.options.boardSize * 100}`);
    svg.setAttribute('width', `${this.options.boardSize * this.options.squareSize}`);
    svg.setAttribute('height', `${this.options.boardSize * this.options.squareSize}`);
    
    // Create the board squares
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const isLight = (row + col) % 2 === 0;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', col * 100);
        rect.setAttribute('y', row * 100);
        rect.setAttribute('width', 100);
        rect.setAttribute('height', 100);
        rect.setAttribute('fill', isLight ? this.options.lightSquareColor : this.options.darkSquareColor);
        svg.appendChild(rect);
        
        // Add coordinates if enabled
        if (this.options.showCoordinates) {
          if (row === 7) {
            // Add column labels (a-h) at the bottom
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', col * 100 + 90);
            text.setAttribute('y', row * 100 + 95);
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', isLight ? this.options.darkSquareColor : this.options.lightSquareColor);
            text.textContent = String.fromCharCode(97 + col); // 'a' is 97 in ASCII
            svg.appendChild(text);
          }
          
          if (col === 0) {
            // Add row labels (1-8) on the left
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', 5);
            text.setAttribute('y', row * 100 + 15);
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', isLight ? this.options.darkSquareColor : this.options.lightSquareColor);
            text.textContent = 8 - row;
            svg.appendChild(text);
          }
        }
      }
    }
    
    // Add the pieces using simplified SVG shapes
    for (const pieceInfo of this.pieces) {
      if (pieceInfo) {
        // Create a group for the piece
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${pieceInfo.col * 100}, ${pieceInfo.row * 100})`);
        
        // Determine piece color based on theme and piece color
        let fillColor, strokeColor;
        if (this.options.theme === 'dark') {
          // Dark theme: white pieces are white, black pieces are black
          fillColor = pieceInfo.color === 'white' ? '#FFFFFF' : '#000000';
          strokeColor = pieceInfo.color === 'white' ? '#CCCCCC' : '#333333';
        } else {
          // Light theme: white pieces are black, black pieces are white
          fillColor = pieceInfo.color === 'white' ? '#000000' : '#FFFFFF';
          strokeColor = pieceInfo.color === 'white' ? '#333333' : '#CCCCCC';
        }
        
        // Create a simplified representation of the piece based on its type
        switch (pieceInfo.type) {
          case 'pawn':
            // Simple pawn shape
            const pawnPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pawnPath.setAttribute('d', 'M 50,20 C 45,20 40,25 40,35 C 40,45 45,50 30,60 C 30,60 70,60 70,60 C 55,50 60,45 60,35 C 60,25 55,20 50,20 z M 30,65 L 30,75 L 70,75 L 70,65 z');
            pawnPath.setAttribute('fill', fillColor);
            pawnPath.setAttribute('stroke', strokeColor);
            pawnPath.setAttribute('stroke-width', '2');
            g.appendChild(pawnPath);
            break;
            
          case 'rook':
            // Simple rook shape
            const rookPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            rookPath.setAttribute('d', 'M 30,25 L 30,35 L 40,35 L 40,25 L 50,25 L 50,35 L 60,35 L 60,25 L 70,25 L 70,35 L 75,35 L 75,50 L 65,50 L 65,75 L 35,75 L 35,50 L 25,50 L 25,35 L 30,35 z');
            rookPath.setAttribute('fill', fillColor);
            rookPath.setAttribute('stroke', strokeColor);
            rookPath.setAttribute('stroke-width', '2');
            g.appendChild(rookPath);
            break;
            
          case 'knight':
            // Simple knight shape
            const knightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            knightPath.setAttribute('d', 'M 30,25 C 35,25 40,20 45,20 C 60,20 60,35 60,35 C 60,40 55,45 55,45 L 75,65 L 75,75 L 30,75 C 30,75 30,55 30,55 C 30,55 20,45 20,35 C 20,25 25,25 30,25 z');
            knightPath.setAttribute('fill', fillColor);
            knightPath.setAttribute('stroke', strokeColor);
            knightPath.setAttribute('stroke-width', '2');
            g.appendChild(knightPath);
            break;
            
          case 'bishop':
            // Simple bishop shape
            const bishopPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            bishopPath.setAttribute('d', 'M 50,20 C 40,20 40,35 40,35 C 40,40 45,45 45,45 L 35,65 L 65,65 L 55,45 C 55,45 60,40 60,35 C 60,35 60,20 50,20 z M 35,70 L 35,75 L 65,75 L 65,70 z');
            bishopPath.setAttribute('fill', fillColor);
            bishopPath.setAttribute('stroke', strokeColor);
            bishopPath.setAttribute('stroke-width', '2');
            g.appendChild(bishopPath);
            break;
            
          case 'queen':
            // Simple queen shape
            const queenPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            queenPath.setAttribute('d', 'M 30,30 L 40,50 L 50,30 L 60,50 L 70,30 L 75,55 L 65,65 L 35,65 L 25,55 z M 35,70 L 35,75 L 65,75 L 65,70 z');
            queenPath.setAttribute('fill', fillColor);
            queenPath.setAttribute('stroke', strokeColor);
            queenPath.setAttribute('stroke-width', '2');
            g.appendChild(queenPath);
            break;
            
          case 'king':
            // Simple king shape
            const kingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            kingPath.setAttribute('d', 'M 50,15 L 50,25 L 40,25 L 40,35 L 50,35 L 50,45 L 60,45 L 60,35 L 70,35 L 70,25 L 60,25 L 60,15 z M 30,50 L 30,65 L 70,65 L 70,50 z M 35,70 L 35,75 L 65,75 L 65,70 z');
            kingPath.setAttribute('fill', fillColor);
            kingPath.setAttribute('stroke', strokeColor);
            kingPath.setAttribute('stroke-width', '2');
            g.appendChild(kingPath);
            break;
        }
        
        // Add the group to the SVG
        svg.appendChild(g);
      }
    }
    
    // Convert to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  }
}
