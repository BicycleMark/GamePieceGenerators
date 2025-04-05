/**
 * SevenSegmentDisplay - A class to create and manage 7-segment LED displays
 */
class SevenSegmentDisplay {
  /**
   * Constructor for the SevenSegmentDisplay class
   * @param {HTMLElement} element - The SVG element to render the display in
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      backgroundColor: options.backgroundColor || '#000000',
      foregroundColor: options.foregroundColor || '#ff0000',
      opacityOffSegment: options.opacityOffSegment || 0.15,
      width: options.width || 50,
      height: options.height || 100,
      glowEnabled: options.glowEnabled !== undefined ? options.glowEnabled : true,
      edgeRadius: options.edgeRadius || 0,
      ...options
    };
    
    // Define segment patterns for each digit
    this.digitPatterns = {
      '': '',         // blank - no segments on
      '0': 'abcdef',  // segments a, b, c, d, e, f are on
      '1': 'bc',      // only segments b and c are on
      '2': 'abged',
      '3': 'abgcd',
      '4': 'fgbc',
      '5': 'afgcd',
      '6': 'afgecd',
      '7': 'abc',
      '8': 'abcdefg',
      '9': 'abfgcd'
    };
    
    this.currentDigit = '8'; // Default to 8 which shows all segments
    this.init();
  }
  
  /**
   * Initialize the display
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set the viewBox and dimensions
    this.element.setAttribute('viewBox', `0 0 50 100`);
    this.element.style.width = `${this.options.width}px`;
    this.element.style.height = `${this.options.height}px`;
    
    // Add the defs section with filter for glow effect
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    `;
    this.element.appendChild(defs);
    
    // Add background rectangle with the specified edge radius
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('class', 'background');
    background.setAttribute('x', '0');
    background.setAttribute('y', '0');
    background.setAttribute('width', '50');
    background.setAttribute('height', '100');
    background.setAttribute('rx', this.options.edgeRadius);
    background.setAttribute('ry', this.options.edgeRadius);
    this.element.appendChild(background);
    
    // Create segments with paths
    this.createSegments();
    
    // Apply initial styling
    this.updateStyles();
    
    // Set initial digit
    this.setDigit(this.currentDigit);
    
    // Apply glow if enabled
    this.setGlowEffect(this.options.glowEnabled);
  }
  
  /**
   * Create the SVG paths for each segment
   */
  createSegments() {
    // Sharp-cornered segment paths with improved proportions
    const segmentPaths = {
      // Horizontal segments (a, g, d) - wider with better positioning
      a: 'M8,5 L42,5 L42,15 L8,15 Z',
      g: 'M8,45 L42,45 L42,55 L8,55 Z',
      d: 'M8,85 L42,85 L42,95 L8,95 Z',
      
      // Vertical segments (b, c, e, f) - adjusted to connect better with horizontals
      b: 'M42,8 L42,45 L32,45 L32,8 Z',
      c: 'M42,55 L42,92 L32,92 L32,55 Z',
      e: 'M8,55 L8,92 L18,92 L18,55 Z',
      f: 'M8,8 L8,45 L18,45 L18,8 Z'
    };
    
    // Create each segment
    for (const [id, pathData] of Object.entries(segmentPaths)) {
      const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      segment.setAttribute('class', `segment ${id}`);
      segment.setAttribute('d', pathData);
      this.element.appendChild(segment);
    }
  }
  
  /**
   * Set the display to show a specific digit
   * @param {string} digit - The digit to display ('', '0'-'9')
   */
  setDigit(digit) {
    if (digit === undefined || !this.digitPatterns.hasOwnProperty(digit)) {
      console.warn(`Invalid digit: ${digit}. Using blank instead.`);
      digit = '';
    }
    
    // Remove any existing digit classes
    this.element.classList.remove(...Object.keys(this.digitPatterns).map(d => `digit-${d}`));
    if (digit !== '') {
      this.element.classList.add(`digit-${digit}`);
    } else {
      this.element.classList.add('digit-blank');
    }
    
    // Get all segments
    const segments = this.element.querySelectorAll('.segment');
    
    // Turn all segments off first
    segments.forEach(segment => {
      segment.classList.remove('on');
      segment.classList.add('off');
    });
    
    // Get the pattern for the requested digit
    const pattern = this.digitPatterns[digit] || '';
    
    // Activate the appropriate segments
    pattern.split('').forEach(segmentId => {
      const segment = this.element.querySelector(`.segment.${segmentId}`);
      if (segment) {
        segment.classList.remove('off');
        segment.classList.add('on');
      }
    });
    
    // Store current digit
    this.currentDigit = digit;
  }
  
  /**
   * Update the display styles based on current options
   */
  updateStyles() {
    // Apply CSS variables to the element
    this.element.style.setProperty('--background-color', this.options.backgroundColor);
    this.element.style.setProperty('--foreground-color', this.options.foregroundColor);
    this.element.style.setProperty('--opacity-offsegment', this.options.opacityOffSegment);
    this.element.style.setProperty('--segment-width', `${this.options.width}px`);
    this.element.style.setProperty('--segment-height', `${this.options.height}px`);
    this.element.style.setProperty('--edge-radius', this.options.edgeRadius);
    
    // Update the container as well
    const container = this.element.closest('.seven-segment-container');
    if (container) {
      container.style.backgroundColor = this.options.backgroundColor;
      // Ensure the container's border-radius matches the edge radius
      container.style.borderRadius = `${this.options.edgeRadius}px`;
    }
  }
  
  /**
   * Enable or disable the glow effect
   * @param {boolean} enabled - Whether the glow effect should be enabled
   */
  setGlowEffect(enabled) {
    if (enabled) {
      this.element.classList.add('glow-enabled');
    } else {
      this.element.classList.remove('glow-enabled');
    }
    this.options.glowEnabled = enabled;
  }
  
  /**
   * Update a specific option and refresh the display
   * @param {string} option - The option name to update
   * @param {any} value - The new value for the option
   */
  setOption(option, value) {
    this.options[option] = value;
    
    // Handle special cases
    if (option === 'glowEnabled') {
      this.setGlowEffect(value);
    } else if (option === 'edgeRadius') {
      // Update the background rectangle's corner radius
      const background = this.element.querySelector('.background');
      if (background) {
        background.setAttribute('rx', value);
        background.setAttribute('ry', value);
      }
      
      // Update CSS variables and container border-radius
      this.updateStyles();
      
      // Force a visual refresh to ensure the changes are applied
      const container = this.element.closest('.seven-segment-container');
      if (container) {
        container.style.display = 'none';
        setTimeout(() => {
          container.style.display = 'inline-block';
        }, 0);
      }
    } else {
      this.updateStyles();
    }
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
    const doctype = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    
    // Add metadata with settings
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metadata.innerHTML = `
      <settings>
        <digit>${this.currentDigit}</digit>
        <backgroundColor>${this.options.backgroundColor}</backgroundColor>
        <foregroundColor>${this.options.foregroundColor}</foregroundColor>
        <opacityOffSegment>${this.options.opacityOffSegment}</opacityOffSegment>
        <glowEnabled>${this.options.glowEnabled}</glowEnabled>
        <edgeRadius>${this.options.edgeRadius}</edgeRadius>
      </settings>
    `;
    svgClone.appendChild(metadata);
    
    // Add embedded CSS
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      .background { fill: ${this.options.backgroundColor}; }
      .segment { fill: ${this.options.foregroundColor}; }
      .segment.off { opacity: ${this.options.opacityOffSegment}; }
      .segment.on { opacity: 1; }
      ${this.options.glowEnabled ? '.segment.on { filter: url(#glow); }' : ''}
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
   * @param {number} height - New height in pixels
   */
  resize(width, height) {
    this.options.width = width;
    this.options.height = height;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.updateStyles();
  }
}
