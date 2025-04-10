/**
 * UI Controls for Chess Pieces Generator
 * Handles the user interface for customizing chess pieces
 */

class UIControls {
  /**
   * Initialize the UI controls
   * @param {Object} options - Options for the UI
   * @param {boolean} skipInit - Skip initialization (for testing)
   */
  constructor(options = {}, skipInit = false) {
    // Default options
    this.defaultOptions = {
      containerSelector: '.chess-generator-container',
      previewSelector: '.chess-preview',
      boardSelector: '.chess-board',
      controlsSelector: '.chess-controls',
      piecesGallerySelector: '.pieces-gallery',
      statusMessageSelector: '.status-message'
    };
    
    // Merge provided options with defaults
    this.options = { ...this.defaultOptions, ...options };
    
    // Initialize settings manager
    this.settingsManager = new SettingsManager('chess-pieces-settings');
    
    // Initialize elements
    this.container = document.querySelector(this.options.containerSelector);
    this.previewContainer = document.querySelector(this.options.previewSelector);
    this.boardContainer = document.querySelector(this.options.boardSelector);
    this.controlsContainer = document.querySelector(this.options.controlsSelector);
    this.piecesGallery = document.querySelector(this.options.piecesGallerySelector);
    this.statusMessage = document.querySelector(this.options.statusMessageSelector);
    
    // Initialize chess board
    this.chessBoard = null;
    
    // Initialize individual piece previews
    this.piecePreviewElements = {};
    
    // Initialize the UI (unless skipped for testing)
    if (!skipInit) {
      this.init();
    }
  }
  
  /**
   * Initialize the UI
   */
  init() {
    // Create the board if it doesn't exist
    if (!this.boardContainer) {
      this.boardContainer = document.createElement('div');
      this.boardContainer.className = 'chess-board';
      this.previewContainer.appendChild(this.boardContainer);
    }
    
    // Create the chess board
    this.chessBoard = new ChessBoard(this.boardContainer, {
      boardSize: this.settingsManager.getSetting('board', 'size'),
      squareSize: this.settingsManager.getSetting('board', 'squareSize'),
      lightSquareColor: this.settingsManager.getSetting('board', 'lightSquareColor'),
      darkSquareColor: this.settingsManager.getSetting('board', 'darkSquareColor'),
      whitePieceColor: this.settingsManager.getSetting('pieces', 'whiteColor'),
      whitePieceBorder: this.settingsManager.getSetting('pieces', 'whiteBorderColor'),
      blackPieceColor: this.settingsManager.getSetting('pieces', 'blackColor'),
      blackPieceBorder: this.settingsManager.getSetting('pieces', 'blackBorderColor'),
      pieceSize: this.settingsManager.getSetting('pieces', 'size'),
      borderWidth: this.settingsManager.getSetting('pieces', 'borderWidth'),
      is3D: this.settingsManager.getSetting('pieces', 'is3D'),
      style: this.settingsManager.getSetting('pieces', 'style'),
      glowEnabled: this.settingsManager.getSetting('effects', 'glowEnabled'),
      glowColor: this.settingsManager.getSetting('effects', 'glowColor'),
      glowSize: this.settingsManager.getSetting('effects', 'glowSize'),
      shadowEnabled: this.settingsManager.getSetting('effects', 'shadowEnabled'),
      shadowColor: this.settingsManager.getSetting('effects', 'shadowColor'),
      shadowBlur: this.settingsManager.getSetting('effects', 'shadowBlur')
    });
    
    // Setup initial position
    this.chessBoard.setupInitialPosition();
    
    // Create the pieces gallery if it doesn't exist
    if (!this.piecesGallery) {
      this.piecesGallery = document.createElement('div');
      this.piecesGallery.className = 'pieces-gallery';
      this.previewContainer.appendChild(this.piecesGallery);
    }
    
    // Create individual piece previews
    this.createPiecePreviewElements();
    
    // Create the controls if they don't exist
    if (!this.controlsContainer) {
      this.controlsContainer = document.createElement('div');
      this.controlsContainer.className = 'chess-controls';
      this.container.appendChild(this.controlsContainer);
    }
    
    // Create the controls
    this.createControls();
    
    // Create the status message if it doesn't exist
    if (!this.statusMessage) {
      this.statusMessage = document.createElement('div');
      this.statusMessage.className = 'status-message';
      this.statusMessage.style.display = 'none';
      this.container.appendChild(this.statusMessage);
    }
  }
  
  /**
   * Create individual piece preview elements
   */
  createPiecePreviewElements() {
    // Clear the gallery
    this.piecesGallery.innerHTML = '';
    
    // Create previews for each piece type
    const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
    const colors = ['white', 'black'];
    
    pieceTypes.forEach(type => {
      colors.forEach(color => {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'piece-preview';
        
        const svgContainer = document.createElement('div');
        svgContainer.className = 'piece-svg-container';
        
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('aria-label', `${color} ${type}`);
        
        const pieceOptions = {
          pieceType: type,
          pieceColor: color,
          pieceColorValue: color === 'white' ? this.settingsManager.getSetting('pieces', 'whiteColor') : this.settingsManager.getSetting('pieces', 'blackColor'),
          borderColorValue: color === 'white' ? this.settingsManager.getSetting('pieces', 'whiteBorderColor') : this.settingsManager.getSetting('pieces', 'blackBorderColor'),
          size: this.settingsManager.getSetting('pieces', 'size'),
          borderWidth: this.settingsManager.getSetting('pieces', 'borderWidth'),
          is3D: this.settingsManager.getSetting('pieces', 'is3D'),
          style: this.settingsManager.getSetting('pieces', 'style'),
          glowEnabled: this.settingsManager.getSetting('effects', 'glowEnabled'),
          glowColor: this.settingsManager.getSetting('effects', 'glowColor'),
          glowSize: this.settingsManager.getSetting('effects', 'glowSize'),
          shadowEnabled: this.settingsManager.getSetting('effects', 'shadowEnabled'),
          shadowColor: this.settingsManager.getSetting('effects', 'shadowColor'),
          shadowBlur: this.settingsManager.getSetting('effects', 'shadowBlur')
        };
        
        const piece = new ChessPiece(svgElement, pieceOptions);
        svgContainer.appendChild(svgElement);
        
        const label = document.createElement('div');
        label.className = 'piece-label';
        label.textContent = `${color} ${type}`;
        
        previewContainer.appendChild(svgContainer);
        previewContainer.appendChild(label);
        
        this.piecesGallery.appendChild(previewContainer);
        
        // Store the piece reference
        this.piecePreviewElements[`${color}-${type}`] = piece;
      });
    });
  }
  
  /**
   * Create the controls
   */
  createControls() {
    // Clear the controls container
    this.controlsContainer.innerHTML = '';
    
    // Create the header
    const header = document.createElement('h2');
    header.className = 'controls-header';
    header.textContent = 'Customize Chess Pieces';
    this.controlsContainer.appendChild(header);
    
    // Create the board settings control group
    this.createBoardSettingsControls();
    
    // Create the piece settings control group
    this.createPieceSettingsControls();
    
    // Create the effects settings control group
    this.createEffectsSettingsControls();
    
    // Create the presets control group
    this.createPresetsControls();
    
    // Create the export control group
    this.createExportControls();
  }
  
  /**
   * Create board settings controls
   */
  createBoardSettingsControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    const title = document.createElement('h3');
    title.className = 'control-group-title';
    title.textContent = 'Board Settings';
    controlGroup.appendChild(title);
    
    // Light square color
    const lightSquareColorControl = this.createColorControl(
      'Light Square Color',
      this.settingsManager.getSetting('board', 'lightSquareColor'),
      (value) => {
        this.settingsManager.setSetting('board', 'lightSquareColor', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updateBoardColors(value, this.settingsManager.getSetting('board', 'darkSquareColor'));
      }
    );
    controlGroup.appendChild(lightSquareColorControl);
    
    // Dark square color
    const darkSquareColorControl = this.createColorControl(
      'Dark Square Color',
      this.settingsManager.getSetting('board', 'darkSquareColor'),
      (value) => {
        this.settingsManager.setSetting('board', 'darkSquareColor', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updateBoardColors(this.settingsManager.getSetting('board', 'lightSquareColor'), value);
      }
    );
    controlGroup.appendChild(darkSquareColorControl);
    
    // Board size
    const boardSizeControl = this.createRangeControl(
      'Board Size',
      this.settingsManager.getSetting('board', 'squareSize'),
      40,
      80,
      5,
      (value) => {
        this.settingsManager.setSetting('board', 'squareSize', parseInt(value));
        this.settingsManager.saveSettings();
        
        // Recreate the board with the new size
        this.init();
      }
    );
    controlGroup.appendChild(boardSizeControl);
    
    this.controlsContainer.appendChild(controlGroup);
  }
  
  /**
   * Create piece settings controls
   */
  createPieceSettingsControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    const title = document.createElement('h3');
    title.className = 'control-group-title';
    title.textContent = 'Piece Settings';
    controlGroup.appendChild(title);
    
    // White piece color
    const whitePieceColorControl = this.createColorControl(
      'White Piece Color',
      this.settingsManager.getSetting('pieces', 'whiteColor'),
      (value) => {
        this.settingsManager.setSetting('pieces', 'whiteColor', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updatePieceColors(
          value,
          this.settingsManager.getSetting('pieces', 'whiteBorderColor'),
          this.settingsManager.getSetting('pieces', 'blackColor'),
          this.settingsManager.getSetting('pieces', 'blackBorderColor')
        );
        this.updatePiecePreviewColors();
      }
    );
    controlGroup.appendChild(whitePieceColorControl);
    
    // White piece border color
    const whitePieceBorderColorControl = this.createColorControl(
      'White Piece Border',
      this.settingsManager.getSetting('pieces', 'whiteBorderColor'),
      (value) => {
        this.settingsManager.setSetting('pieces', 'whiteBorderColor', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updatePieceColors(
          this.settingsManager.getSetting('pieces', 'whiteColor'),
          value,
          this.settingsManager.getSetting('pieces', 'blackColor'),
          this.settingsManager.getSetting('pieces', 'blackBorderColor')
        );
        this.updatePiecePreviewColors();
      }
    );
    controlGroup.appendChild(whitePieceBorderColorControl);
    
    // Black piece color
    const blackPieceColorControl = this.createColorControl(
      'Black Piece Color',
      this.settingsManager.getSetting('pieces', 'blackColor'),
      (value) => {
        this.settingsManager.setSetting('pieces', 'blackColor', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updatePieceColors(
          this.settingsManager.getSetting('pieces', 'whiteColor'),
          this.settingsManager.getSetting('pieces', 'whiteBorderColor'),
          value,
          this.settingsManager.getSetting('pieces', 'blackBorderColor')
        );
        this.updatePiecePreviewColors();
      }
    );
    controlGroup.appendChild(blackPieceColorControl);
    
    // Black piece border color
    const blackPieceBorderColorControl = this.createColorControl(
      'Black Piece Border',
      this.settingsManager.getSetting('pieces', 'blackBorderColor'),
      (value) => {
        this.settingsManager.setSetting('pieces', 'blackBorderColor', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updatePieceColors(
          this.settingsManager.getSetting('pieces', 'whiteColor'),
          this.settingsManager.getSetting('pieces', 'whiteBorderColor'),
          this.settingsManager.getSetting('pieces', 'blackColor'),
          value
        );
        this.updatePiecePreviewColors();
      }
    );
    controlGroup.appendChild(blackPieceBorderColorControl);
    
    // Piece size
    const pieceSizeControl = this.createRangeControl(
      'Piece Size',
      this.settingsManager.getSetting('pieces', 'size'),
      30,
      70,
      5,
      (value) => {
        const newSize = parseInt(value);
        this.settingsManager.setSetting('pieces', 'size', newSize);
        this.settingsManager.saveSettings();
        
        // Update the CSS variable for piece size
        document.documentElement.style.setProperty('--piece-size', `${newSize}px`);
        
        // Update the size of all pieces on the board
        if (this.chessBoard && this.chessBoard.pieces) {
          // Update the board's pieceSize option
          this.chessBoard.options.pieceSize = newSize;
          
          // Resize each piece on the board
          this.chessBoard.pieces.forEach(pieceInfo => {
            if (pieceInfo && pieceInfo.piece && typeof pieceInfo.piece.resize === 'function') {
              pieceInfo.piece.resize(newSize);
            }
          });
        }
        
        // Update the size of all piece previews
        Object.values(this.piecePreviewElements).forEach(piece => {
          if (piece && typeof piece.resize === 'function') {
            piece.resize(newSize);
          }
        });
        
        // Show success message
        this.showStatusMessage(`Piece size updated to ${newSize}px`, 'success');
      }
    );
    controlGroup.appendChild(pieceSizeControl);
    
    // Border width
    const borderWidthControl = this.createRangeControl(
      'Border Width',
      this.settingsManager.getSetting('pieces', 'borderWidth'),
      1,
      5,
      1,
      (value) => {
        this.settingsManager.setSetting('pieces', 'borderWidth', parseInt(value));
        this.settingsManager.saveSettings();
        
        // Recreate the board with the new border width
        this.init();
      }
    );
    controlGroup.appendChild(borderWidthControl);
    
    // 3D effect
    const threeDEffectControl = this.createCheckboxControl(
      '3D Effect',
      this.settingsManager.getSetting('pieces', 'is3D'),
      (checked) => {
        this.settingsManager.setSetting('pieces', 'is3D', checked);
        this.settingsManager.saveSettings();
        this.chessBoard.toggle3DEffect(checked);
        this.updatePiecePreviewEffects();
      }
    );
    controlGroup.appendChild(threeDEffectControl);
    
    // Piece style
    const pieceStyleControl = this.createSelectControl(
      'Piece Style',
      this.settingsManager.getSetting('pieces', 'style'),
      [
        { value: 'classic', label: 'Classic' },
        { value: 'modern', label: 'Modern' },
        { value: 'minimalist', label: 'Minimalist' }
      ],
      (value) => {
        this.settingsManager.setSetting('pieces', 'style', value);
        this.settingsManager.saveSettings();
        this.chessBoard.updatePieceStyle(value);
        this.updatePiecePreviewStyles();
      }
    );
    controlGroup.appendChild(pieceStyleControl);
    
    this.controlsContainer.appendChild(controlGroup);
  }
  
  /**
   * Create effects settings controls
   */
  createEffectsSettingsControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    const title = document.createElement('h3');
    title.className = 'control-group-title';
    title.textContent = 'Effects Settings';
    controlGroup.appendChild(title);
    
    // Glow effect
    const glowEffectControl = this.createCheckboxControl(
      'Glow Effect',
      this.settingsManager.getSetting('effects', 'glowEnabled'),
      (checked) => {
        this.settingsManager.setSetting('effects', 'glowEnabled', checked);
        this.settingsManager.saveSettings();
        this.chessBoard.toggleGlowEffect(checked);
        this.updatePiecePreviewEffects();
      }
    );
    controlGroup.appendChild(glowEffectControl);
    
    // Glow color
    const glowColorControl = this.createColorControl(
      'Glow Color',
      this.settingsManager.getSetting('effects', 'glowColor'),
      (value) => {
        this.settingsManager.setSetting('effects', 'glowColor', value);
        this.settingsManager.saveSettings();
        
        // Recreate the board with the new glow color
        this.init();
      }
    );
    controlGroup.appendChild(glowColorControl);
    
    // Glow size
    const glowSizeControl = this.createRangeControl(
      'Glow Size',
      this.settingsManager.getSetting('effects', 'glowSize'),
      1,
      10,
      1,
      (value) => {
        this.settingsManager.setSetting('effects', 'glowSize', parseInt(value));
        this.settingsManager.saveSettings();
        
        // Recreate the board with the new glow size
        this.init();
      }
    );
    controlGroup.appendChild(glowSizeControl);
    
    // Shadow effect
    const shadowEffectControl = this.createCheckboxControl(
      'Shadow Effect',
      this.settingsManager.getSetting('effects', 'shadowEnabled'),
      (checked) => {
        this.settingsManager.setSetting('effects', 'shadowEnabled', checked);
        this.settingsManager.saveSettings();
        this.chessBoard.toggleShadowEffect(checked);
        this.updatePiecePreviewEffects();
      }
    );
    controlGroup.appendChild(shadowEffectControl);
    
    // Shadow blur
    const shadowBlurControl = this.createRangeControl(
      'Shadow Blur',
      this.settingsManager.getSetting('effects', 'shadowBlur'),
      1,
      10,
      1,
      (value) => {
        this.settingsManager.setSetting('effects', 'shadowBlur', parseInt(value));
        this.settingsManager.saveSettings();
        
        // Recreate the board with the new shadow blur
        this.init();
      }
    );
    controlGroup.appendChild(shadowBlurControl);
    
    this.controlsContainer.appendChild(controlGroup);
  }
  
  /**
   * Create presets controls
   */
  createPresetsControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    const title = document.createElement('h3');
    title.className = 'control-group-title';
    title.textContent = 'Presets';
    controlGroup.appendChild(title);
    
    // Color scheme presets
    const colorSchemeLabel = document.createElement('div');
    colorSchemeLabel.className = 'form-control-label';
    colorSchemeLabel.textContent = 'Color Schemes';
    controlGroup.appendChild(colorSchemeLabel);
    
    const colorSchemePresets = document.createElement('div');
    colorSchemePresets.className = 'preset-list';
    
    const colorSchemes = [
      { name: 'classic', label: 'Classic' },
      { name: 'modern', label: 'Modern' },
      { name: 'tournament', label: 'Tournament' },
      { name: 'colorful', label: 'Colorful' }
    ];
    
    colorSchemes.forEach(scheme => {
      const presetItem = document.createElement('div');
      presetItem.className = 'preset-item';
      presetItem.textContent = scheme.label;
      presetItem.addEventListener('click', () => {
        this.settingsManager.applyColorScheme(scheme.name);
        
        // Recreate the board with the new color scheme
        this.init();
        
        // Show success message
        this.showStatusMessage(`Applied ${scheme.label} color scheme`, 'success');
      });
      
      colorSchemePresets.appendChild(presetItem);
    });
    
    controlGroup.appendChild(colorSchemePresets);
    
    // User presets
    const userPresetsLabel = document.createElement('div');
    userPresetsLabel.className = 'form-control-label';
    userPresetsLabel.textContent = 'User Presets';
    controlGroup.appendChild(userPresetsLabel);
    
    const userPresets = document.createElement('div');
    userPresets.className = 'preset-list';
    
    // Get user presets
    const presets = this.settingsManager.getPresets();
    
    if (presets.length === 0) {
      const noPresets = document.createElement('div');
      noPresets.className = 'no-presets';
      noPresets.textContent = 'No saved presets';
      userPresets.appendChild(noPresets);
    } else {
      presets.forEach(preset => {
        const presetItem = document.createElement('div');
        presetItem.className = 'preset-item';
        presetItem.textContent = preset.name;
        
        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'preset-delete';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', `Delete ${preset.name} preset`);
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.settingsManager.deletePreset(preset.name);
          
          // Recreate the presets controls
          this.createPresetsControls();
          
          // Show success message
          this.showStatusMessage(`Deleted ${preset.name} preset`, 'success');
        });
        
        presetItem.appendChild(deleteButton);
        
        presetItem.addEventListener('click', () => {
          this.settingsManager.loadPreset(preset.name);
          
          // Recreate the board with the loaded preset
          this.init();
          
          // Show success message
          this.showStatusMessage(`Loaded ${preset.name} preset`, 'success');
        });
        
        userPresets.appendChild(presetItem);
      });
    }
    
    controlGroup.appendChild(userPresets);
    
    // Save preset button
    const savePresetControl = document.createElement('div');
    savePresetControl.className = 'form-control';
    
    const savePresetInput = document.createElement('input');
    savePresetInput.type = 'text';
    savePresetInput.placeholder = 'Preset name';
    savePresetControl.appendChild(savePresetInput);
    
    const savePresetButton = document.createElement('button');
    savePresetButton.className = 'btn btn-primary';
    savePresetButton.textContent = 'Save Preset';
    savePresetButton.addEventListener('click', () => {
      const presetName = savePresetInput.value.trim();
      
      if (presetName) {
        this.settingsManager.createPreset(presetName);
        
        // Clear the input
        savePresetInput.value = '';
        
        // Recreate the presets controls
        this.createPresetsControls();
        
        // Show success message
        this.showStatusMessage(`Saved preset: ${presetName}`, 'success');
      } else {
        // Show error message
        this.showStatusMessage('Please enter a preset name', 'error');
      }
    });
    savePresetControl.appendChild(savePresetButton);
    
    controlGroup.appendChild(savePresetControl);
    
    // Reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-reset';
    resetButton.textContent = 'Reset to Defaults';
    resetButton.addEventListener('click', () => {
      this.settingsManager.resetSettings();
      
      // Recreate the board with default settings
      this.init();
      
      // Show success message
      this.showStatusMessage('Reset to default settings', 'success');
    });
    
    controlGroup.appendChild(resetButton);
    
    this.controlsContainer.appendChild(controlGroup);
  }
  
  /**
   * Create export controls
   */
  createExportControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    const title = document.createElement('h3');
    title.className = 'control-group-title';
    title.textContent = 'Export';
    controlGroup.appendChild(title);
    
    // Output format selection
    const formatControl = document.createElement('div');
    formatControl.className = 'form-control';
    
    const formatLabel = document.createElement('div');
    formatLabel.className = 'form-control-label';
    formatLabel.textContent = 'Output Format';
    formatControl.appendChild(formatLabel);
    
    const formatOptions = document.createElement('div');
    formatOptions.className = 'radio-group';
    
    // SVG option
    const svgOption = document.createElement('label');
    const svgRadio = document.createElement('input');
    svgRadio.type = 'radio';
    svgRadio.name = 'output-format';
    svgRadio.value = 'svg';
    svgRadio.checked = true;
    svgOption.appendChild(svgRadio);
    svgOption.appendChild(document.createTextNode('SVG'));
    formatOptions.appendChild(svgOption);
    
    // PNG option
    const pngOption = document.createElement('label');
    const pngRadio = document.createElement('input');
    pngRadio.type = 'radio';
    pngRadio.name = 'output-format';
    pngRadio.value = 'png';
    pngOption.appendChild(pngRadio);
    pngOption.appendChild(document.createTextNode('PNG'));
    formatOptions.appendChild(pngOption);
    
    formatControl.appendChild(formatOptions);
    controlGroup.appendChild(formatControl);
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    
    // Export board as SVG/PNG
    const exportBoardButton = document.createElement('button');
    exportBoardButton.className = 'btn btn-export';
    exportBoardButton.textContent = 'Export Board';
    exportBoardButton.addEventListener('click', async () => {
      const format = document.querySelector('input[name="output-format"]:checked').value;
      
      if (format === 'svg') {
        const svgString = this.chessBoard.exportSVG();
        this.downloadFile(svgString, 'chess-board.svg', 'image/svg+xml');
        
        // Show success message
        this.showStatusMessage('Board exported as SVG', 'success');
      } else if (format === 'png') {
        try {
          const pngDataUrl = await this.chessBoard.exportPNG();
          this.downloadDataURL(pngDataUrl, 'chess-board.png');
          
          // Show success message
          this.showStatusMessage('Board exported as PNG', 'success');
        } catch (error) {
          console.error('Error exporting board as PNG:', error);
          
          // Show error message
          this.showStatusMessage('Error exporting board as PNG', 'error');
        }
      }
    });
    buttonGroup.appendChild(exportBoardButton);
    
    // Export all pieces
    const exportAllButton = document.createElement('button');
    exportAllButton.className = 'btn btn-export';
    exportAllButton.textContent = 'Export All Pieces';
    exportAllButton.addEventListener('click', async () => {
      try {
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
          throw new Error('JSZip library is not loaded. Make sure the JSZip script is included.');
        }
        
        // Create a new JSZip instance
        const zip = new JSZip();
        const format = document.querySelector('input[name="output-format"]:checked').value;
        
        // Store current board state
        const currentPieces = [...this.chessBoard.pieces];
        
        // Create an empty board
        this.chessBoard.clearBoard();
        
        // Export empty board
        if (format === 'svg') {
          const svgString = this.chessBoard.exportSVG();
          zip.file(`empty-board.svg`, svgString);
        } else if (format === 'png') {
          const pngDataUrl = await this.chessBoard.exportPNG();
          const pngBlob = await fetch(pngDataUrl).then(res => res.blob());
          zip.file(`empty-board.png`, pngBlob);
        }
        
        // Export individual pieces
        const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
        const colors = ['white', 'black'];
        
        // Create a temporary container for individual pieces
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);
        
        for (const type of pieceTypes) {
          for (const color of colors) {
            // Create SVG element for the piece
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            
            // Create piece options
            const pieceOptions = {
              pieceType: type,
              pieceColor: color,
              pieceColorValue: color === 'white' ? this.settingsManager.getSetting('pieces', 'whiteColor') : this.settingsManager.getSetting('pieces', 'blackColor'),
              borderColorValue: color === 'white' ? this.settingsManager.getSetting('pieces', 'whiteBorderColor') : this.settingsManager.getSetting('pieces', 'blackBorderColor'),
              size: this.settingsManager.getSetting('pieces', 'size'),
              borderWidth: this.settingsManager.getSetting('pieces', 'borderWidth'),
              is3D: this.settingsManager.getSetting('pieces', 'is3D'),
              style: this.settingsManager.getSetting('pieces', 'style'),
              glowEnabled: this.settingsManager.getSetting('effects', 'glowEnabled'),
              glowColor: this.settingsManager.getSetting('effects', 'glowColor'),
              glowSize: this.settingsManager.getSetting('effects', 'glowSize'),
              shadowEnabled: this.settingsManager.getSetting('effects', 'shadowEnabled'),
              shadowColor: this.settingsManager.getSetting('effects', 'shadowColor'),
              shadowBlur: this.settingsManager.getSetting('effects', 'shadowBlur')
            };
            
            // Create the piece
            const piece = new ChessPiece(svgElement, pieceOptions);
            tempContainer.appendChild(svgElement);
            
            // Export the piece
            if (format === 'svg') {
              const svgString = piece.exportSVG();
              zip.file(`${color}-${type}.svg`, svgString);
            } else if (format === 'png') {
              try {
                const pngDataUrl = await piece.exportPNG();
                const pngBlob = await fetch(pngDataUrl).then(res => res.blob());
                zip.file(`${color}-${type}.png`, pngBlob);
              } catch (error) {
                console.error(`Error exporting ${color} ${type} as PNG:`, error);
              }
            }
          }
        }
        
        // Clean up temporary container
        document.body.removeChild(tempContainer);
        
        // Add settings.json to the ZIP
        const settingsJson = this.settingsManager.exportSettings();
        zip.file('chess-pieces-settings.json', settingsJson);
        
        // Generate date string for filename (YYYYMMDD format)
        const date = new Date();
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        
        // Generate ZIP filename with format
        const zipFilename = `chess-pieces-${format.toUpperCase()}-${dateStr}.zip`;
        
        // Generate and download the zip file
        const content = await zip.generateAsync({type: 'blob'});
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = zipFilename;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        URL.revokeObjectURL(downloadLink.href);
        
        // Restore the original board state
        this.chessBoard.clearBoard();
        currentPieces.forEach(pieceInfo => {
          if (pieceInfo) {
            this.chessBoard.addPiece(pieceInfo.type, pieceInfo.color, pieceInfo.row, pieceInfo.col);
          }
        });
        
        // Show success message
        this.showStatusMessage(`All pieces exported as ${format.toUpperCase()} ZIP successfully`, 'success');
      } catch (error) {
        console.error('Error in Export All Pieces:', error);
        this.showStatusMessage(`Error exporting pieces: ${error.message}`, 'error');
      }
    });
    buttonGroup.appendChild(exportAllButton);
    
    // Export settings as JSON
    const exportSettingsButton = document.createElement('button');
    exportSettingsButton.className = 'btn btn-export';
    exportSettingsButton.textContent = 'Export Settings';
    exportSettingsButton.addEventListener('click', () => {
      const settingsJson = this.settingsManager.exportSettings();
      this.downloadFile(settingsJson, 'chess-pieces-settings.json', 'application/json');
      
      // Show success message
      this.showStatusMessage('Settings exported as JSON', 'success');
    });
    buttonGroup.appendChild(exportSettingsButton);
    
    // Import settings
    const importSettingsButton = document.createElement('button');
    importSettingsButton.className = 'btn btn-secondary';
    importSettingsButton.textContent = 'Import Settings';
    
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const settingsJson = e.target.result;
            const success = this.settingsManager.importSettings(settingsJson);
            
            if (success) {
              // Recreate the board with imported settings
              this.init();
              
              // Show success message
              this.showStatusMessage('Settings imported successfully', 'success');
            } else {
              // Show error message
              this.showStatusMessage('Error importing settings: Invalid format', 'error');
            }
          } catch (error) {
            console.error('Error importing settings:', error);
            
            // Show error message
            this.showStatusMessage('Error importing settings', 'error');
          }
        };
        
        reader.readAsText(file);
      }
    });
    
    importSettingsButton.addEventListener('click', () => {
      fileInput.click();
    });
    
    buttonGroup.appendChild(importSettingsButton);
    buttonGroup.appendChild(fileInput);
    
    controlGroup.appendChild(buttonGroup);
    
    this.controlsContainer.appendChild(controlGroup);
  }
  
  /**
   * Create a color control
   * @param {string} label - Label for the control
   * @param {string} value - Initial value
   * @param {Function} onChange - Callback for when the value changes
   * @returns {HTMLElement} The control element
   */
  createColorControl(label, value, onChange) {
    const control = document.createElement('div');
    control.className = 'form-control';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    control.appendChild(labelElement);
    
    const colorInputGroup = document.createElement('div');
    colorInputGroup.className = 'color-input-group';
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = value;
    colorInput.addEventListener('input', () => {
      textInput.value = colorInput.value;
      onChange(colorInput.value);
    });
    colorInputGroup.appendChild(colorInput);
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = value;
    textInput.addEventListener('input', () => {
      // Validate hex color
      if (/^#[0-9A-F]{6}$/i.test(textInput.value)) {
        colorInput.value = textInput.value;
        onChange(textInput.value);
      }
    });
    colorInputGroup.appendChild(textInput);
    
    control.appendChild(colorInputGroup);
    
    return control;
  }
  
  /**
   * Create a range control
   * @param {string} label - Label for the control
   * @param {number} value - Initial value
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {number} step - Step value
   * @param {Function} onChange - Callback for when the value changes
   * @returns {HTMLElement} The control element
   */
  createRangeControl(label, value, min, max, step, onChange) {
    const control = document.createElement('div');
    control.className = 'form-control';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    control.appendChild(labelElement);
    
    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.min = min;
    rangeInput.max = max;
    rangeInput.step = step;
    rangeInput.value = value;
    
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = value;
    valueDisplay.className = 'range-value';
    
    rangeInput.addEventListener('input', () => {
      valueDisplay.textContent = rangeInput.value;
      onChange(rangeInput.value);
    });
    
    labelElement.appendChild(valueDisplay);
    control.appendChild(rangeInput);
    
    return control;
  }
  
  /**
   * Create a checkbox control
   * @param {string} label - Label for the control
   * @param {boolean} checked - Whether the checkbox is checked
   * @param {Function} onChange - Callback for when the value changes
   * @returns {HTMLElement} The control element
   */
  createCheckboxControl(label, checked, onChange) {
    const control = document.createElement('div');
    control.className = 'form-control';
    
    const labelElement = document.createElement('label');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.addEventListener('change', () => {
      onChange(checkbox.checked);
    });
    
    labelElement.appendChild(checkbox);
    labelElement.appendChild(document.createTextNode(label));
    
    control.appendChild(labelElement);
    
    return control;
  }
  
  /**
   * Create a select control
   * @param {string} label - Label for the control
   * @param {string} value - Initial value
   * @param {Array} options - Array of options
   * @param {Function} onChange - Callback for when the value changes
   * @returns {HTMLElement} The control element
   */
  createSelectControl(label, value, options, onChange) {
    const control = document.createElement('div');
    control.className = 'form-control';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    control.appendChild(labelElement);
    
    const select = document.createElement('select');
    
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      
      if (option.value === value) {
        optionElement.selected = true;
      }
      
      select.appendChild(optionElement);
    });
    
    select.addEventListener('change', () => {
      onChange(select.value);
    });
    
    control.appendChild(select);
    
    return control;
  }
  
  /**
   * Update piece preview colors
   */
  updatePiecePreviewColors() {
    Object.keys(this.piecePreviewElements).forEach(key => {
      const [color, type] = key.split('-');
      const piece = this.piecePreviewElements[key];
      
      const options = {
        pieceColorValue: color === 'white' ? this.settingsManager.getSetting('pieces', 'whiteColor') : this.settingsManager.getSetting('pieces', 'blackColor'),
        borderColorValue: color === 'white' ? this.settingsManager.getSetting('pieces', 'whiteBorderColor') : this.settingsManager.getSetting('pieces', 'blackBorderColor')
      };
      
      piece.setOptions(options);
    });
  }
  
  /**
   * Update piece preview styles
   */
  updatePiecePreviewStyles() {
    Object.keys(this.piecePreviewElements).forEach(key => {
      const piece = this.piecePreviewElements[key];
      piece.setOption('style', this.settingsManager.getSetting('pieces', 'style'));
    });
  }
  
  /**
   * Update piece preview effects
   */
  updatePiecePreviewEffects() {
    Object.keys(this.piecePreviewElements).forEach(key => {
      const piece = this.piecePreviewElements[key];
      
      piece.setOption('is3D', this.settingsManager.getSetting('pieces', 'is3D'));
      piece.setOption('glowEnabled', this.settingsManager.getSetting('effects', 'glowEnabled'));
      piece.setOption('shadowEnabled', this.settingsManager.getSetting('effects', 'shadowEnabled'));
    });
  }
  
  /**
   * Show a status message
   * @param {string} message - Message to show
   * @param {string} type - Type of message (success, error, info)
   */
  showStatusMessage(message, type = 'info') {
    if (!this.statusMessage) {
      return;
    }
    
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message status-${type}`;
    this.statusMessage.style.display = 'block';
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      this.statusMessage.style.display = 'none';
    }, 3000);
  }
  
  /**
   * Download a file
   * @param {string} content - Content of the file
   * @param {string} filename - Name of the file
   * @param {string} contentType - Content type of the file
   */
  downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * Download a data URL
   * @param {string} dataUrl - Data URL
   * @param {string} filename - Name of the file
   */
  downloadDataURL(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIControls;
}
