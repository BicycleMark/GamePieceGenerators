/**
 * UI Controls for the Checker Pieces Generator
 * Handles the user interface for customizing checker pieces
 */
class UIControls {
  /**
   * Constructor for the UIControls class
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      boardContainerId: options.boardContainerId || 'board-container',
      controlsContainerId: options.controlsContainerId || 'controls-container',
      previewContainerId: options.previewContainerId || 'preview-container',
      exportContainerId: options.exportContainerId || 'export-container',
      settingsManager: options.settingsManager || new SettingsManager(),
      ...options
    };
    
    // Initialize properties
    this.board = null;
    this.previewPieces = {
      redRegular: null,
      redCrowned: null,
      blackRegular: null,
      blackCrowned: null
    };
    
    // Initialize UI
    this.init();
  }
  
  /**
   * Initialize the UI
   */
  init() {
    // Get container elements
    this.boardContainer = document.getElementById(this.options.boardContainerId);
    this.controlsContainer = document.getElementById(this.options.controlsContainerId);
    this.previewContainer = document.getElementById(this.options.previewContainerId);
    this.exportContainer = document.getElementById(this.options.exportContainerId);
    
    if (!this.boardContainer || !this.controlsContainer || !this.previewContainer || !this.exportContainer) {
      console.error('One or more container elements not found');
      return;
    }
    
    // Create the board
    this.createBoard();
    
    // Create the controls
    this.createControls();
    
    // Create the preview pieces
    this.createPreviewPieces();
    
    // Create the export controls
    this.createExportControls();
    
    // Apply initial settings
    this.applySettings();
  }
  
  /**
   * Create the checker board
   */
  createBoard() {
    // Clear the container
    this.boardContainer.innerHTML = '';
    
    // Create a div for the board
    const boardElement = document.createElement('div');
    boardElement.className = 'checker-board';
    this.boardContainer.appendChild(boardElement);
    
    // Create the board
    this.board = new CheckerBoard(boardElement, this.options.settingsManager.settings);
    
    // Set up the initial position
    this.board.setupInitialPosition();
  }
  
  /**
   * Create the control panels
   */
  createControls() {
    // Clear the container
    this.controlsContainer.innerHTML = '';
    
    // Create the main controls container
    const controlsElement = document.createElement('div');
    controlsElement.className = 'generator-controls';
    
    // Board settings
    const boardSettings = this.createBoardSettings();
    controlsElement.appendChild(boardSettings);
    
    // Red piece settings
    const redPieceSettings = this.createPieceSettings('red');
    controlsElement.appendChild(redPieceSettings);
    
    // Black piece settings
    const blackPieceSettings = this.createPieceSettings('black');
    controlsElement.appendChild(blackPieceSettings);
    
    // Crown settings
    const crownSettings = this.createCrownSettings();
    controlsElement.appendChild(crownSettings);
    
    // Effects settings
    const effectsSettings = this.createEffectsSettings();
    controlsElement.appendChild(effectsSettings);
    
    // Preset controls
    const presetControls = this.createPresetControls();
    controlsElement.appendChild(presetControls);
    
    // Add the controls to the container
    this.controlsContainer.appendChild(controlsElement);
    
    // Add event listeners
    this.addControlEventListeners();
  }
  
  /**
   * Create board settings controls
   * @returns {HTMLElement} - The board settings element
   */
  createBoardSettings() {
    const settings = this.options.settingsManager.settings;
    
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const title = document.createElement('h3');
    title.textContent = 'Board Settings';
    container.appendChild(title);
    
    // Light square color
    const lightSquareItem = document.createElement('div');
    lightSquareItem.className = 'control-item';
    
    const lightSquareLabel = document.createElement('label');
    lightSquareLabel.textContent = 'Light Square Color';
    lightSquareLabel.setAttribute('for', 'light-square-color');
    
    const lightSquareInput = document.createElement('input');
    lightSquareInput.type = 'color';
    lightSquareInput.id = 'light-square-color';
    lightSquareInput.className = 'color-picker';
    lightSquareInput.value = settings.lightSquareColor;
    
    lightSquareItem.appendChild(lightSquareLabel);
    lightSquareItem.appendChild(lightSquareInput);
    container.appendChild(lightSquareItem);
    
    // Dark square color
    const darkSquareItem = document.createElement('div');
    darkSquareItem.className = 'control-item';
    
    const darkSquareLabel = document.createElement('label');
    darkSquareLabel.textContent = 'Dark Square Color';
    darkSquareLabel.setAttribute('for', 'dark-square-color');
    
    const darkSquareInput = document.createElement('input');
    darkSquareInput.type = 'color';
    darkSquareInput.id = 'dark-square-color';
    darkSquareInput.className = 'color-picker';
    darkSquareInput.value = settings.darkSquareColor;
    
    darkSquareItem.appendChild(darkSquareLabel);
    darkSquareItem.appendChild(darkSquareInput);
    container.appendChild(darkSquareItem);
    
    // Board size
    const boardSizeItem = document.createElement('div');
    boardSizeItem.className = 'control-item';
    
    const boardSizeLabel = document.createElement('label');
    boardSizeLabel.textContent = 'Board Size';
    boardSizeLabel.setAttribute('for', 'board-size');
    
    const boardSizeSelect = document.createElement('select');
    boardSizeSelect.id = 'board-size';
    
    const boardSizes = [8, 10, 12];
    boardSizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = `${size}x${size}`;
      if (size === settings.boardSize) {
        option.selected = true;
      }
      boardSizeSelect.appendChild(option);
    });
    
    boardSizeItem.appendChild(boardSizeLabel);
    boardSizeItem.appendChild(boardSizeSelect);
    container.appendChild(boardSizeItem);
    
    // Square size
    const squareSizeItem = document.createElement('div');
    squareSizeItem.className = 'control-item';
    
    const squareSizeLabel = document.createElement('label');
    squareSizeLabel.textContent = 'Square Size (px)';
    squareSizeLabel.setAttribute('for', 'square-size');
    
    const squareSizeInput = document.createElement('input');
    squareSizeInput.type = 'range';
    squareSizeInput.id = 'square-size';
    squareSizeInput.className = 'slider-control';
    squareSizeInput.min = '40';
    squareSizeInput.max = '120';
    squareSizeInput.step = '10';
    squareSizeInput.value = settings.squareSize;
    
    const squareSizeValue = document.createElement('span');
    squareSizeValue.id = 'square-size-value';
    squareSizeValue.textContent = settings.squareSize;
    
    squareSizeItem.appendChild(squareSizeLabel);
    squareSizeItem.appendChild(squareSizeInput);
    squareSizeItem.appendChild(squareSizeValue);
    container.appendChild(squareSizeItem);
    
    return container;
  }
  
  /**
   * Create piece settings controls
   * @param {string} type - The type of piece ('red' or 'black')
   * @returns {HTMLElement} - The piece settings element
   */
  createPieceSettings(type) {
    const settings = this.options.settingsManager.settings;
    const titleText = type === 'red' ? 'Red Piece Settings' : 'Black Piece Settings';
    const colorKey = type === 'red' ? 'redPieceColor' : 'blackPieceColor';
    const borderKey = type === 'red' ? 'redPieceBorderColor' : 'blackPieceBorderColor';
    
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const title = document.createElement('h3');
    title.textContent = titleText;
    container.appendChild(title);
    
    // Piece color
    const pieceColorItem = document.createElement('div');
    pieceColorItem.className = 'control-item';
    
    const pieceColorLabel = document.createElement('label');
    pieceColorLabel.textContent = 'Piece Color';
    pieceColorLabel.setAttribute('for', `${type}-piece-color`);
    
    const pieceColorInput = document.createElement('input');
    pieceColorInput.type = 'color';
    pieceColorInput.id = `${type}-piece-color`;
    pieceColorInput.className = 'color-picker';
    pieceColorInput.value = settings[colorKey];
    
    pieceColorItem.appendChild(pieceColorLabel);
    pieceColorItem.appendChild(pieceColorInput);
    container.appendChild(pieceColorItem);
    
    // Border color
    const borderColorItem = document.createElement('div');
    borderColorItem.className = 'control-item';
    
    const borderColorLabel = document.createElement('label');
    borderColorLabel.textContent = 'Border Color';
    borderColorLabel.setAttribute('for', `${type}-border-color`);
    
    const borderColorInput = document.createElement('input');
    borderColorInput.type = 'color';
    borderColorInput.id = `${type}-border-color`;
    borderColorInput.className = 'color-picker';
    borderColorInput.value = settings[borderKey];
    
    borderColorItem.appendChild(borderColorLabel);
    borderColorItem.appendChild(borderColorInput);
    container.appendChild(borderColorItem);
    
    return container;
  }
  
  /**
   * Create crown settings controls
   * @returns {HTMLElement} - The crown settings element
   */
  createCrownSettings() {
    const settings = this.options.settingsManager.settings;
    
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const title = document.createElement('h3');
    title.textContent = 'Crown Settings';
    container.appendChild(title);
    
    // Crown color
    const crownColorItem = document.createElement('div');
    crownColorItem.className = 'control-item';
    
    const crownColorLabel = document.createElement('label');
    crownColorLabel.textContent = 'Crown Color';
    crownColorLabel.setAttribute('for', 'crown-color');
    
    const crownColorInput = document.createElement('input');
    crownColorInput.type = 'color';
    crownColorInput.id = 'crown-color';
    crownColorInput.className = 'color-picker';
    crownColorInput.value = settings.crownColor;
    
    crownColorItem.appendChild(crownColorLabel);
    crownColorItem.appendChild(crownColorInput);
    container.appendChild(crownColorItem);
    
    // Crown border color
    const crownBorderItem = document.createElement('div');
    crownBorderItem.className = 'control-item';
    
    const crownBorderLabel = document.createElement('label');
    crownBorderLabel.textContent = 'Crown Border Color';
    crownBorderLabel.setAttribute('for', 'crown-border-color');
    
    const crownBorderInput = document.createElement('input');
    crownBorderInput.type = 'color';
    crownBorderInput.id = 'crown-border-color';
    crownBorderInput.className = 'color-picker';
    crownBorderInput.value = settings.crownBorderColor;
    
    crownBorderItem.appendChild(crownBorderLabel);
    crownBorderItem.appendChild(crownBorderInput);
    container.appendChild(crownBorderItem);
    
    // Crown style
    const crownStyleItem = document.createElement('div');
    crownStyleItem.className = 'control-item';
    
    const crownStyleLabel = document.createElement('label');
    crownStyleLabel.textContent = 'Crown Style';
    crownStyleLabel.setAttribute('for', 'crown-style');
    
    const crownStyleSelect = document.createElement('select');
    crownStyleSelect.id = 'crown-style';
    
    const crownStyles = [
      { value: 'classic', text: 'Classic Crown' },
      { value: 'star', text: 'Star' },
      { value: 'symbol', text: 'K Symbol' }
    ];
    
    crownStyles.forEach(style => {
      const option = document.createElement('option');
      option.value = style.value;
      option.textContent = style.text;
      if (style.value === settings.crownStyle) {
        option.selected = true;
      }
      crownStyleSelect.appendChild(option);
    });
    
    crownStyleItem.appendChild(crownStyleLabel);
    crownStyleItem.appendChild(crownStyleSelect);
    container.appendChild(crownStyleItem);
    
    return container;
  }
  
  /**
   * Create effects settings controls
   * @returns {HTMLElement} - The effects settings element
   */
  createEffectsSettings() {
    const settings = this.options.settingsManager.settings;
    
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const title = document.createElement('h3');
    title.textContent = 'Effects Settings';
    container.appendChild(title);
    
    // 3D effect
    const is3DItem = document.createElement('div');
    is3DItem.className = 'control-item';
    
    const is3DLabel = document.createElement('label');
    is3DLabel.textContent = '3D Effect';
    is3DLabel.setAttribute('for', 'is-3d');
    
    const is3DInput = document.createElement('input');
    is3DInput.type = 'checkbox';
    is3DInput.id = 'is-3d';
    is3DInput.checked = settings.is3D;
    
    is3DItem.appendChild(is3DLabel);
    is3DItem.appendChild(is3DInput);
    container.appendChild(is3DItem);
    
    // Border width
    const borderWidthItem = document.createElement('div');
    borderWidthItem.className = 'control-item';
    
    const borderWidthLabel = document.createElement('label');
    borderWidthLabel.textContent = 'Border Width';
    borderWidthLabel.setAttribute('for', 'border-width');
    
    const borderWidthInput = document.createElement('input');
    borderWidthInput.type = 'range';
    borderWidthInput.id = 'border-width';
    borderWidthInput.className = 'slider-control';
    borderWidthInput.min = '0';
    borderWidthInput.max = '10';
    borderWidthInput.step = '1';
    borderWidthInput.value = settings.borderWidth;
    
    const borderWidthValue = document.createElement('span');
    borderWidthValue.id = 'border-width-value';
    borderWidthValue.textContent = settings.borderWidth;
    
    borderWidthItem.appendChild(borderWidthLabel);
    borderWidthItem.appendChild(borderWidthInput);
    borderWidthItem.appendChild(borderWidthValue);
    container.appendChild(borderWidthItem);
    
    // Glow effect
    const glowItem = document.createElement('div');
    glowItem.className = 'control-item';
    
    const glowLabel = document.createElement('label');
    glowLabel.textContent = 'Glow Effect';
    glowLabel.setAttribute('for', 'glow-enabled');
    
    const glowInput = document.createElement('input');
    glowInput.type = 'checkbox';
    glowInput.id = 'glow-enabled';
    glowInput.checked = settings.glowEnabled;
    
    glowItem.appendChild(glowLabel);
    glowItem.appendChild(glowInput);
    container.appendChild(glowItem);
    
    // Glow size
    const glowSizeItem = document.createElement('div');
    glowSizeItem.className = 'control-item';
    glowSizeItem.style.display = settings.glowEnabled ? 'block' : 'none';
    
    const glowSizeLabel = document.createElement('label');
    glowSizeLabel.textContent = 'Glow Size';
    glowSizeLabel.setAttribute('for', 'glow-size');
    
    const glowSizeInput = document.createElement('input');
    glowSizeInput.type = 'range';
    glowSizeInput.id = 'glow-size';
    glowSizeInput.className = 'slider-control';
    glowSizeInput.min = '1';
    glowSizeInput.max = '20';
    glowSizeInput.step = '1';
    glowSizeInput.value = settings.glowSize;
    
    const glowSizeValue = document.createElement('span');
    glowSizeValue.id = 'glow-size-value';
    glowSizeValue.textContent = settings.glowSize;
    
    glowSizeItem.appendChild(glowSizeLabel);
    glowSizeItem.appendChild(glowSizeInput);
    glowSizeItem.appendChild(glowSizeValue);
    container.appendChild(glowSizeItem);
    
    return container;
  }
  
  /**
   * Create preset controls
   * @returns {HTMLElement} - The preset controls element
   */
  createPresetControls() {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const title = document.createElement('h3');
    title.textContent = 'Presets';
    container.appendChild(title);
    
    // Preset selection
    const presetItem = document.createElement('div');
    presetItem.className = 'control-item';
    
    const presetLabel = document.createElement('label');
    presetLabel.textContent = 'Load Preset';
    presetLabel.setAttribute('for', 'preset-select');
    
    const presetSelect = document.createElement('select');
    presetSelect.id = 'preset-select';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Preset --';
    presetSelect.appendChild(defaultOption);
    
    // Add presets from settings manager
    const presets = this.options.settingsManager.getPresets();
    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.name;
      option.textContent = preset.name;
      presetSelect.appendChild(option);
    });
    
    presetItem.appendChild(presetLabel);
    presetItem.appendChild(presetSelect);
    container.appendChild(presetItem);
    
    // Save preset
    const savePresetItem = document.createElement('div');
    savePresetItem.className = 'control-item';
    
    const savePresetLabel = document.createElement('label');
    savePresetLabel.textContent = 'Save Current Settings as Preset';
    savePresetLabel.setAttribute('for', 'preset-name');
    
    const savePresetInput = document.createElement('input');
    savePresetInput.type = 'text';
    savePresetInput.id = 'preset-name';
    savePresetInput.placeholder = 'Preset Name';
    
    const savePresetButton = document.createElement('button');
    savePresetButton.id = 'save-preset';
    savePresetButton.textContent = 'Save Preset';
    savePresetButton.className = 'export-button';
    
    savePresetItem.appendChild(savePresetLabel);
    savePresetItem.appendChild(savePresetInput);
    savePresetItem.appendChild(savePresetButton);
    container.appendChild(savePresetItem);
    
    // Reset to defaults
    const resetItem = document.createElement('div');
    resetItem.className = 'control-item';
    
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-settings';
    resetButton.textContent = 'Reset to Defaults';
    resetButton.className = 'export-button secondary';
    
    resetItem.appendChild(resetButton);
    container.appendChild(resetItem);
    
    return container;
  }
  
  /**
   * Create preview pieces
   */
  createPreviewPieces() {
    // Clear the container
    this.previewContainer.innerHTML = '';
    
    // Create the preview section
    const previewSection = document.createElement('div');
    previewSection.className = 'preview-section';
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'preview-title';
    title.textContent = 'Piece Preview';
    previewSection.appendChild(title);
    
    // Create the pieces preview container
    const piecesPreview = document.createElement('div');
    piecesPreview.className = 'pieces-preview';
    
    // Create red regular piece
    const redRegularContainer = document.createElement('div');
    redRegularContainer.className = 'piece-preview-container';
    
    const redRegularSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    redRegularSvg.id = 'red-regular-preview';
    redRegularSvg.setAttribute('width', '80');
    redRegularSvg.setAttribute('height', '80');
    
    const redRegularLabel = document.createElement('div');
    redRegularLabel.className = 'piece-label';
    redRegularLabel.textContent = 'Red Piece';
    
    redRegularContainer.appendChild(redRegularSvg);
    redRegularContainer.appendChild(redRegularLabel);
    piecesPreview.appendChild(redRegularContainer);
    
    // Create red crowned piece
    const redCrownedContainer = document.createElement('div');
    redCrownedContainer.className = 'piece-preview-container';
    
    const redCrownedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    redCrownedSvg.id = 'red-crowned-preview';
    redCrownedSvg.setAttribute('width', '80');
    redCrownedSvg.setAttribute('height', '80');
    
    const redCrownedLabel = document.createElement('div');
    redCrownedLabel.className = 'piece-label';
    redCrownedLabel.textContent = 'Red King';
    
    redCrownedContainer.appendChild(redCrownedSvg);
    redCrownedContainer.appendChild(redCrownedLabel);
    piecesPreview.appendChild(redCrownedContainer);
    
    // Create black regular piece
    const blackRegularContainer = document.createElement('div');
    blackRegularContainer.className = 'piece-preview-container';
    
    const blackRegularSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    blackRegularSvg.id = 'black-regular-preview';
    blackRegularSvg.setAttribute('width', '80');
    blackRegularSvg.setAttribute('height', '80');
    
    const blackRegularLabel = document.createElement('div');
    blackRegularLabel.className = 'piece-label';
    blackRegularLabel.textContent = 'Black Piece';
    
    blackRegularContainer.appendChild(blackRegularSvg);
    blackRegularContainer.appendChild(blackRegularLabel);
    piecesPreview.appendChild(blackRegularContainer);
    
    // Create black crowned piece
    const blackCrownedContainer = document.createElement('div');
    blackCrownedContainer.className = 'piece-preview-container';
    
    const blackCrownedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    blackCrownedSvg.id = 'black-crowned-preview';
    blackCrownedSvg.setAttribute('width', '80');
    blackCrownedSvg.setAttribute('height', '80');
    
    const blackCrownedLabel = document.createElement('div');
    blackCrownedLabel.className = 'piece-label';
    blackCrownedLabel.textContent = 'Black King';
    
    blackCrownedContainer.appendChild(blackCrownedSvg);
    blackCrownedContainer.appendChild(blackCrownedLabel);
    piecesPreview.appendChild(blackCrownedContainer);
    
    // Add the pieces preview to the section
    previewSection.appendChild(piecesPreview);
    
    // Add the preview section to the container
    this.previewContainer.appendChild(previewSection);
    
    // Initialize the preview pieces
    this.initPreviewPieces();
  }
  
  /**
   * Initialize the preview pieces
   */
  initPreviewPieces() {
    const settings = this.options.settingsManager.settings;
    
    // Red regular piece
    const redRegularSvg = document.getElementById('red-regular-preview');
    this.previewPieces.redRegular = new CheckerPiece(redRegularSvg, {
      pieceColor: settings.redPieceColor,
      borderColor: settings.redPieceBorderColor,
      size: 80,
      borderWidth: settings.borderWidth,
      is3D: settings.is3D,
      isCrowned: false,
      glowEnabled: settings.glowEnabled,
      glowColor: settings.glowColor,
      glowSize: settings.glowSize
    });
    
    // Red crowned piece
    const redCrownedSvg = document.getElementById('red-crowned-preview');
    this.previewPieces.redCrowned = new CheckerPiece(redCrownedSvg, {
      pieceColor: settings.redPieceColor,
      borderColor: settings.redPieceBorderColor,
      crownColor: settings.crownColor,
      crownBorderColor: settings.crownBorderColor,
      size: 80,
      borderWidth: settings.borderWidth,
      is3D: settings.is3D,
      isCrowned: true,
      crownStyle: settings.crownStyle,
      glowEnabled: settings.glowEnabled,
      glowColor: settings.glowColor,
      glowSize: settings.glowSize
    });
    
    // Black regular piece
    const blackRegularSvg = document.getElementById('black-regular-preview');
    this.previewPieces.blackRegular = new CheckerPiece(blackRegularSvg, {
      pieceColor: settings.blackPieceColor,
      borderColor: settings.blackPieceBorderColor,
      size: 80,
      borderWidth: settings.borderWidth,
      is3D: settings.is3D,
      isCrowned: false,
      glowEnabled: settings.glowEnabled,
      glowColor: settings.glowColor,
      glowSize: settings.glowSize
    });
    
    // Black crowned piece
    const blackCrownedSvg = document.getElementById('black-crowned-preview');
    this.previewPieces.blackCrowned = new CheckerPiece(blackCrownedSvg, {
      pieceColor: settings.blackPieceColor,
      borderColor: settings.blackPieceBorderColor,
      crownColor: settings.crownColor,
      crownBorderColor: settings.crownBorderColor,
      size: 80,
      borderWidth: settings.borderWidth,
      is3D: settings.is3D,
      isCrowned: true,
      crownStyle: settings.crownStyle,
      glowEnabled: settings.glowEnabled,
      glowColor: settings.glowColor,
      glowSize: settings.glowSize
    });
  }
  
  /**
   * Create export controls
   */
  createExportControls() {
    // Clear the container
    this.exportContainer.innerHTML = '';
    
    // Create the export controls container
    const exportControls = document.createElement('div');
    exportControls.className = 'export-controls';
    
    // Export individual pieces
    const exportPiecesButton = document.createElement('button');
    exportPiecesButton.id = 'export-pieces';
    exportPiecesButton.className = 'export-button';
    exportPiecesButton.textContent = 'Export Individual Pieces';
    exportControls.appendChild(exportPiecesButton);
    
    // Export complete set
    const exportSetButton = document.createElement('button');
    exportSetButton.id = 'export-set';
    exportSetButton.className = 'export-button';
    exportSetButton.textContent = 'Export Complete Set';
    exportControls.appendChild(exportSetButton);
    
    // Export board
    const exportBoardButton = document.createElement('button');
    exportBoardButton.id = 'export-board';
    exportBoardButton.className = 'export-button';
    exportBoardButton.textContent = 'Export Board';
    exportControls.appendChild(exportBoardButton);
    
    // Export settings
    const exportSettingsButton = document.createElement('button');
    exportSettingsButton.id = 'export-settings';
    exportSettingsButton.className = 'export-button secondary';
    exportSettingsButton.textContent = 'Export Settings';
    exportControls.appendChild(exportSettingsButton);
    
    // Import settings
    const importSettingsButton = document.createElement('button');
    importSettingsButton.id = 'import-settings';
    importSettingsButton.className = 'export-button secondary';
    importSettingsButton.textContent = 'Import Settings';
    exportControls.appendChild(importSettingsButton);
    
    // Add the export controls to the container
    this.exportContainer.appendChild(exportControls);
    
    // Add event listeners
    this.addExportEventListeners();
  }
  
  /**
   * Add event listeners to the controls
   */
  addControlEventListeners() {
    const settingsManager = this.options.settingsManager;
    
    // Board settings
    document.getElementById('light-square-color').addEventListener('input', (e) => {
      settingsManager.setSetting('lightSquareColor', e.target.value);
      this.updateBoard();
    });
    
    document.getElementById('dark-square-color').addEventListener('input', (e) => {
      settingsManager.setSetting('darkSquareColor', e.target.value);
      this.updateBoard();
    });
    
    document.getElementById('board-size').addEventListener('change', (e) => {
      settingsManager.setSetting('boardSize', parseInt(e.target.value));
      this.recreateBoard();
    });
    
    document.getElementById('square-size').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      document.getElementById('square-size-value').textContent = value;
      settingsManager.setSetting('squareSize', value);
      this.updateBoard();
    });
    
    // Red piece settings
    document.getElementById('red-piece-color').addEventListener('input', (e) => {
      settingsManager.setSetting('redPieceColor', e.target.value);
      this.updatePieces();
    });
    
    document.getElementById('red-border-color').addEventListener('input', (e) => {
      settingsManager.setSetting('redPieceBorderColor', e.target.value);
      this.updatePieces();
    });
    
    // Black piece settings
    document.getElementById('black-piece-color').addEventListener('input', (e) => {
      settingsManager.setSetting('blackPieceColor', e.target.value);
      this.updatePieces();
    });
    
    document.getElementById('black-border-color').addEventListener('input', (e) => {
      settingsManager.setSetting('blackPieceBorderColor', e.target.value);
      this.updatePieces();
    });
    
    // Crown settings
    document.getElementById('crown-color').addEventListener('input', (e) => {
      settingsManager.setSetting('crownColor', e.target.value);
      this.updatePieces();
    });
    
    document.getElementById('crown-border-color').addEventListener('input', (e) => {
      settingsManager.setSetting('crownBorderColor', e.target.value);
      this.updatePieces();
    });
    
    document.getElementById('crown-style').addEventListener('change', (e) => {
      settingsManager.setSetting('crownStyle', e.target.value);
      this.updatePieces();
    });
    
    // Effects settings
    document.getElementById('is-3d').addEventListener('change', (e) => {
      settingsManager.setSetting('is3D', e.target.checked);
      this.updatePieces();
    });
    
    document.getElementById('border-width').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      document.getElementById('border-width-value').textContent = value;
      settingsManager.setSetting('borderWidth', value);
      this.updatePieces();
    });
    
    document.getElementById('glow-enabled').addEventListener('change', (e) => {
      const enabled = e.target.checked;
      settingsManager.setSetting('glowEnabled', enabled);
      document.getElementById('glow-size').parentElement.style.display = enabled ? 'block' : 'none';
      this.updatePieces();
    });
    
    document.getElementById('glow-size').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      document.getElementById('glow-size-value').textContent = value;
      settingsManager.setSetting('glowSize', value);
      this.updatePieces();
    });
    
    // Preset controls
    document.getElementById('preset-select').addEventListener('change', (e) => {
      const presetName = e.target.value;
      if (presetName) {
        settingsManager.loadPreset(presetName);
        this.applySettings();
        e.target.value = ''; // Reset select
      }
    });
    
    document.getElementById('save-preset').addEventListener('click', () => {
      const presetName = document.getElementById('preset-name').value.trim();
      if (presetName) {
        settingsManager.createPreset(presetName);
        this.updatePresetSelect();
        document.getElementById('preset-name').value = '';
      } else {
        alert('Please enter a preset name');
      }
    });
    
    document.getElementById('reset-settings').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all settings to defaults?')) {
        settingsManager.resetSettings();
        this.applySettings();
      }
    });
  }
  
  /**
   * Add event listeners to the export controls
   */
  addExportEventListeners() {
    // Export individual pieces
    document.getElementById('export-pieces').addEventListener('click', () => {
      this.exportIndividualPieces();
    });
    
    // Export complete set
    document.getElementById('export-set').addEventListener('click', () => {
      this.exportCompleteSet();
    });
    
    // Export board
    document.getElementById('export-board').addEventListener('click', () => {
      this.exportBoard();
    });
    
    // Export settings
    document.getElementById('export-settings').addEventListener('click', () => {
      this.exportSettings();
    });
    
    // Import settings
    document.getElementById('import-settings').addEventListener('click', () => {
      this.importSettings();
    });
  }
  
  /**
   * Apply settings to all components
   */
  applySettings() {
    const settings = this.options.settingsManager.settings;
    
    // Update form controls
    document.getElementById('light-square-color').value = settings.lightSquareColor;
    document.getElementById('dark-square-color').value = settings.darkSquareColor;
    document.getElementById('board-size').value = settings.boardSize;
    document.getElementById('square-size').value = settings.squareSize;
    document.getElementById('square-size-value').textContent = settings.squareSize;
    
    document.getElementById('red-piece-color').value = settings.redPieceColor;
    document.getElementById('red-border-color').value = settings.redPieceBorderColor;
    document.getElementById('black-piece-color').value = settings.blackPieceColor;
    document.getElementById('black-border-color').value = settings.blackPieceBorderColor;
    
    document.getElementById('crown-color').value = settings.crownColor;
    document.getElementById('crown-border-color').value = settings.crownBorderColor;
    document.getElementById('crown-style').value = settings.crownStyle;
    
    document.getElementById('is-3d').checked = settings.is3D;
    document.getElementById('border-width').value = settings.borderWidth;
    document.getElementById('border-width-value').textContent = settings.borderWidth;
    document.getElementById('glow-enabled').checked = settings.glowEnabled;
    document.getElementById('glow-size').value = settings.glowSize;
    document.getElementById('glow-size-value').textContent = settings.glowSize;
    document.getElementById('glow-size').parentElement.style.display = settings.glowEnabled ? 'block' : 'none';
    
    // Update board and pieces
    this.recreateBoard();
    this.updatePreviewPieces();
  }
  
  /**
   * Update the board based on current settings
   */
  updateBoard() {
    const settings = this.options.settingsManager.settings;
    
    // Update board colors
    this.board.updateBoardColors(settings.lightSquareColor, settings.darkSquareColor);
    
    // Update piece colors
    this.board.updatePieceColors(
      settings.redPieceColor,
      settings.redPieceBorderColor,
      settings.blackPieceColor,
      settings.blackPieceBorderColor
    );
    
    // Save settings
    this.options.settingsManager.saveSettings();
  }
  
  /**
   * Recreate the board (for changes that require a full rebuild)
   */
  recreateBoard() {
    this.createBoard();
    this.updateBoard();
  }
  
  /**
   * Update all pieces based on current settings
   */
  updatePieces() {
    const settings = this.options.settingsManager.settings;
    
    // Update board pieces
    this.board.updatePieceColors(
      settings.redPieceColor,
      settings.redPieceBorderColor,
      settings.blackPieceColor,
      settings.blackPieceBorderColor
    );
    
    // Update preview pieces
    this.updatePreviewPieces();
    
    // Save settings
    this.options.settingsManager.saveSettings();
  }
  
  /**
   * Update the preview pieces based on current settings
   */
  updatePreviewPieces() {
    const settings = this.options.settingsManager.settings;
    
    // Red regular piece
    this.previewPieces.redRegular.setOption('pieceColor', settings.redPieceColor);
    this.previewPieces.redRegular.setOption('borderColor', settings.redPieceBorderColor);
    this.previewPieces.redRegular.setOption('borderWidth', settings.borderWidth);
    this.previewPieces.redRegular.setOption('is3D', settings.is3D);
    this.previewPieces.redRegular.setOption('glowEnabled', settings.glowEnabled);
    this.previewPieces.redRegular.setOption('glowSize', settings.glowSize);
    
    // Red crowned piece
    this.previewPieces.redCrowned.setOption('pieceColor', settings.redPieceColor);
    this.previewPieces.redCrowned.setOption('borderColor', settings.redPieceBorderColor);
    this.previewPieces.redCrowned.setOption('crownColor', settings.crownColor);
    this.previewPieces.redCrowned.setOption('crownBorderColor', settings.crownBorderColor);
    this.previewPieces.redCrowned.setOption('borderWidth', settings.borderWidth);
    this.previewPieces.redCrowned.setOption('is3D', settings.is3D);
    this.previewPieces.redCrowned.setOption('crownStyle', settings.crownStyle);
    this.previewPieces.redCrowned.setOption('glowEnabled', settings.glowEnabled);
    this.previewPieces.redCrowned.setOption('glowSize', settings.glowSize);
    
    // Black regular piece
    this.previewPieces.blackRegular.setOption('pieceColor', settings.blackPieceColor);
    this.previewPieces.blackRegular.setOption('borderColor', settings.blackPieceBorderColor);
    this.previewPieces.blackRegular.setOption('borderWidth', settings.borderWidth);
    this.previewPieces.blackRegular.setOption('is3D', settings.is3D);
    this.previewPieces.blackRegular.setOption('glowEnabled', settings.glowEnabled);
    this.previewPieces.blackRegular.setOption('glowSize', settings.glowSize);
    
    // Black crowned piece
    this.previewPieces.blackCrowned.setOption('pieceColor', settings.blackPieceColor);
    this.previewPieces.blackCrowned.setOption('borderColor', settings.blackPieceBorderColor);
    this.previewPieces.blackCrowned.setOption('crownColor', settings.crownColor);
    this.previewPieces.blackCrowned.setOption('crownBorderColor', settings.crownBorderColor);
    this.previewPieces.blackCrowned.setOption('borderWidth', settings.borderWidth);
    this.previewPieces.blackCrowned.setOption('is3D', settings.is3D);
    this.previewPieces.blackCrowned.setOption('crownStyle', settings.crownStyle);
    this.previewPieces.blackCrowned.setOption('glowEnabled', settings.glowEnabled);
    this.previewPieces.blackCrowned.setOption('glowSize', settings.glowSize);
  }
  
  /**
   * Update the preset select dropdown
   */
  updatePresetSelect() {
    const presetSelect = document.getElementById('preset-select');
    
    // Clear existing options (except the default)
    while (presetSelect.options.length > 1) {
      presetSelect.remove(1);
    }
    
    // Add presets from settings manager
    const presets = this.options.settingsManager.getPresets();
    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.name;
      option.textContent = preset.name;
      presetSelect.appendChild(option);
    });
  }
  
  /**
   * Export individual pieces as SVG or PNG
   */
  exportIndividualPieces() {
    const settings = this.options.settingsManager.settings;
    const format = settings.exportFormat;
    
    // Create a container for the export UI
    const container = document.createElement('div');
    container.className = 'export-dialog';
    container.innerHTML = `
      <h2>Export Individual Pieces</h2>
      <p>Click on a piece to download it.</p>
      <div class="export-pieces-grid">
        <div class="export-piece-item">
          <div id="export-red-regular" class="export-piece-preview"></div>
          <div class="export-piece-label">Red Piece</div>
          <button class="export-button" data-piece="red-regular">Download ${format.toUpperCase()}</button>
        </div>
        <div class="export-piece-item">
          <div id="export-red-crowned" class="export-piece-preview"></div>
          <div class="export-piece-label">Red King</div>
          <button class="export-button" data-piece="red-crowned">Download ${format.toUpperCase()}</button>
        </div>
        <div class="export-piece-item">
          <div id="export-black-regular" class="export-piece-preview"></div>
          <div class="export-piece-label">Black Piece</div>
          <button class="export-button" data-piece="black-regular">Download ${format.toUpperCase()}</button>
        </div>
        <div class="export-piece-item">
          <div id="export-black-crowned" class="export-piece-preview"></div>
          <div class="export-piece-label">Black King</div>
          <button class="export-button" data-piece="black-crowned">Download ${format.toUpperCase()}</button>
        </div>
      </div>
      <div class="export-format-toggle">
        <label>
          <input type="radio" name="export-format" value="svg" ${format === 'svg' ? 'checked' : ''}>
          SVG
        </label>
        <label>
          <input type="radio" name="export-format" value="png" ${format === 'png' ? 'checked' : ''}>
          PNG
        </label>
      </div>
      <button class="export-button secondary" id="close-export-dialog">Close</button>
    `;
    
    // Add the container to the page
    document.body.appendChild(container);
    
    // Create the preview pieces
    const redRegular = new CheckerPiece(
      document.getElementById('export-red-regular'),
      {
        pieceColor: settings.redPieceColor,
        borderColor: settings.redPieceBorderColor,
        size: 80,
        borderWidth: settings.borderWidth,
        is3D: settings.is3D,
        isCrowned: false,
        glowEnabled: settings.glowEnabled,
        glowSize: settings.glowSize
      }
    );
    
    const redCrowned = new CheckerPiece(
      document.getElementById('export-red-crowned'),
      {
        pieceColor: settings.redPieceColor,
        borderColor: settings.redPieceBorderColor,
        crownColor: settings.crownColor,
        crownBorderColor: settings.crownBorderColor,
        size: 80,
        borderWidth: settings.borderWidth,
        is3D: settings.is3D,
        isCrowned: true,
        crownStyle: settings.crownStyle,
        glowEnabled: settings.glowEnabled,
        glowSize: settings.glowSize
      }
    );
    
    const blackRegular = new CheckerPiece(
      document.getElementById('export-black-regular'),
      {
        pieceColor: settings.blackPieceColor,
        borderColor: settings.blackPieceBorderColor,
        size: 80,
        borderWidth: settings.borderWidth,
        is3D: settings.is3D,
        isCrowned: false,
        glowEnabled: settings.glowEnabled,
        glowSize: settings.glowSize
      }
    );
    
    const blackCrowned = new CheckerPiece(
      document.getElementById('export-black-crowned'),
      {
        pieceColor: settings.blackPieceColor,
        borderColor: settings.blackPieceBorderColor,
        crownColor: settings.crownColor,
        crownBorderColor: settings.crownBorderColor,
        size: 80,
        borderWidth: settings.borderWidth,
        is3D: settings.is3D,
        isCrowned: true,
        crownStyle: settings.crownStyle,
        glowEnabled: settings.glowEnabled,
        glowSize: settings.glowSize
      }
    );
    
    // Add event listeners for the export buttons
    const exportButtons = container.querySelectorAll('[data-piece]');
    exportButtons.forEach(button => {
      button.addEventListener('click', () => {
        const pieceType = button.getAttribute('data-piece');
        let piece;
        
        switch (pieceType) {
          case 'red-regular':
            piece = redRegular;
            break;
          case 'red-crowned':
            piece = redCrowned;
            break;
          case 'black-regular':
            piece = blackRegular;
            break;
          case 'black-crowned':
            piece = blackCrowned;
            break;
        }
        
        if (piece) {
          const format = document.querySelector('input[name="export-format"]:checked').value;
          this.downloadPiece(piece, pieceType, format);
        }
      });
    });
    
    // Add event listener for format change
    const formatRadios = container.querySelectorAll('input[name="export-format"]');
    formatRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.options.settingsManager.setSetting('exportFormat', e.target.value);
        this.options.settingsManager.saveSettings();
        
        // Update button text
        const format = e.target.value.toUpperCase();
        exportButtons.forEach(button => {
          button.textContent = `Download ${format}`;
        });
      });
    });
    
    // Add event listener for close button
    document.getElementById('close-export-dialog').addEventListener('click', () => {
      document.body.removeChild(container);
    });
  }
  
  /**
   * Download a piece as SVG or PNG
   * @param {CheckerPiece} piece - The piece to download
   * @param {string} name - The name for the file
   * @param {string} format - The format ('svg' or 'png')
   */
  downloadPiece(piece, name, format) {
    if (format === 'svg') {
      // Download as SVG
      const svgString = piece.exportSVG();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.svg`;
      a.click();
      
      URL.revokeObjectURL(url);
    } else {
      // Download as PNG
      piece.exportAsPNG((pngUrl) => {
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${name}.png`;
        a.click();
      }, this.options.settingsManager.settings.exportScale);
    }
  }
  
  /**
   * Export a complete set of pieces as a ZIP file
   */
  exportCompleteSet() {
    alert('Export Complete Set functionality will be implemented in a future version.');
    // This would require the JSZip library to be included
  }
  
  /**
   * Export the current board as SVG
   */
  exportBoard() {
    const svgString = this.board.exportSVG();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checker-board.svg';
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * Export settings as JSON
   */
  exportSettings() {
    const settingsJson = this.options.settingsManager.exportSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checker-pieces-settings.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * Import settings from JSON
   */
  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target.result;
          const success = this.options.settingsManager.importSettings(json);
          
          if (success) {
            this.applySettings();
            alert('Settings imported successfully');
          } else {
            alert('Failed to import settings. Invalid format.');
          }
        };
        reader.readAsText(file);
      }
    });
    
    input.click();
  }
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIControls;
}
