/**
 * Chess Pieces Generator
 * Core classes for creating and manipulating chess pieces
 */

/**
 * ChessPiece class for rendering individual chess pieces
 */
class ChessPiece {
  /**
   * Create a new chess piece
   * @param {SVGElement} svgElement - SVG element to render the piece in
   * @param {Object} options - Options for the piece
   */
  constructor(svgElement, options = {}) {
    this.svgElement = svgElement;
    
    // Default options
    this.defaultOptions = {
      pieceType: 'pawn',
      pieceColor: 'white',
      pieceColorValue: '#FFFFFF',
      borderColorValue: '#CCCCCC',
      size: 80,
      borderWidth: 3,
      is3D: true,
      style: 'classic',
      glowEnabled: false,
      glowColor: '#4A90E2',
      glowSize: 5,
      shadowEnabled: false,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 5
    };
    
    // Merge provided options with defaults
    this.options = { ...this.defaultOptions, ...options };
    
    // Initialize the piece
    this.init();
  }
  
  /**
   * Initialize the piece
   */
  init() {
    // Set SVG element attributes
    this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svgElement.setAttribute('viewBox', '0 0 100 100');
    this.svgElement.setAttribute('width', `${this.options.size}px`);
    this.svgElement.setAttribute('height', `${this.options.size}px`);
    this.svgElement.setAttribute('aria-label', `${this.options.pieceColor} ${this.options.pieceType}`);
    
    // Clear any existing content
    this.svgElement.innerHTML = '';
    
    // Create defs for filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.svgElement.appendChild(defs);
    
    // Create glow filter if enabled
    if (this.options.glowEnabled) {
      this.createGlowFilter(defs);
    }
    
    // Create shadow filter if enabled
    if (this.options.shadowEnabled) {
      this.createShadowFilter(defs);
    }
    
    // Render the piece
    this.render();
  }
  
  /**
   * Create a glow filter
   * @param {SVGElement} defs - SVG defs element
   */
  createGlowFilter(defs) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', this.options.glowSize);
    feGaussianBlur.setAttribute('result', 'blur');
    
    const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    feFlood.setAttribute('flood-color', this.options.glowColor);
    feFlood.setAttribute('result', 'color');
    
    const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    feComposite.setAttribute('in', 'color');
    feComposite.setAttribute('in2', 'blur');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'glow');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'glow');
    
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feFlood);
    filter.appendChild(feComposite);
    filter.appendChild(feMerge);
    
    defs.appendChild(filter);
  }
  
  /**
   * Create a shadow filter
   * @param {SVGElement} defs - SVG defs element
   */
  createShadowFilter(defs) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', this.options.shadowBlur);
    feGaussianBlur.setAttribute('result', 'blur');
    
    const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '0');
    feOffset.setAttribute('dy', this.options.shadowBlur / 2);
    feOffset.setAttribute('result', 'offsetBlur');
    
    const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    feFlood.setAttribute('flood-color', this.options.shadowColor);
    feFlood.setAttribute('result', 'color');
    
    const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    feComposite.setAttribute('in', 'color');
    feComposite.setAttribute('in2', 'offsetBlur');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'shadow');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'shadow');
    
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feOffset);
    filter.appendChild(feFlood);
    filter.appendChild(feComposite);
    filter.appendChild(feMerge);
    
    defs.appendChild(filter);
  }
  
  /**
   * Render the piece based on type and color
   */
  render() {
    // Get the piece path data
    const pathData = this.getPiecePathData();
    
    // Create the piece elements
    pathData.forEach(data => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', data.d);
      path.setAttribute('fill', data.fill || this.options.pieceColorValue);
      path.setAttribute('stroke', data.stroke || this.options.borderColorValue);
      path.setAttribute('stroke-width', data.strokeWidth || this.options.borderWidth);
      
      // Apply style modifiers
      if (this.options.style === 'modern') {
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-linecap', 'round');
      } else if (this.options.style === 'minimalist') {
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('fill-opacity', '0.9');
      }
      
      // Apply filters
      if (this.options.glowEnabled) {
        path.setAttribute('filter', 'url(#glow)');
      } else if (this.options.shadowEnabled) {
        path.setAttribute('filter', 'url(#shadow)');
      }
      
      // Apply 3D effect
      if (this.options.is3D && data.fill !== 'none') {
        // Create a linear gradient for 3D effect
        const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`;
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', this.lightenColor(data.fill || this.options.pieceColorValue, 30));
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', this.darkenColor(data.fill || this.options.pieceColorValue, 20));
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        
        const defs = this.svgElement.querySelector('defs');
        defs.appendChild(gradient);
        
        path.setAttribute('fill', `url(#${gradientId})`);
      }
      
      this.svgElement.appendChild(path);
    });
  }
  
  /**
   * Get path data for the piece based on type and color
   * @returns {Array} Array of path data objects
   */
  getPiecePathData() {
    const { pieceType, pieceColor } = this.options;
    
    // Path data for different piece types
    const pathData = {
      pawn: {
        white: [
          {
            d: 'M50,25 C42,25 35,32 35,40 C35,45 38,49 42,52 C38,54 35,58 35,63 L35,75 L65,75 L65,63 C65,58 62,54 58,52 C62,49 65,45 65,40 C65,32 58,25 50,25 Z'
          }
        ],
        black: [
          {
            d: 'M50,25 C42,25 35,32 35,40 C35,45 38,49 42,52 C38,54 35,58 35,63 L35,75 L65,75 L65,63 C65,58 62,54 58,52 C62,49 65,45 65,40 C65,32 58,25 50,25 Z'
          }
        ]
      },
      rook: {
        white: [
          {
            d: 'M35,25 L35,35 L40,35 L40,30 L45,30 L45,35 L55,35 L55,30 L60,30 L60,35 L65,35 L65,25 L35,25 Z M35,40 L35,75 L65,75 L65,40 L35,40 Z'
          }
        ],
        black: [
          {
            d: 'M35,25 L35,35 L40,35 L40,30 L45,30 L45,35 L55,35 L55,30 L60,30 L60,35 L65,35 L65,25 L35,25 Z M35,40 L35,75 L65,75 L65,40 L35,40 Z'
          }
        ]
      },
      knight: {
        white: [
          {
            d: 'M35,75 L65,75 L65,60 C65,55 60,50 55,50 L60,35 C60,30 55,25 50,25 C45,25 40,30 40,35 L40,40 C40,45 35,50 30,50 L35,75 Z'
          },
          {
            d: 'M45,35 C45,35 50,30 55,35 C60,40 55,45 55,45',
            fill: 'none'
          },
          {
            d: 'M40,40 C40,40 45,35 50,40',
            fill: 'none'
          }
        ],
        black: [
          {
            d: 'M35,75 L65,75 L65,60 C65,55 60,50 55,50 L60,35 C60,30 55,25 50,25 C45,25 40,30 40,35 L40,40 C40,45 35,50 30,50 L35,75 Z'
          },
          {
            d: 'M45,35 C45,35 50,30 55,35 C60,40 55,45 55,45',
            fill: 'none'
          },
          {
            d: 'M40,40 C40,40 45,35 50,40',
            fill: 'none'
          }
        ]
      },
      bishop: {
        white: [
          {
            d: 'M50,25 C45,25 40,30 40,35 C40,40 45,45 50,45 C55,45 60,40 60,35 C60,30 55,25 50,25 Z M45,50 L40,75 L60,75 L55,50 C55,50 52,55 50,55 C48,55 45,50 45,50 Z'
          },
          {
            d: 'M50,30 L50,35 M45,40 L55,40',
            fill: 'none'
          }
        ],
        black: [
          {
            d: 'M50,25 C45,25 40,30 40,35 C40,40 45,45 50,45 C55,45 60,40 60,35 C60,30 55,25 50,25 Z M45,50 L40,75 L60,75 L55,50 C55,50 52,55 50,55 C48,55 45,50 45,50 Z'
          },
          {
            d: 'M50,30 L50,35 M45,40 L55,40',
            fill: 'none'
          }
        ]
      },
      queen: {
        white: [
          {
            d: 'M50,25 C47,25 45,27 45,30 C45,33 47,35 50,35 C53,35 55,33 55,30 C55,27 53,25 50,25 Z M35,40 L40,75 L60,75 L65,40 L35,40 Z M35,40 C35,40 40,50 50,50 C60,50 65,40 65,40 Z'
          },
          {
            d: 'M40,45 L40,55 M50,45 L50,55 M60,45 L60,55',
            fill: 'none'
          }
        ],
        black: [
          {
            d: 'M50,25 C47,25 45,27 45,30 C45,33 47,35 50,35 C53,35 55,33 55,30 C55,27 53,25 50,25 Z M35,40 L40,75 L60,75 L65,40 L35,40 Z M35,40 C35,40 40,50 50,50 C60,50 65,40 65,40 Z'
          },
          {
            d: 'M40,45 L40,55 M50,45 L50,55 M60,45 L60,55',
            fill: 'none'
          }
        ]
      },
      king: {
        white: [
          {
            d: 'M50,20 L50,30 M45,25 L55,25 M40,75 L60,75 L60,45 C60,45 65,40 60,35 C55,30 50,35 50,35 C50,35 45,30 40,35 C35,40 40,45 40,45 L40,75 Z'
          },
          {
            d: 'M45,55 L55,55 M45,65 L55,65',
            fill: 'none'
          }
        ],
        black: [
          {
            d: 'M50,20 L50,30 M45,25 L55,25 M40,75 L60,75 L60,45 C60,45 65,40 60,35 C55,30 50,35 50,35 C50,35 45,30 40,35 C35,40 40,45 40,45 L40,75 Z'
          },
          {
            d: 'M45,55 L55,55 M45,65 L55,65',
            fill: 'none'
          }
        ]
      }
    };
    
    return pathData[pieceType]?.[pieceColor] || [];
  }
  
  /**
   * Lighten a color by a percentage
   * @param {string} color - Hex color code
   * @param {number} percent - Percentage to lighten
   * @returns {string} Lightened color
   */
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(0x1000000 + (R < 255 ? R : 255) * 0x10000 + (G < 255 ? G : 255) * 0x100 + (B < 255 ? B : 255)).toString(16).slice(1)}`;
  }
  
  /**
   * Darken a color by a percentage
   * @param {string} color - Hex color code
   * @param {number} percent - Percentage to darken
   * @returns {string} Darkened color
   */
  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return `#${(0x1000000 + (R > 0 ? R : 0) * 0x10000 + (G > 0 ? G : 0) * 0x100 + (B > 0 ? B : 0)).toString(16).slice(1)}`;
  }
  
  /**
   * Set a specific option
   * @param {string} name - Option name
   * @param {any} value - Option value
   */
  setOption(name, value) {
    if (this.options[name] !== undefined) {
      this.options[name] = value;
      this.init(); // Re-render with new options
      return true;
    }
    return false;
  }
  
  /**
   * Set multiple options at once
   * @param {Object} options - Options object
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
    this.init(); // Re-render with new options
    return true;
  }
  
  /**
   * Resize the piece
   * @param {number} size - New size in pixels
   */
  resize(size) {
    this.options.size = size;
    this.svgElement.setAttribute('width', `${size}px`);
    this.svgElement.setAttribute('height', `${size}px`);
    return true;
  }
  
  /**
   * Toggle the glow effect
   * @param {boolean} enabled - Whether glow is enabled
   */
  setGlowEffect(enabled) {
    this.options.glowEnabled = enabled;
    this.init(); // Re-render with new options
    return true;
  }
  
  /**
   * Toggle the shadow effect
   * @param {boolean} enabled - Whether shadow is enabled
   */
  setShadowEffect(enabled) {
    this.options.shadowEnabled = enabled;
    this.init(); // Re-render with new options
    return true;
  }
  
  /**
   * Toggle the 3D effect
   * @param {boolean} enabled - Whether 3D effect is enabled
   */
  set3DEffect(enabled) {
    this.options.is3D = enabled;
    this.init(); // Re-render with new options
    return true;
  }
  
  /**
   * Export the piece as SVG
   * @returns {string} SVG string
   */
  exportSVG() {
    return this.svgElement.outerHTML;
  }
  
  /**
   * Export the piece as PNG
   * @param {number} scale - Scale factor for the PNG
   * @returns {Promise<string>} Promise resolving to a data URL
   */
  exportPNG(scale = 2) {
    return new Promise((resolve, reject) => {
      try {
        const svgString = this.exportSVG();
        const canvas = document.createElement('canvas');
        const size = this.options.size * scale;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (error) => {
          reject(error);
        };
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  }
}

/**
 * ChessBoard class for rendering a complete chess board
 */
class ChessBoard {
  /**
   * Create a new chess board
   * @param {HTMLElement} boardElement - Element to render the board in
   * @param {Object} options - Options for the board
   */
  constructor(boardElement, options = {}) {
    this.boardElement = boardElement;
    
    // Default options
    this.defaultOptions = {
      boardSize: 8,
      squareSize: 60,
      lightSquareColor: '#F0D9B5',
      darkSquareColor: '#B58863',
      whitePieceColor: '#FFFFFF',
      whitePieceBorder: '#CCCCCC',
      blackPieceColor: '#000000',
      blackPieceBorder: '#333333',
      pieceSize: 50,
      borderWidth: 2,
      is3D: true,
      style: 'classic',
      glowEnabled: false,
      glowColor: '#4A90E2',
      glowSize: 5,
      shadowEnabled: true,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 5
    };
    
    // Merge provided options with defaults
    this.options = { ...this.defaultOptions, ...options };
    
    // Array to store piece references
    this.pieces = [];
    
    // Initialize the board
    this.init();
  }
  
  /**
   * Initialize the board
   */
  init() {
    // Clear the board element
    this.boardElement.innerHTML = '';
    this.pieces = [];
    
    // Set board element attributes
    this.boardElement.classList.add('chess-board');
    this.boardElement.style.gridTemplateColumns = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.boardElement.style.gridTemplateRows = `repeat(${this.options.boardSize}, ${this.options.squareSize}px)`;
    this.boardElement.style.width = `${this.options.boardSize * this.options.squareSize}px`;
    this.boardElement.style.height = `${this.options.boardSize * this.options.squareSize}px`;
    
    // Create board squares
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const square = document.createElement('div');
        square.classList.add('chess-square');
        
        // Determine square color
        const isLight = (row + col) % 2 === 0;
        square.classList.add(isLight ? 'light-square' : 'dark-square');
        square.style.backgroundColor = isLight ? this.options.lightSquareColor : this.options.darkSquareColor;
        
        // Set data attributes for position
        square.dataset.row = row;
        square.dataset.col = col;
        
        // Add ARIA attributes for accessibility
        square.setAttribute('role', 'gridcell');
        square.setAttribute('aria-label', `${String.fromCharCode(97 + col)}${8 - row}`);
        
        this.boardElement.appendChild(square);
      }
    }
  }
  
  /**
   * Update board colors
   * @param {string} lightColor - Color for light squares
   * @param {string} darkColor - Color for dark squares
   */
  updateBoardColors(lightColor, darkColor) {
    this.options.lightSquareColor = lightColor;
    this.options.darkSquareColor = darkColor;
    
    const lightSquares = this.boardElement.querySelectorAll('.light-square');
    const darkSquares = this.boardElement.querySelectorAll('.dark-square');
    
    lightSquares.forEach(square => {
      square.style.backgroundColor = lightColor;
    });
    
    darkSquares.forEach(square => {
      square.style.backgroundColor = darkColor;
    });
  }
  
  /**
   * Add a piece to the board
   * @param {string} pieceType - Type of piece (pawn, rook, knight, bishop, queen, king)
   * @param {string} pieceColor - Color of piece (white, black)
   * @param {number} row - Row position (0-7)
   * @param {number} col - Column position (0-7)
   * @returns {ChessPiece} The created piece
   */
  addPiece(pieceType, pieceColor, row, col) {
    // Find the square at the specified position
    const square = this.boardElement.querySelector(`.chess-square[data-row="${row}"][data-col="${col}"]`);
    
    if (!square) {
      console.error(`Square at position ${row},${col} not found`);
      return null;
    }
    
    // Create SVG element for the piece
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.classList.add('chess-piece', pieceColor);
    
    // Create piece options
    const pieceOptions = {
      pieceType,
      pieceColor,
      pieceColorValue: pieceColor === 'white' ? this.options.whitePieceColor : this.options.blackPieceColor,
      borderColorValue: pieceColor === 'white' ? this.options.whitePieceBorder : this.options.blackPieceBorder,
      size: this.options.pieceSize,
      borderWidth: this.options.borderWidth,
      is3D: this.options.is3D,
      style: this.options.style,
      glowEnabled: this.options.glowEnabled,
      glowColor: this.options.glowColor,
      glowSize: this.options.glowSize,
      shadowEnabled: this.options.shadowEnabled,
      shadowColor: this.options.shadowColor,
      shadowBlur: this.options.shadowBlur
    };
    
    // Create the piece
    const piece = new ChessPiece(svgElement, pieceOptions);
    
    // Add the piece to the square
    square.appendChild(svgElement);
    
    // Store the piece reference
    this.pieces.push({
      piece,
      row,
      col,
      type: pieceType,
      color: pieceColor
    });
    
    return piece;
  }
  
  /**
   * Remove a piece from the board
   * @param {number} row - Row position (0-7)
   * @param {number} col - Column position (0-7)
   * @returns {boolean} True if successful, false otherwise
   */
  removePiece(row, col) {
    // Find the square at the specified position
    const square = this.boardElement.querySelector(`.chess-square[data-row="${row}"][data-col="${col}"]`);
    
    if (!square) {
      console.error(`Square at position ${row},${col} not found`);
      return false;
    }
    
    // Find the piece SVG element
    const pieceElement = square.querySelector('svg');
    
    if (!pieceElement) {
      console.error(`No piece found at position ${row},${col}`);
      return false;
    }
    
    // Remove the piece from the square
    square.removeChild(pieceElement);
    
    // Remove the piece from the pieces array
    this.pieces = this.pieces.filter(p => !(p.row === row && p.col === col));
    
    return true;
  }
  
  /**
   * Clear all pieces from the board
   */
  clearBoard() {
    const pieceElements = this.boardElement.querySelectorAll('svg');
    
    pieceElements.forEach(element => {
      element.parentNode.removeChild(element);
    });
    
    this.pieces = [];
    
    return true;
  }
  
  /**
   * Setup the initial position of a chess game
   */
  setupInitialPosition() {
    // Clear the board first
    this.clearBoard();
    
    // Add pawns
    for (let col = 0; col < 8; col++) {
      this.addPiece('pawn', 'white', 6, col);
      this.addPiece('pawn', 'black', 1, col);
    }
    
    // Add rooks
    this.addPiece('rook', 'white', 7, 0);
    this.addPiece('rook', 'white', 7, 7);
    this.addPiece('rook', 'black', 0, 0);
    this.addPiece('rook', 'black', 0, 7);
    
    // Add knights
    this.addPiece('knight', 'white', 7, 1);
    this.addPiece('knight', 'white', 7, 6);
    this.addPiece('knight', 'black', 0, 1);
    this.addPiece('knight', 'black', 0, 6);
    
    // Add bishops
    this.addPiece('bishop', 'white', 7, 2);
    this.addPiece('bishop', 'white', 7, 5);
    this.addPiece('bishop', 'black', 0, 2);
    this.addPiece('bishop', 'black', 0, 5);
    
    // Add queens
    this.addPiece('queen', 'white', 7, 3);
    this.addPiece('queen', 'black', 0, 3);
    
    // Add kings
    this.addPiece('king', 'white', 7, 4);
    this.addPiece('king', 'black', 0, 4);
    
    return true;
  }
  
  /**
   * Update piece colors
   * @param {string} whiteColor - Color for white pieces
   * @param {string} whiteBorder - Border color for white pieces
   * @param {string} blackColor - Color for black pieces
   * @param {string} blackBorder - Border color for black pieces
   */
  updatePieceColors(whiteColor, whiteBorder, blackColor, blackBorder) {
    this.options.whitePieceColor = whiteColor;
    this.options.whitePieceBorder = whiteBorder;
    this.options.blackPieceColor = blackColor;
    this.options.blackPieceBorder = blackBorder;
    
    // Update existing pieces
    this.pieces.forEach(p => {
      const options = {
        pieceColorValue: p.color === 'white' ? whiteColor : blackColor,
        borderColorValue: p.color === 'white' ? whiteBorder : blackBorder
      };
      
      p.piece.setOptions(options);
    });
    
    return true;
  }
  
  /**
   * Update piece style
   * @param {string} style - Style name (classic, modern, minimalist)
   */
  updatePieceStyle(style) {
    this.options.style = style;
    
    // Update existing pieces
    this.pieces.forEach(p => {
      p.piece.setOption('style', style);
    });
    
    return true;
  }
  
  /**
   * Toggle 3D effect for all pieces
   * @param {boolean} enabled - Whether 3D effect is enabled
   */
  toggle3DEffect(enabled) {
    this.options.is3D = enabled;
    
    // Update existing pieces
    this.pieces.forEach(p => {
      p.piece.set3DEffect(enabled);
    });
    
    return true;
  }
  
  /**
   * Toggle glow effect for all pieces
   * @param {boolean} enabled - Whether glow effect is enabled
   */
  toggleGlowEffect(enabled) {
    this.options.glowEnabled = enabled;
    
    // Update existing pieces
    this.pieces.forEach(p => {
      p.piece.setGlowEffect(enabled);
    });
    
    return true;
  }
  
  /**
   * Toggle shadow effect for all pieces
   * @param {boolean} enabled - Whether shadow effect is enabled
   */
  toggleShadowEffect(enabled) {
    this.options.shadowEnabled = enabled;
    
    // Update existing pieces
    this.pieces.forEach(p => {
      p.piece.setShadowEffect(enabled);
    });
    
    return true;
  }
  
  /**
   * Export the board as SVG
   * @returns {string} SVG string
   */
  exportSVG() {
    // Create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', `0 0 ${this.options.boardSize * 100} ${this.options.boardSize * 100}`);
    svg.setAttribute('width', `${this.options.boardSize * this.options.squareSize}px`);
    svg.setAttribute('height', `${this.options.boardSize * this.options.squareSize}px`);
    
    // Create the board squares
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', col * 100);
        rect.setAttribute('y', row * 100);
        rect.setAttribute('width', 100);
        rect.setAttribute('height', 100);
        
        const isLight = (row + col) % 2 === 0;
        rect.setAttribute('fill', isLight ? this.options.lightSquareColor : this.options.darkSquareColor);
        
        svg.appendChild(rect);
      }
    }
    
    // Add the pieces
    this.pieces.forEach(p => {
      const pieceElement = p.piece.svgElement.cloneNode(true);
      pieceElement.setAttribute('x', p.col * 100 + (100 - this.options.pieceSize) / 2);
      pieceElement.setAttribute('y', p.row * 100 + (100 - this.options.pieceSize) / 2);
      svg.appendChild(pieceElement);
    });
    
    return svg.outerHTML;
  }
  
  /**
   * Export the board as PNG
   * @param {number} scale - Scale factor for the PNG
   * @returns {Promise<string>} Promise resolving to a data URL
   */
  exportPNG(scale = 2) {
    return new Promise((resolve, reject) => {
      try {
        const svgString = this.exportSVG();
        const canvas = document.createElement('canvas');
        const size = this.options.boardSize * this.options.squareSize * scale;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (error) => {
          reject(error);
        };
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Export the classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChessPiece, ChessBoard };
}
