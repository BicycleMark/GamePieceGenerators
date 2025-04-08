/**
 * CheckerPiece - A class to create and manage checker pieces
 */
class CheckerPiece {
  /**
   * Constructor for the CheckerPiece class
   * @param {HTMLElement} element - The SVG element to render the piece in
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      pieceColor: options.pieceColor || '#e74c3c', // Default red
      borderColor: options.borderColor || '#c0392b',
      crownColor: options.crownColor || '#f1c40f',
      crownBorderColor: options.crownBorderColor || '#d4ac0d',
      size: options.size || 80,
      borderWidth: options.borderWidth || 3,
      is3D: options.is3D !== undefined ? options.is3D : true,
      isCrowned: options.isCrowned || false,
      crownStyle: options.crownStyle || 'classic', // classic, star, symbol
      glowEnabled: options.glowEnabled !== undefined ? options.glowEnabled : false,
      glowColor: options.glowColor || 'rgba(255, 255, 255, 0.7)',
      glowSize: options.glowSize || 10,
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
    
    // Set the viewBox and dimensions
    this.element.setAttribute('viewBox', `0 0 100 100`);
    this.element.style.width = `${this.options.size}px`;
    this.element.style.height = `${this.options.size}px`;
    
    // Add the defs section with filter for glow effect
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="${this.options.glowSize / 2}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="piece-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(0,0,0,0.2);stop-opacity:1" />
      </linearGradient>
    `;
    this.element.appendChild(defs);
    
    // Create the piece
    this.createPiece();
    
    // Apply initial styling
    this.updateStyles();
    
    // Add crown if needed
    if (this.options.isCrowned) {
      this.addCrown();
    }
    
    // Apply glow if enabled
    this.setGlowEffect(this.options.glowEnabled);
  }
  
  /**
   * Create the SVG elements for the checker piece
   */
  createPiece() {
    // Main circle for the piece
    const piece = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    piece.setAttribute('class', 'piece-circle');
    piece.setAttribute('cx', '50');
    piece.setAttribute('cy', '50');
    piece.setAttribute('r', '45');
    this.element.appendChild(piece);
    
    // Border circle
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    border.setAttribute('class', 'piece-border');
    border.setAttribute('cx', '50');
    border.setAttribute('cy', '50');
    border.setAttribute('r', '45');
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke-width', this.options.borderWidth);
    this.element.appendChild(border);
    
    if (this.options.is3D) {
      // Add 3D effect with gradient overlay
      const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      highlight.setAttribute('class', 'piece-highlight');
      highlight.setAttribute('cx', '50');
      highlight.setAttribute('cy', '50');
      highlight.setAttribute('r', '45');
      highlight.setAttribute('fill', 'url(#piece-gradient)');
      this.element.appendChild(highlight);
    }
  }
  
  /**
   * Add a crown to the piece
   */
  addCrown() {
    // Remove any existing crown
    const existingCrown = this.element.querySelector('.piece-crown');
    if (existingCrown) {
      this.element.removeChild(existingCrown);
    }
    
    const crownGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    crownGroup.setAttribute('class', 'piece-crown');
    
    switch (this.options.crownStyle) {
      case 'classic':
        this.createClassicCrown(crownGroup);
        break;
      case 'star':
        this.createStarCrown(crownGroup);
        break;
      case 'symbol':
        this.createSymbolCrown(crownGroup);
        break;
      default:
        this.createClassicCrown(crownGroup);
    }
    
    this.element.appendChild(crownGroup);
  }
  
  /**
   * Create a classic crown design
   * @param {SVGElement} group - The group element to add the crown to
   */
  createClassicCrown(group) {
    const crown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    crown.setAttribute('d', 'M30,60 L35,40 L45,50 L50,35 L55,50 L65,40 L70,60 Z');
    crown.setAttribute('fill', this.options.crownColor);
    crown.setAttribute('stroke', this.options.crownBorderColor);
    crown.setAttribute('stroke-width', '1.5');
    
    group.appendChild(crown);
  }
  
  /**
   * Create a star crown design
   * @param {SVGElement} group - The group element to add the crown to
   */
  createStarCrown(group) {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    star.setAttribute('points', '50,30 61,55 90,55 65,70 75,100 50,80 25,100 35,70 10,55 39,55');
    star.setAttribute('fill', this.options.crownColor);
    star.setAttribute('stroke', this.options.crownBorderColor);
    star.setAttribute('stroke-width', '1.5');
    star.setAttribute('transform', 'scale(0.5) translate(50, 30)');
    
    group.appendChild(star);
  }
  
  /**
   * Create a symbol crown (K letter)
   * @param {SVGElement} group - The group element to add the crown to
   */
  createSymbolCrown(group) {
    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    symbol.setAttribute('x', '50');
    symbol.setAttribute('y', '60');
    symbol.setAttribute('text-anchor', 'middle');
    symbol.setAttribute('dominant-baseline', 'middle');
    symbol.setAttribute('font-family', 'Arial, sans-serif');
    symbol.setAttribute('font-weight', 'bold');
    symbol.setAttribute('font-size', '30');
    symbol.setAttribute('fill', this.options.crownColor);
    symbol.setAttribute('stroke', this.options.crownBorderColor);
    symbol.setAttribute('stroke-width', '0.5');
    symbol.textContent = 'K';
    
    group.appendChild(symbol);
  }
  
  /**
   * Update the piece styles based on current options
   */
  updateStyles() {
    const pieceCircle = this.element.querySelector('.piece-circle');
    const pieceBorder = this.element.querySelector('.piece-border');
    
    if (pieceCircle) {
      pieceCircle.setAttribute('fill', this.options.pieceColor);
    }
    
    if (pieceBorder) {
      pieceBorder.setAttribute('stroke', this.options.borderColor);
      pieceBorder.setAttribute('stroke-width', this.options.borderWidth);
    }
    
    // Update crown if it exists
    const crown = this.element.querySelector('.piece-crown');
    if (crown) {
      const crownElement = crown.firstChild;
      if (crownElement) {
        if (crownElement.tagName === 'text') {
          crownElement.setAttribute('fill', this.options.crownColor);
          crownElement.setAttribute('stroke', this.options.crownBorderColor);
        } else {
          crownElement.setAttribute('fill', this.options.crownColor);
          crownElement.setAttribute('stroke', this.options.crownBorderColor);
        }
      }
    }
  }
  
  /**
   * Toggle the crowned state of the piece
   * @param {boolean} crowned - Whether the piece should be crowned
   */
  setCrowned(crowned) {
    this.options.isCrowned = crowned;
    
    if (crowned) {
      this.addCrown();
    } else {
      const crown = this.element.querySelector('.piece-crown');
      if (crown) {
        this.element.removeChild(crown);
      }
    }
    
    return this;
  }
  
  /**
   * Enable or disable the glow effect
   * @param {boolean} enabled - Whether the glow effect should be enabled
   */
  setGlowEffect(enabled) {
    this.options.glowEnabled = enabled;
    
    const pieceCircle = this.element.querySelector('.piece-circle');
    if (pieceCircle) {
      if (enabled) {
        pieceCircle.setAttribute('filter', 'url(#glow)');
      } else {
        pieceCircle.removeAttribute('filter');
      }
    }
    
    return this;
  }
  
  /**
   * Update a specific option and refresh the piece
   * @param {string} option - The option name to update
   * @param {any} value - The new value for the option
   */
  setOption(option, value) {
    this.options[option] = value;
    
    // Handle special cases
    if (option === 'isCrowned') {
      this.setCrowned(value);
    } else if (option === 'glowEnabled') {
      this.setGlowEffect(value);
    } else if (option === 'crownStyle' && this.options.isCrowned) {
      this.addCrown(); // Recreate crown with new style
    } else if (option === 'size') {
      this.element.style.width = `${value}px`;
      this.element.style.height = `${value}px`;
    } else {
      this.updateStyles();
    }
    
    return this;
  }
  
  /**
   * Export the current piece as an SVG string
   * @returns {string} - The SVG as a string
   */
  exportSVG() {
    // Clone the SVG to avoid modifying the original
    const svgClone = this.element.cloneNode(true);
    
    // Add XML declaration and doctype
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
    const doctype = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    
    // Add metadata with settings
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metadata.innerHTML = `
      <settings>
        <pieceColor>${this.options.pieceColor}</pieceColor>
        <borderColor>${this.options.borderColor}</borderColor>
        <crownColor>${this.options.crownColor}</crownColor>
        <crownBorderColor>${this.options.crownBorderColor}</crownBorderColor>
        <size>${this.options.size}</size>
        <borderWidth>${this.options.borderWidth}</borderWidth>
        <is3D>${this.options.is3D}</is3D>
        <isCrowned>${this.options.isCrowned}</isCrowned>
        <crownStyle>${this.options.crownStyle}</crownStyle>
        <glowEnabled>${this.options.glowEnabled}</glowEnabled>
        <glowColor>${this.options.glowColor}</glowColor>
        <glowSize>${this.options.glowSize}</glowSize>
      </settings>
    `;
    svgClone.appendChild(metadata);
    
    // Add embedded CSS
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      .piece-circle { fill: ${this.options.pieceColor}; }
      .piece-border { stroke: ${this.options.borderColor}; stroke-width: ${this.options.borderWidth}; }
      ${this.options.glowEnabled ? '.piece-circle { filter: url(#glow); }' : ''}
    `;
    svgClone.appendChild(style);
    
    // Serialize to string
    const svgString = new XMLSerializer().serializeToString(svgClone);
    
    // Return with XML declaration and doctype
    return `${xmlDeclaration}\n${doctype}\n${svgString}`;
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
   * Export the current piece as a PNG
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
      canvas.width = this.options.size * scale;
      canvas.height = this.options.size * scale;
      
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
   * Resize the piece
   * @param {number} size - New size in pixels
   */
  resize(size) {
    this.options.size = size;
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
    return this;
  }
}

/**
 * CheckerBoard - A class to create and manage a checker board
 */
class CheckerBoard {
  /**
   * Constructor for the CheckerBoard class
   * @param {HTMLElement} element - The container element for the board
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      boardSize: options.boardSize || 8, // 8x8 board
      lightSquareColor: options.lightSquareColor || '#f5deb3',
      darkSquareColor: options.darkSquareColor || '#8b4513',
      redPieceColor: options.redPieceColor || '#e74c3c',
      redPieceBorderColor: options.redPieceBorderColor || '#c0392b',
      blackPieceColor: options.blackPieceColor || '#2c3e50',
      blackPieceBorderColor: options.blackPieceBorderColor || '#1a2530',
      squareSize: options.squareSize || 90,
      pieceSize: options.pieceSize || 80,
      borderWidth: options.borderWidth || 3,
      is3D: options.is3D !== undefined ? options.is3D : true,
      ...options
    };
    
    this.pieces = [];
    this.init();
  }
  
  /**
   * Initialize the board
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set up the board grid
    this.element.style.display = 'grid';
    this.element.style.gridTemplateColumns = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.element.style.gridTemplateRows = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.element.style.gap = '0';
    this.element.style.border = '5px solid #5d4037';
    this.element.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    
    // Create the squares
    this.createSquares();
  }
  
  /**
   * Create the board squares
   */
  createSquares() {
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const square = document.createElement('div');
        square.className = 'board-square';
        square.dataset.row = row;
        square.dataset.col = col;
        
        // Determine if this is a light or dark square
        const isLightSquare = (row + col) % 2 === 0;
        square.classList.add(isLightSquare ? 'light-square' : 'dark-square');
        
        // Set the background color
        square.style.backgroundColor = isLightSquare ? 
          this.options.lightSquareColor : 
          this.options.darkSquareColor;
        
        // Add the square to the board
        this.element.appendChild(square);
      }
    }
  }
  
  /**
   * Add a piece to the board
   * @param {string} type - The type of piece ('red' or 'black')
   * @param {number} row - The row to place the piece (0-based)
   * @param {number} col - The column to place the piece (0-based)
   * @param {boolean} crowned - Whether the piece is crowned
   */
  addPiece(type, row, col, crowned = false) {
    // Find the square at the specified position
    const square = this.element.querySelector(`.board-square[data-row="${row}"][data-col="${col}"]`);
    if (!square) return null;
    
    // Create an SVG element for the piece
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    square.appendChild(svg);
    
    // Determine piece options based on type
    const pieceOptions = {
      pieceColor: type === 'red' ? this.options.redPieceColor : this.options.blackPieceColor,
      borderColor: type === 'red' ? this.options.redPieceBorderColor : this.options.blackPieceBorderColor,
      size: this.options.pieceSize,
      borderWidth: this.options.borderWidth,
      is3D: this.options.is3D,
      isCrowned: crowned
    };
    
    // Create the piece
    const piece = new CheckerPiece(svg, pieceOptions);
    
    // Store the piece reference
    this.pieces.push({
      piece,
      row,
      col,
      type
    });
    
    return piece;
  }
  
  /**
   * Remove a piece from the board
   * @param {number} row - The row of the piece to remove
   * @param {number} col - The column of the piece to remove
   */
  removePiece(row, col) {
    // Find the piece at the specified position
    const pieceIndex = this.pieces.findIndex(p => p.row === row && p.col === col);
    if (pieceIndex === -1) return false;
    
    // Find the square at the specified position
    const square = this.element.querySelector(`.board-square[data-row="${row}"][data-col="${col}"]`);
    if (!square) return false;
    
    // Remove the SVG element
    const svg = square.querySelector('svg');
    if (svg) {
      square.removeChild(svg);
    }
    
    // Remove the piece from the array
    this.pieces.splice(pieceIndex, 1);
    
    return true;
  }
  
  /**
   * Move a piece on the board
   * @param {number} fromRow - The current row of the piece
   * @param {number} fromCol - The current column of the piece
   * @param {number} toRow - The destination row
   * @param {number} toCol - The destination column
   */
  movePiece(fromRow, fromCol, toRow, toCol) {
    // Find the piece at the specified position
    const pieceIndex = this.pieces.findIndex(p => p.row === fromRow && p.col === fromCol);
    if (pieceIndex === -1) return false;
    
    const pieceInfo = this.pieces[pieceIndex];
    
    // Remove the piece from its current position
    this.removePiece(fromRow, fromCol);
    
    // Add the piece at the new position
    const newPiece = this.addPiece(pieceInfo.type, toRow, toCol, pieceInfo.piece.options.isCrowned);
    
    // Check if the piece should be crowned (reached the opposite end)
    if (!pieceInfo.piece.options.isCrowned) {
      if ((pieceInfo.type === 'red' && toRow === 0) || 
          (pieceInfo.type === 'black' && toRow === this.options.boardSize - 1)) {
        newPiece.setCrowned(true);
      }
    }
    
    return true;
  }
  
  /**
   * Set up the board with the initial piece configuration
   */
  setupInitialPosition() {
    // Clear any existing pieces
    this.pieces.forEach(p => {
      const square = this.element.querySelector(`.board-square[data-row="${p.row}"][data-col="${p.col}"]`);
      if (square) {
        const svg = square.querySelector('svg');
        if (svg) {
          square.removeChild(svg);
        }
      }
    });
    this.pieces = [];
    
    // Place black pieces in the top three rows
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        // Only place pieces on dark squares
        if ((row + col) % 2 === 1) {
          this.addPiece('black', row, col);
        }
      }
    }
    
    // Place red pieces in the bottom three rows
    for (let row = this.options.boardSize - 3; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        // Only place pieces on dark squares
        if ((row + col) % 2 === 1) {
          this.addPiece('red', row, col);
        }
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
    
    // Update the square colors
    const lightSquares = this.element.querySelectorAll('.light-square');
    const darkSquares = this.element.querySelectorAll('.dark-square');
    
    lightSquares.forEach(square => {
      square.style.backgroundColor = lightColor;
    });
    
    darkSquares.forEach(square => {
      square.style.backgroundColor = darkColor;
    });
  }
  
  /**
   * Update the piece colors
   * @param {string} redColor - The color for red pieces
   * @param {string} redBorder - The border color for red pieces
   * @param {string} blackColor - The color for black pieces
   * @param {string} blackBorder - The border color for black pieces
   */
  updatePieceColors(redColor, redBorder, blackColor, blackBorder) {
    this.options.redPieceColor = redColor;
    this.options.redPieceBorderColor = redBorder;
    this.options.blackPieceColor = blackColor;
    this.options.blackPieceBorderColor = blackBorder;
    
    // Update the piece colors
    this.pieces.forEach(p => {
      if (p.type === 'red') {
        p.piece.setOption('pieceColor', redColor);
        p.piece.setOption('borderColor', redBorder);
      } else {
        p.piece.setOption('pieceColor', blackColor);
        p.piece.setOption('borderColor', blackBorder);
      }
    });
  }
  
  /**
   * Export the board as an SVG string
   * @returns {string} - The SVG as a string
   */
  exportSVG() {
    // Create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.boardSize * this.options.squareSize);
    svg.setAttribute('height', this.options.boardSize * this.options.squareSize);
    svg.setAttribute('viewBox', `0 0 ${this.options.boardSize * this.options.squareSize} ${this.options.boardSize * this.options.squareSize}`);
    
    // Add the squares
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const isLightSquare = (row + col) % 2 === 0;
        const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        square.setAttribute('x', col * this.options.squareSize);
        square.setAttribute('y', row * this.options.squareSize);
        square.setAttribute('width', this.options.squareSize);
        square.setAttribute('height', this.options.squareSize);
        square.setAttribute('fill', isLightSquare ? this.options.lightSquareColor : this.options.darkSquareColor);
        svg.appendChild(square);
      }
    }
    
    // Add the pieces
    this.pieces.forEach(p => {
      const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      pieceGroup.setAttribute('transform', `translate(${p.col * this.options.squareSize + (this.options.squareSize - this.options.pieceSize) / 2}, ${p.row * this.options.squareSize + (this.options.squareSize - this.options.pieceSize) / 2})`);
      
      // Get the piece SVG content
      const pieceContent = p.piece.exportSVG();
      const parser = new DOMParser();
      const pieceDoc = parser.parseFromString(pieceContent, 'image/svg+xml');
      const pieceSvg = pieceDoc.documentElement;
      
      // Extract the piece elements and add them to the group
      Array.from(pieceSvg.children).forEach(child => {
        if (child.tagName !== 'metadata' && child.tagName !== 'style') {
          pieceGroup.appendChild(child.cloneNode(true));
        }
      });
      
      svg.appendChild(pieceGroup);
    });
    
    // Add XML declaration and doctype
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
    const doctype = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    
    // Serialize to string
    const svgString = new XMLSerializer().serializeToString(svg);
    
    // Return with XML declaration and doctype
    return `${xmlDeclaration}\n${doctype}\n${svgString}`;
  }
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CheckerPiece, CheckerBoard };
}
