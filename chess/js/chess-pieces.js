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
