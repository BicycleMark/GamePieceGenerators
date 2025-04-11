/**
 * UI Controls for the Chess Piece Generator
 * Handles the user interface for customizing chess pieces
 */
class UIControls {
  /**
   * Constructor for the UIControls class
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      previewContainerId: options.previewContainerId || 'piece-preview',
      settingsManager: options.settingsManager || new SettingsManager(),
      ...options
    };
    
    // Initialize properties
    this.currentPiece = null;
    
    // Initialize UI
    this.init();
  }
  
  /**
   * Initialize the UI
   */
  init() {
    // Get the preview element
    this.previewElement = document.getElementById(this.options.previewContainerId);
    
    if (!this.previewElement) {
      console.error('Preview element not found');
      return;
    }
    
    // Create the preview piece
    this.createPreviewPiece();
    
    // Add event listeners
    this.addEventListeners();
    
    // Apply initial settings
    this.applySettings();
  }
  
  /**
   * Create the preview piece
   */
  createPreviewPiece() {
    const settings = this.options.settingsManager.settings;
    
    this.currentPiece = new ChessPiece(this.previewElement, {
      pieceType: settings.pieceType,
      theme: settings.theme,
      size: settings.pieceSize
    });
  }
  
  /**
   * Add event listeners to UI controls
   */
  addEventListeners() {
    // Piece type selector
    const pieceTypeSelect = document.getElementById('piece-type');
    if (pieceTypeSelect) {
      pieceTypeSelect.addEventListener('change', (e) => {
        this.options.settingsManager.setSetting('pieceType', e.target.value);
        this.updatePiece();
      });
    }
    
    // Theme radio buttons
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.options.settingsManager.setSetting('theme', e.target.value);
          this.updatePiece();
        }
      });
    });
    
    // Piece size selector
    const sizeSelect = document.getElementById('piece-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        const size = parseInt(e.target.value);
        this.options.settingsManager.setSetting('pieceSize', size);
        this.updatePiece();
      });
    }
    
    // Export format radio buttons
    const formatRadios = document.querySelectorAll('input[name="output-format"]');
    formatRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.options.settingsManager.setSetting('exportFormat', e.target.value);
          this.options.settingsManager.saveSettings();
        }
      });
    });
    
    // Save button
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        this.savePiece();
      });
    }
    
    // Save all button
    const saveAllButton = document.getElementById('save-all-button');
    if (saveAllButton) {
      saveAllButton.addEventListener('click', () => {
        this.saveAllPieces();
      });
    }
    
    // Copy SVG button
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
      copyButton.addEventListener('click', () => {
        this.copySVG();
      });
    }
    
    // Settings management
    const saveSettingsButton = document.getElementById('save-settings-button');
    if (saveSettingsButton) {
      saveSettingsButton.addEventListener('click', () => {
        this.saveSettings();
      });
    }
    
    const loadSettingsInput = document.getElementById('load-settings-input');
    if (loadSettingsInput) {
      loadSettingsInput.addEventListener('change', (e) => {
        this.loadSettings(e.target.files[0]);
      });
    }
    
    const createDefaultsButton = document.getElementById('create-defaults-button');
    if (createDefaultsButton) {
      createDefaultsButton.addEventListener('click', () => {
        this.createDefaults();
      });
    }
  }
  
  /**
   * Apply settings to the UI
   */
  applySettings() {
    const settings = this.options.settingsManager.settings;
    
    // Update form controls
    const pieceTypeSelect = document.getElementById('piece-type');
    if (pieceTypeSelect) {
      pieceTypeSelect.value = settings.pieceType;
    }
    
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
      radio.checked = radio.value === settings.theme;
    });
    
    const sizeSelect = document.getElementById('piece-size');
    if (sizeSelect) {
      sizeSelect.value = settings.pieceSize;
    }
    
    const formatRadios = document.querySelectorAll('input[name="output-format"]');
    formatRadios.forEach(radio => {
      radio.checked = radio.value === settings.exportFormat;
    });
    
    // Update settings source display
    const settingsSource = document.getElementById('settings-source');
    if (settingsSource) {
      settingsSource.textContent = localStorage.getItem(this.options.settingsManager.storageKey) ? 
        'localStorage' : 'hardcoded defaults';
    }
    
    // Update the preview piece
    this.updatePiece();
  }
  
  /**
   * Update the preview piece based on current settings
   */
  async updatePiece() {
    const settings = this.options.settingsManager.settings;
    
    if (this.currentPiece) {
      await this.currentPiece.setOption('pieceType', settings.pieceType);
      await this.currentPiece.setOption('theme', settings.theme);
      await this.currentPiece.setOption('size', settings.pieceSize);
    }
    
    // Save settings
    this.options.settingsManager.saveSettings();
  }
  
  /**
   * Save the current piece as SVG or PNG
   */
  savePiece() {
    const settings = this.options.settingsManager.settings;
    const format = settings.exportFormat;
    const pieceType = settings.pieceType;
    const theme = settings.theme;
    
    if (format === 'svg') {
      // Export as SVG
      this.currentPiece.exportSVG()
        .then(svgString => {
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `chess_${pieceType}_${theme}.svg`;
          a.click();
          
          URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error exporting SVG:', error);
          this.showStatus('Error exporting SVG: ' + error.message, 'error');
        });
    } else {
      // Export as PNG
      this.currentPiece.exportAsPNG((pngUrl) => {
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `chess_${pieceType}_${theme}.png`;
        a.click();
      }, settings.exportScale || 2);
    }
  }
  
  /**
   * Save all chess pieces as a ZIP file
   */
  async saveAllPieces() {
    const settings = this.options.settingsManager.settings;
    const format = settings.exportFormat;
    const theme = settings.theme;
    
    // Check if JSZip is available
    if (typeof JSZip === 'undefined') {
      this.showStatus('JSZip library is not loaded. Cannot create ZIP file.', 'error');
      return;
    }
    
    // Create a new ZIP file
    const zip = new JSZip();
    const pieceTypes = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
    
    // Create a temporary SVG element
    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempSvg.setAttribute('width', '150');
    tempSvg.setAttribute('height', '150');
    document.body.appendChild(tempSvg);
    
    try {
      // Create a temporary piece
      const tempPiece = new ChessPiece(tempSvg, {
        pieceType: 'king',
        theme: theme,
        size: 150
      });
      
      // Add each piece to the ZIP
      for (const pieceType of pieceTypes) {
        await tempPiece.setOption('pieceType', pieceType);
        
        if (format === 'svg') {
          // Add SVG to ZIP
          const svgString = await tempPiece.exportSVG();
          zip.file(`chess_${pieceType}_${theme}.svg`, svgString);
        } else {
          // Add PNG to ZIP (using a Promise to handle the callback)
          await new Promise(resolve => {
            tempPiece.exportAsPNG((pngUrl) => {
              // Convert data URL to blob
              const byteString = atob(pngUrl.split(',')[1]);
              const mimeType = pngUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              
              const blob = new Blob([ab], { type: mimeType });
              zip.file(`chess_${pieceType}_${theme}.png`, blob);
              resolve();
            }, settings.exportScale || 2);
          });
        }
      }
      
      // Generate the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create a download link
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chess_pieces_${theme}.zip`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      this.showStatus('All pieces exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting pieces:', error);
      this.showStatus('Error exporting pieces: ' + error.message, 'error');
    } finally {
      // Clean up
      if (tempSvg.parentNode) {
        tempSvg.parentNode.removeChild(tempSvg);
      }
    }
  }
  
  /**
   * Copy the current piece's SVG to clipboard
   */
  copySVG() {
    this.currentPiece.exportSVG()
      .then(svgString => {
        // Copy to clipboard
        return navigator.clipboard.writeText(svgString);
      })
      .then(() => {
        this.showStatus('SVG copied to clipboard!', 'success');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        this.showStatus('Error copying to clipboard', 'error');
      });
  }
  
  /**
   * Save current settings
   */
  saveSettings() {
    const success = this.options.settingsManager.saveSettings();
    
    if (success) {
      this.showStatus('Settings saved successfully!', 'success');
      
      // Update settings source display
      const settingsSource = document.getElementById('settings-source');
      if (settingsSource) {
        settingsSource.textContent = 'localStorage';
      }
    } else {
      this.showStatus('Error saving settings', 'error');
    }
  }
  
  /**
   * Load settings from a file
   * @param {File} file - The settings file to load
   */
  loadSettings(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      const success = this.options.settingsManager.importSettings(json);
      
      if (success) {
        this.applySettings();
        this.showStatus('Settings loaded successfully!', 'success');
      } else {
        this.showStatus('Error loading settings: Invalid format', 'error');
      }
    };
    
    reader.readAsText(file);
  }
  
  /**
   * Create defaults.json file
   */
  async createDefaults() {
    const settings = this.options.settingsManager.settings;
    const json = JSON.stringify(settings, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'defaults.json';
    a.click();
    
    URL.revokeObjectURL(url);
    
    this.showStatus('Defaults file created!', 'success');
  }
  
  /**
   * Show a status message
   * @param {string} message - The message to show
   * @param {string} type - The type of message (info, success, warning, error)
   */
  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('settings-status');
    if (!statusElement) return;
    
    statusElement.textContent = message;
    statusElement.className = 'status-message';
    statusElement.classList.add(`status-${type}`);
    statusElement.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      statusElement.style.opacity = '0';
      setTimeout(() => {
        statusElement.style.display = 'none';
        statusElement.style.opacity = '1';
      }, 500);
    }, 3000);
  }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const settingsManager = new SettingsManager();
  const uiControls = new UIControls({ settingsManager });
});

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIControls;
}
