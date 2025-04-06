/**
 * MinesweeperTileDisplay - A class to create and manage minesweeper tile displays
 */
class MinesweeperTileDisplay {
  /**
   * Constructor for the MinesweeperTileDisplay class
   * @param {HTMLElement} element - The SVG element to render the display in
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      unplayedColor: options.unplayedColor || '#4a90e2',
      revealedColor: options.revealedColor || '#C0C0C0',
      borderColor: options.borderColor || '#2c3e50',
      highlightColor: options.highlightColor || '#ffffff',
      shadowColor: options.shadowColor || '#2c3e50',
      numberOutlineColor: options.numberOutlineColor || '#ffffff',
      numberOutlineWidth: options.numberOutlineWidth || 1,
      number1Color: options.number1Color || '#0000FF',
      number2Color: options.number2Color || '#008000',
      number3Color: options.number3Color || '#FF0000',
      number4Color: options.number4Color || '#000080',
      number5Color: options.number5Color || '#800000',
      number6Color: options.number6Color || '#008080',
      number7Color: options.number7Color || '#000000',
      number8Color: options.number8Color || '#808080',
      mineColor: options.mineColor || '#000000',
      flagColor: options.flagColor || '#FF0000',
      wrongGuessColor: options.wrongGuessColor || '#FF0000',
      shadowOpacity: options.shadowOpacity !== undefined ? options.shadowOpacity : 0.8,
      highlightOpacity: options.highlightOpacity !== undefined ? options.highlightOpacity : 0.7,
      innerShadowEnabled: options.innerShadowEnabled !== undefined ? options.innerShadowEnabled : true,
      innerShadowBlur: options.innerShadowBlur !== undefined ? options.innerShadowBlur : 1,
      innerShadowOffset: options.innerShadowOffset !== undefined ? options.innerShadowOffset : 2,
      tileSize: options.tileSize || 150,
      ...options
    };
    
    // Define tile states
    this.tileStates = [
      'unplayed',
      'pressed',
      'flagged',
      'revealed_mine',
      'wrong_guess',
      'neighbor_0',
      'neighbor_1',
      'neighbor_2',
      'neighbor_3',
      'neighbor_4',
      'neighbor_5',
      'neighbor_6',
      'neighbor_7',
      'neighbor_8',
      // New smiley tile states
      'smiley_normal',
      'smiley_cool',
      'smiley_sad',
      'smiley_neutral',
      'smiley_tense'
    ];
    
    this.currentState = 'unplayed'; // Default to unplayed
    this.init();
  }
  
  /**
   * Initialize the display
   */
  init() {
    // Clear any existing content
    this.element.innerHTML = '';
    
    // Set the viewBox and dimensions
    this.element.setAttribute('viewBox', `0 0 100 100`);
    this.element.style.width = `${this.options.tileSize}px`;
    this.element.style.height = `${this.options.tileSize}px`;
    
    // Add the defs section with filter for inner shadow effect
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${this.options.unplayedColor}" />
        <stop offset="100%" stop-color="${this.options.unplayedColor}CC" />
      </linearGradient>
      <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${this.options.innerShadowBlur}" result="blur" />
        <feOffset dx="${this.options.innerShadowOffset}" dy="${this.options.innerShadowOffset}" />
        <feComposite in="SourceAlpha" in2="offsetblur" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="shadowDiff" />
        <feFlood flood-color="${this.options.shadowColor}" flood-opacity="0.3" result="shadowColor" />
        <feComposite in="shadowColor" in2="shadowDiff" operator="in" result="shadow" />
        <feComposite in="shadow" in2="SourceGraphic" operator="over" />
      </filter>
    `;
    this.element.appendChild(defs);
    
    // Create the tile elements
    this.createTileElements();
    
    // Apply initial styling
    this.updateStyles();
    
    // Set initial state
    this.setState(this.currentState);
    
    // Apply inner shadow if enabled
    this.setInnerShadowEffect(this.options.innerShadowEnabled);
  }
  
  /**
   * Create the SVG elements for the tile
   */
  createTileElements() {
    // Create unplayed tile (blue button with 3D effect)
    const unplayedTile = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    unplayedTile.setAttribute('class', 'unplayed-tile');
    unplayedTile.innerHTML = `
      <!-- Regular Button -->
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="0"
        ry="0"
        fill="url(#buttonGradient)"
        filter="url(#innerShadow)"
        stroke="${this.options.borderColor}"
        stroke-width="1"
      />
      
      <!-- Top Highlight -->
      <line
        x1="7"
        y1="7"
        x2="93"
        y2="7"
        stroke="${this.options.highlightColor}"
        stroke-width="2"
        stroke-opacity="${this.options.highlightOpacity}"
      />
      <line
        x1="7"
        y1="7"
        x2="7"
        y2="93"
        stroke="${this.options.highlightColor}"
        stroke-width="2"
        stroke-opacity="${this.options.highlightOpacity}"
      />
      
      <!-- Bottom Shadow -->
      <line
        x1="7"
        y1="93"
        x2="93"
        y2="93"
        stroke="${this.options.shadowColor}"
        stroke-width="2"
        stroke-opacity="${this.options.shadowOpacity}"
      />
      <line
        x1="93"
        y1="7"
        x2="93"
        y2="93"
        stroke="${this.options.shadowColor}"
        stroke-width="2"
        stroke-opacity="${this.options.shadowOpacity}"
      />
    `;
    this.element.appendChild(unplayedTile);
    
    // Create pressed tile (sunken button with swapped highlights/shadows)
    const pressedTile = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pressedTile.setAttribute('class', 'pressed-tile');
    pressedTile.innerHTML = `
      <!-- Same background as unplayed but slightly offset -->
      <rect
        x="6"
        y="6"
        width="90"
        height="90"
        rx="0"
        ry="0"
        fill="url(#buttonGradient)"
        stroke="${this.options.borderColor}"
        stroke-width="1"
      />
      
      <!-- Swapped: Top/Left now has shadows -->
      <line
        x1="8"
        y1="8"
        x2="94"
        y2="8"
        stroke="${this.options.shadowColor}"
        stroke-width="2"
        stroke-opacity="${this.options.shadowOpacity}"
      />
      <line
        x1="8"
        y1="8"
        x2="8"
        y2="94"
        stroke="${this.options.shadowColor}"
        stroke-width="2"
        stroke-opacity="${this.options.shadowOpacity}"
      />
      
      <!-- Swapped: Bottom/Right now has highlights -->
      <line
        x1="8"
        y1="94"
        x2="94"
        y2="94"
        stroke="${this.options.highlightColor}"
        stroke-width="2"
        stroke-opacity="${this.options.highlightOpacity}"
      />
      <line
        x1="94"
        y1="8"
        x2="94"
        y2="94"
        stroke="${this.options.highlightColor}"
        stroke-width="2"
        stroke-opacity="${this.options.highlightOpacity}"
      />
    `;
    this.element.appendChild(pressedTile);
    
    // Create revealed tile (gray background)
    const revealedTile = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    revealedTile.setAttribute('class', 'revealed-tile');
    revealedTile.innerHTML = `
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="0"
        ry="0"
        fill="${this.options.revealedColor}"
        stroke="#000000"
        stroke-width="1"
      />
    `;
    this.element.appendChild(revealedTile);
    
    // Create numbers 1-8
    for (let i = 1; i <= 8; i++) {
      const numberElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      numberElement.setAttribute('class', `number number-${i}`);
      numberElement.innerHTML = `
        <text
          x="50"
          y="53"
          font-family="'Courier New', monospace"
          font-size="55"
          font-weight="bold"
          text-anchor="middle"
          dominant-baseline="central"
          fill="${this.options[`number${i}Color`]}"
          stroke="${this.options.numberOutlineColor}"
          stroke-width="${this.options.numberOutlineWidth}"
        >
          ${i}
        </text>
      `;
      this.element.appendChild(numberElement);
    }
    
    // Create mine
    const mineElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mineElement.setAttribute('class', 'mine');
    mineElement.innerHTML = `
      <!-- Mine Circle -->
      <circle cx="50" cy="50" r="18" fill="${this.options.mineColor}" />
      
      <!-- Mine Spikes -->
      <line x1="25" y1="50" x2="75" y2="50" stroke="${this.options.mineColor}" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="25" x2="50" y2="75" stroke="${this.options.mineColor}" stroke-width="4" stroke-linecap="round" />
      <line x1="33" y1="33" x2="67" y2="67" stroke="${this.options.mineColor}" stroke-width="4" stroke-linecap="round" />
      <line x1="67" y1="33" x2="33" y2="67" stroke="${this.options.mineColor}" stroke-width="4" stroke-linecap="round" />
      
      <!-- Mine Highlight -->
      <circle cx="42" cy="42" r="6" fill="#FFFFFF" />
    `;
    this.element.appendChild(mineElement);
    
    // Create flag
    const flagElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    flagElement.setAttribute('class', 'flag');
    flagElement.innerHTML = `
      <!-- Flag Pole -->
      <rect
        x="45"
        y="25"
        width="4"
        height="45"
        fill="${this.options.borderColor}"
        class="flag-pole"
      />
      <!-- Flag -->
      <polygon
        points="49,25 49,40 65,32.5"
        fill="${this.options.flagColor}"
        class="flag"
      />
      <!-- Flag Base -->
      <rect
        x="37"
        y="70"
        width="20"
        height="5"
        fill="${this.options.borderColor}"
        class="flag-pole"
      />
    `;
    this.element.appendChild(flagElement);
    
    // Create wrong guess (X mark)
    const wrongGuessElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrongGuessElement.setAttribute('class', 'wrong-guess');
    wrongGuessElement.innerHTML = `
      <line x1="25" y1="25" x2="75" y2="75" stroke="${this.options.wrongGuessColor}" stroke-width="8" stroke-linecap="round" />
      <line x1="75" y1="25" x2="25" y2="75" stroke="${this.options.wrongGuessColor}" stroke-width="8" stroke-linecap="round" />
    `;
    this.element.appendChild(wrongGuessElement);
    
    // Create normal smiley face
    const smileyNormalElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    smileyNormalElement.setAttribute('class', 'smiley-normal');
    smileyNormalElement.innerHTML = `
      <!-- Smiley Face Circle -->
      <circle cx="50" cy="50" r="25" fill="#FFDE00" stroke="#000000" stroke-width="1" />
      
      <!-- Eyes -->
      <circle cx="40" cy="40" r="4" fill="#000000" />
      <circle cx="60" cy="40" r="4" fill="#000000" />
      
      <!-- Smile -->
      <path d="M35,55 Q50,70 65,55" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round" />
    `;
    this.element.appendChild(smileyNormalElement);
    
    // Create cool smiley face with sunglasses
    const smileyCoolElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    smileyCoolElement.setAttribute('class', 'smiley-cool');
    smileyCoolElement.innerHTML = `
      <!-- Smiley Face Circle -->
      <circle cx="50" cy="50" r="25" fill="#FFDE00" stroke="#000000" stroke-width="1" />
      
      <!-- Sunglasses -->
      <rect x="30" y="35" width="40" height="12" rx="2" ry="2" fill="#000000" />
      <rect x="30" y="35" width="15" height="10" rx="2" ry="2" fill="#000000" />
      <rect x="55" y="35" width="15" height="10" rx="2" ry="2" fill="#000000" />
      
      <!-- Sunglasses Reflection -->
      <line x1="33" y1="38" x2="36" y2="38" stroke="#FFFFFF" stroke-width="1.5" />
      <line x1="58" y1="38" x2="61" y2="38" stroke="#FFFFFF" stroke-width="1.5" />
      
      <!-- Smile -->
      <path d="M35,60 Q50,70 65,60" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round" />
    `;
    this.element.appendChild(smileyCoolElement);
    
    // Create sad smiley face
    const smileySadElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    smileySadElement.setAttribute('class', 'smiley-sad');
    smileySadElement.innerHTML = `
      <!-- Smiley Face Circle -->
      <circle cx="50" cy="50" r="25" fill="#FFDE00" stroke="#000000" stroke-width="1" />
      
      <!-- Eyes -->
      <circle cx="40" cy="40" r="4" fill="#000000" />
      <circle cx="60" cy="40" r="4" fill="#000000" />
      
      <!-- Frown -->
      <path d="M35,65 Q50,55 65,65" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round" />
    `;
    this.element.appendChild(smileySadElement);
    
    // Create neutral smiley face
    const smileyNeutralElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    smileyNeutralElement.setAttribute('class', 'smiley-neutral');
    smileyNeutralElement.innerHTML = `
      <!-- Smiley Face Circle -->
      <circle cx="50" cy="50" r="25" fill="#FFDE00" stroke="#000000" stroke-width="1" />
      
      <!-- Eyes -->
      <circle cx="40" cy="40" r="4" fill="#000000" />
      <circle cx="60" cy="40" r="4" fill="#000000" />
      
      <!-- Neutral Mouth -->
      <line x1="35" y1="60" x2="65" y2="60" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    `;
    this.element.appendChild(smileyNeutralElement);
    
    // Create tense smiley face
    const smileyTenseElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    smileyTenseElement.setAttribute('class', 'smiley-tense');
    smileyTenseElement.innerHTML = `
      <!-- Smiley Face Circle -->
      <circle cx="50" cy="50" r="25" fill="#FFDE00" stroke="#000000" stroke-width="1" />
      
      <!-- Eyes (worried look) -->
      <path d="M36,38 Q40,35 44,38" stroke="#000000" stroke-width="2" fill="none" />
      <path d="M56,38 Q60,35 64,38" stroke="#000000" stroke-width="2" fill="none" />
      
      <!-- Tense Mouth (straight with slight curve) -->
      <path d="M35,60 Q50,58 65,60" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round" />
    `;
    this.element.appendChild(smileyTenseElement);
  }
  
  /**
   * Set the display to show a specific tile state
   * @param {string} state - The state to display ('unplayed', 'pressed', etc.)
   */
  setState(state) {
    if (!this.tileStates.includes(state)) {
      console.warn(`Invalid state: ${state}. Using unplayed instead.`);
      state = 'unplayed';
    }
    
    // Remove any existing state classes
    this.element.classList.remove(...this.tileStates.map(s => `tile-${s}`));
    
    // Add the new state class
    this.element.classList.add(`tile-${state}`);
    
    // Store current state
    this.currentState = state;
  }
  
  /**
   * Update the display styles based on current options
   */
  updateStyles() {
    // Update CSS variables
    this.element.style.setProperty('--unplayed-color', this.options.unplayedColor);
    this.element.style.setProperty('--revealed-color', this.options.revealedColor);
    this.element.style.setProperty('--border-color', this.options.borderColor);
    this.element.style.setProperty('--highlight-color', this.options.highlightColor);
    this.element.style.setProperty('--shadow-color', this.options.shadowColor);
    this.element.style.setProperty('--number-outline-color', this.options.numberOutlineColor);
    this.element.style.setProperty('--number-1-color', this.options.number1Color);
    this.element.style.setProperty('--number-2-color', this.options.number2Color);
    this.element.style.setProperty('--number-3-color', this.options.number3Color);
    this.element.style.setProperty('--number-4-color', this.options.number4Color);
    this.element.style.setProperty('--number-5-color', this.options.number5Color);
    this.element.style.setProperty('--number-6-color', this.options.number6Color);
    this.element.style.setProperty('--number-7-color', this.options.number7Color);
    this.element.style.setProperty('--number-8-color', this.options.number8Color);
    this.element.style.setProperty('--mine-color', this.options.mineColor);
    this.element.style.setProperty('--flag-color', this.options.flagColor);
    this.element.style.setProperty('--wrong-guess-color', this.options.wrongGuessColor);
    this.element.style.setProperty('--shadow-opacity', this.options.shadowOpacity);
    this.element.style.setProperty('--highlight-opacity', this.options.highlightOpacity);
    this.element.style.setProperty('--inner-shadow-blur', this.options.innerShadowBlur);
    this.element.style.setProperty('--inner-shadow-offset', this.options.innerShadowOffset);
    this.element.style.setProperty('--tile-size', `${this.options.tileSize}px`);
    
    // Update the container as well
    const container = this.element.closest('.tile-container');
    if (container) {
      container.style.backgroundColor = this.options.revealedColor;
    }
    
    // Update gradient in defs
    const gradient = this.element.querySelector('#buttonGradient');
    if (gradient) {
      const stops = gradient.querySelectorAll('stop');
      if (stops.length >= 2) {
        stops[0].setAttribute('stop-color', this.options.unplayedColor);
        stops[1].setAttribute('stop-color', `${this.options.unplayedColor}CC`);
      }
    }
    
    // Update inner shadow filter
    const innerShadowFilter = this.element.querySelector('#innerShadow');
    if (innerShadowFilter) {
      const blur = innerShadowFilter.querySelector('feGaussianBlur');
      if (blur) {
        blur.setAttribute('stdDeviation', this.options.innerShadowBlur);
      }
      
      const offset = innerShadowFilter.querySelector('feOffset');
      if (offset) {
        offset.setAttribute('dx', this.options.innerShadowOffset);
        offset.setAttribute('dy', this.options.innerShadowOffset);
      }
      
      const flood = innerShadowFilter.querySelector('feFlood');
      if (flood) {
        flood.setAttribute('flood-color', this.options.shadowColor);
        flood.setAttribute('flood-opacity', '0.3');
      }
    }
    
    // Update unplayed tile
    const unplayedTile = this.element.querySelector('.unplayed-tile');
    if (unplayedTile) {
      const rect = unplayedTile.querySelector('rect');
      if (rect) {
        rect.setAttribute('stroke', this.options.borderColor);
      }
      
      const highlights = unplayedTile.querySelectorAll('line:nth-child(2), line:nth-child(3)');
      highlights.forEach(line => {
        line.setAttribute('stroke', this.options.highlightColor);
        line.setAttribute('stroke-opacity', this.options.highlightOpacity);
      });
      
      const shadows = unplayedTile.querySelectorAll('line:nth-child(4), line:nth-child(5)');
      shadows.forEach(line => {
        line.setAttribute('stroke', this.options.shadowColor);
        line.setAttribute('stroke-opacity', this.options.shadowOpacity);
      });
    }
    
    // Update revealed tiles (but not pressed - it has custom styling)
    const revealedTile = this.element.querySelector('.revealed-tile rect');
    
    if (revealedTile) {
      revealedTile.setAttribute('fill', this.options.revealedColor);
      revealedTile.setAttribute('stroke', '#000000');
    }
    
    // Update flag
    const flagPole = this.element.querySelectorAll('.flag-pole');
    const flag = this.element.querySelector('.flag');
    
    flagPole.forEach(pole => {
      pole.setAttribute('fill', this.options.borderColor);
    });
    
    if (flag) {
      flag.setAttribute('fill', this.options.flagColor);
    }
    
    // Update mine
    const mine = this.element.querySelector('.mine');
    if (mine) {
      const mineElements = mine.querySelectorAll('circle:first-child, line');
      mineElements.forEach(el => {
        if (el.tagName === 'circle') {
          el.setAttribute('fill', this.options.mineColor);
        } else {
          el.setAttribute('stroke', this.options.mineColor);
        }
      });
    }
    
    // Update wrong guess
    const wrongGuess = this.element.querySelector('.wrong-guess');
    if (wrongGuess) {
      const lines = wrongGuess.querySelectorAll('line');
      lines.forEach(line => {
        line.setAttribute('stroke', this.options.wrongGuessColor);
      });
    }
    
    // Update number outlines
    for (let i = 1; i <= 8; i++) {
      const numberText = this.element.querySelector(`.number-${i} text`);
      if (numberText) {
        numberText.setAttribute('stroke', this.options.numberOutlineColor);
        numberText.setAttribute('stroke-width', this.options.numberOutlineWidth);
      }
    }
  }
  
  /**
   * Enable or disable the inner shadow effect
   * @param {boolean} enabled - Whether the inner shadow effect should be enabled
   */
  setInnerShadowEffect(enabled) {
    if (enabled) {
      this.element.classList.add('inner-shadow-enabled');
    } else {
      this.element.classList.remove('inner-shadow-enabled');
    }
    this.options.innerShadowEnabled = enabled;
  }
  
  /**
   * Update a specific option and refresh the display
   * @param {string} option - The option name to update
   * @param {any} value - The new value for the option
   */
  setOption(option, value) {
    this.options[option] = value;
    
    // Handle special cases
    if (option === 'innerShadowEnabled') {
      this.setInnerShadowEffect(value);
    } else if (option === 'tileSize') {
      this.element.style.width = `${value}px`;
      this.element.style.height = `${value}px`;
      this.updateStyles();
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
    
    // Add metadata with settings
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metadata.innerHTML = `
      <settings>
        <tileState>${this.currentState}</tileState>
        <unplayedColor>${this.options.unplayedColor}</unplayedColor>
        <revealedColor>${this.options.revealedColor}</revealedColor>
        <borderColor>${this.options.borderColor}</borderColor>
        <highlightColor>${this.options.highlightColor}</highlightColor>
        <shadowColor>${this.options.shadowColor}</shadowColor>
        <numberOutlineColor>${this.options.numberOutlineColor}</numberOutlineColor>
        <numberOutlineWidth>${this.options.numberOutlineWidth}</numberOutlineWidth>
        <number1Color>${this.options.number1Color}</number1Color>
        <number2Color>${this.options.number2Color}</number2Color>
        <number3Color>${this.options.number3Color}</number3Color>
        <number4Color>${this.options.number4Color}</number4Color>
        <number5Color>${this.options.number5Color}</number5Color>
        <number6Color>${this.options.number6Color}</number6Color>
        <number7Color>${this.options.number7Color}</number7Color>
        <number8Color>${this.options.number8Color}</number8Color>
        <mineColor>${this.options.mineColor}</mineColor>
        <flagColor>${this.options.flagColor}</flagColor>
        <wrongGuessColor>${this.options.wrongGuessColor}</wrongGuessColor>
        <shadowOpacity>${this.options.shadowOpacity}</shadowOpacity>
        <highlightOpacity>${this.options.highlightOpacity}</highlightOpacity>
        <innerShadowEnabled>${this.options.innerShadowEnabled}</innerShadowEnabled>
        <innerShadowBlur>${this.options.innerShadowBlur}</innerShadowBlur>
        <innerShadowOffset>${this.options.innerShadowOffset}</innerShadowOffset>
      </settings>
    `;
    svgClone.appendChild(metadata);
    
    // Add embedded CSS
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      .unplayed-tile { display: none; }
      .pressed-tile { display: none; }
      .revealed-tile { display: none; }
      .number { display: none; }
      .mine { display: none; }
      .flag { display: none; }
      .wrong-guess { display: none; }
      .smiley-normal { display: none; }
      .smiley-cool { display: none; }
      .smiley-sad { display: none; }
      .smiley-neutral { display: none; }
      .smiley-tense { display: none; }
      
      .tile-unplayed .unplayed-tile { display: block; }
      .tile-pressed .pressed-tile { display: block; }
      .tile-flagged .unplayed-tile, .tile-flagged .flag { display: block; }
      .tile-revealed_mine .revealed-tile, .tile-revealed_mine .mine { display: block; }
      .tile-wrong_guess .revealed-tile, .tile-wrong_guess .mine, .tile-wrong_guess .wrong-guess { display: block; }
      .tile-neighbor_0 .revealed-tile { display: block; }
      .tile-neighbor_1 .revealed-tile, .tile-neighbor_1 .number-1 { display: block; }
      .tile-neighbor_2 .revealed-tile, .tile-neighbor_2 .number-2 { display: block; }
      .tile-neighbor_3 .revealed-tile, .tile-neighbor_3 .number-3 { display: block; }
      .tile-neighbor_4 .revealed-tile, .tile-neighbor_4 .number-4 { display: block; }
      .tile-neighbor_5 .revealed-tile, .tile-neighbor_5 .number-5 { display: block; }
      .tile-neighbor_6 .revealed-tile, .tile-neighbor_6 .number-6 { display: block; }
      .tile-neighbor_7 .revealed-tile, .tile-neighbor_7 .number-7 { display: block; }
      .tile-neighbor_8 .revealed-tile, .tile-neighbor_8 .number-8 { display: block; }
      
      /* New smiley tile states */
      .tile-smiley_normal .unplayed-tile, .tile-smiley_normal .smiley-normal { display: block; }
      .tile-smiley_cool .unplayed-tile, .tile-smiley_cool .smiley-cool { display: block; }
      .tile-smiley_sad .unplayed-tile, .tile-smiley_sad .smiley-sad { display: block; }
      .tile-smiley_neutral .unplayed-tile, .tile-smiley_neutral .smiley-neutral { display: block; }
      .tile-smiley_tense .pressed-tile, .tile-smiley_tense .smiley-tense { display: block; }
      
      .inner-shadow-enabled .unplayed-tile,
      .inner-shadow-enabled .pressed-tile {
        filter: url(#innerShadow);
      }
    `;
    svgClone.appendChild(style);
    
    // Serialize to string
    const svgString = new XMLSerializer().serializeToString(svgClone);
    
    // Return with XML declaration
    return `${xmlDeclaration}\n${svgString}`;
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
      canvas.width = this.options.tileSize * scale;
      canvas.height = this.options.tileSize * scale;
      
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
   * @param {number} size - New size in pixels (width and height will be the same)
   */
  resize(size) {
    this.options.tileSize = size;
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
    this.updateStyles();
  }
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MinesweeperTileDisplay;
}
