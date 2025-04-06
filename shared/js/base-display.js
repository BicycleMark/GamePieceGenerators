/**
 * BaseDisplay - A base class for display components
 * This class contains shared functionality between MinesweeperTileDisplay and SevenSegmentDisplay
 */
class BaseDisplay {
  /**
   * Constructor for the BaseDisplay class
   * @param {HTMLElement} element - The SVG element to render the display in
   * @param {Object} options - Configuration options
   * @param {Object} defaultOptions - Default options for the specific display type
   */
  constructor(element, options = {}, defaultOptions = {}) {
    this.element = element;
    this.options = {
      ...defaultOptions,
      ...options
    };
    
    this.init();
  }
  
  /**
   * Initialize the display
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set the viewBox and dimensions
    this.element.setAttribute('viewBox', this.getViewBox());
    this.updateDimensions();
    
    // Add the defs section with filters
    this.addDefs();
    
    // Create the display elements
    this.createElements();
    
    // Apply initial styling
    this.updateStyles();
    
    // Set initial state
    this.setState(this.getDefaultState());
  }
  
  /**
   * Get the viewBox for the SVG
   * @returns {string} - The viewBox attribute value
   */
  getViewBox() {
    return '0 0 100 100';
  }
  
  /**
   * Update the dimensions of the display
   */
  updateDimensions() {
    this.element.style.width = `${this.options.width || 100}px`;
    this.element.style.height = `${this.options.height || 100}px`;
  }
  
  /**
   * Add the defs section with filters
   */
  addDefs() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.element.appendChild(defs);
  }
  
  /**
   * Create the display elements
   * This method should be overridden by subclasses
   */
  createElements() {
    // To be implemented by subclasses
    console.warn('createElements() not implemented');
  }
  
  /**
   * Update the display styles based on current options
   * This method should be overridden by subclasses
   */
  updateStyles() {
    // To be implemented by subclasses
    console.warn('updateStyles() not implemented');
  }
  
  /**
   * Get the default state for the display
   * This method should be overridden by subclasses
   * @returns {string} - The default state
   */
  getDefaultState() {
    // To be implemented by subclasses
    console.warn('getDefaultState() not implemented');
    return '';
  }
  
  /**
   * Set the display to show a specific state
   * This method should be overridden by subclasses
   * @param {string} state - The state to display
   */
  setState(state) {
    // To be implemented by subclasses
    console.warn('setState() not implemented');
  }
  
  /**
   * Update a specific option and refresh the display
   * @param {string} option - The option name to update
   * @param {any} value - The new value for the option
   */
  setOption(option, value) {
    this.options[option] = value;
    this.updateStyles();
  }
  
  /**
   * Export the current display as an SVG string
   * @returns {string} - The SVG as a string
   */
  exportSVG() {
    // Clone the SVG to avoid modifying the original
    const svgClone = this.element.cloneNode(true);
    
    // Add XML declaration and doctype
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
    
    // Add metadata with settings
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metadata.innerHTML = this.getMetadataContent();
    svgClone.appendChild(metadata);
    
    // Add embedded CSS
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = this.getStyleContent();
    svgClone.appendChild(style);
    
    // Serialize to string
    const svgString = new XMLSerializer().serializeToString(svgClone);
    
    // Return with XML declaration
    return `${xmlDeclaration}\n${svgString}`;
  }
  
  /**
   * Get the metadata content for the SVG
   * This method can be overridden by subclasses
   * @returns {string} - The metadata content
   */
  getMetadataContent() {
    return `<settings>${JSON.stringify(this.options)}</settings>`;
  }
  
  /**
   * Get the style content for the SVG
   * This method should be overridden by subclasses
   * @returns {string} - The style content
   */
  getStyleContent() {
    return '';
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
   * Export the current display as a PNG
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
      canvas.width = this.options.width * scale;
      canvas.height = this.options.height * scale;
      
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
   * Resize the display
   * @param {number} width - New width in pixels
   * @param {number} height - New height in pixels (optional, defaults to width)
   */
  resize(width, height = width) {
    this.options.width = width;
    this.options.height = height;
    this.updateDimensions();
    this.updateStyles();
  }
}

// For browser environment
if (typeof window !== 'undefined') {
  window.BaseDisplay = BaseDisplay;
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseDisplay;
}
