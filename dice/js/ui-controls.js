/**
 * Dice Generator UI Controls
 * Handles user interface for customizing dice
 */

class UIControls {
  /**
   * Initialize UI controls
   * @param {DiceRenderer} diceRenderer - The dice renderer
   * @param {SettingsManager} settingsManager - The settings manager
   */
  constructor(diceRenderer, settingsManager) {
    this.diceRenderer = diceRenderer;
    this.settingsManager = settingsManager;
    
    // UI elements
    this.elements = {
      // Dice type
      diceType: document.getElementById('dice-type'),
      
      // Appearance
      diceColor: document.getElementById('dice-color'),
      pipColor: document.getElementById('pip-color'),
      materialType: document.getElementById('material-type'),
      pipStyle: document.getElementById('pip-style'),
      diceSize: document.getElementById('dice-size'),
      diceSizeValue: document.getElementById('dice-size-value'),
      roundness: document.getElementById('roundness'),
      roundnessValue: document.getElementById('roundness-value'),
      
      // Animation
      animationSpeed: document.getElementById('animation-speed'),
      animationSpeedValue: document.getElementById('animation-speed-value'),
      friction: document.getElementById('friction'),
      frictionValue: document.getElementById('friction-value'),
      bounciness: document.getElementById('bounciness'),
      bouncinessValue: document.getElementById('bounciness-value'),
      
      // Camera
      cameraAngle: document.getElementById('camera-angle'),
      cameraAngleValue: document.getElementById('camera-angle-value'),
      cameraDistance: document.getElementById('camera-distance'),
      cameraDistanceValue: document.getElementById('camera-distance-value'),
      autoRotate: document.getElementById('auto-rotate'),
      
      // Lighting
      lightIntensity: document.getElementById('light-intensity'),
      lightIntensityValue: document.getElementById('light-intensity-value'),
      shadows: document.getElementById('shadows'),
      
      // Export
      exportFormat: document.getElementById('export-format'),
      exportQuality: document.getElementById('export-quality'),
      exportQualityValue: document.getElementById('export-quality-value'),
      transparent: document.getElementById('transparent'),
      
      // Buttons
      rollButton: document.getElementById('roll-button'),
      stopButton: document.getElementById('stop-button'),
      resetButton: document.getElementById('reset-button'),
      addDieButton: document.getElementById('add-die-button'),
      clearDiceButton: document.getElementById('clear-dice-button'),
      
      // Export buttons
      exportSVGButton: document.getElementById('export-svg-button'),
      exportPNGButton: document.getElementById('export-png-button'),
      exportGIFButton: document.getElementById('export-gif-button'),
      
      // Presets
      presetsList: document.getElementById('presets-list'),
      savePresetButton: document.getElementById('save-preset-button'),
      presetNameInput: document.getElementById('preset-name'),
      
      // Color schemes
      colorSchemeSelect: document.getElementById('color-scheme')
    };
    
    this.init();
  }
  
  /**
   * Initialize UI controls
   */
  init() {
    this.setupEventListeners();
    this.populateSelectOptions();
    this.updateUIFromSettings();
    this.createInitialDice();
  }
  
  /**
   * Set up event listeners for UI controls
   */
  setupEventListeners() {
    // Dice type
    if (this.elements.diceType) {
      this.elements.diceType.addEventListener('change', () => {
        this.settingsManager.setSetting('dice', 'type', this.elements.diceType.value);
        this.updateDice();
      });
    }
    
    // Appearance
    if (this.elements.diceColor) {
      this.elements.diceColor.addEventListener('input', () => {
        this.settingsManager.setSetting('dice', 'color', this.elements.diceColor.value);
        this.updateDice();
      });
    }
    
    if (this.elements.pipColor) {
      this.elements.pipColor.addEventListener('input', () => {
        this.settingsManager.setSetting('dice', 'pipColor', this.elements.pipColor.value);
        this.updateDice();
      });
    }
    
    if (this.elements.materialType) {
      this.elements.materialType.addEventListener('change', () => {
        this.settingsManager.setSetting('dice', 'material', this.elements.materialType.value);
        this.updateDice();
      });
    }
    
    if (this.elements.pipStyle) {
      this.elements.pipStyle.addEventListener('change', () => {
        this.settingsManager.setSetting('dice', 'pipStyle', this.elements.pipStyle.value);
        this.updateDice();
      });
    }
    
    if (this.elements.diceSize) {
      this.elements.diceSize.addEventListener('input', () => {
        const size = parseInt(this.elements.diceSize.value);
        this.settingsManager.setSetting('dice', 'size', size);
        if (this.elements.diceSizeValue) {
          this.elements.diceSizeValue.textContent = size;
        }
        this.updateDice();
      });
    }
    
    if (this.elements.roundness) {
      this.elements.roundness.addEventListener('input', () => {
        const roundness = parseInt(this.elements.roundness.value);
        this.settingsManager.setSetting('dice', 'roundness', roundness);
        if (this.elements.roundnessValue) {
          this.elements.roundnessValue.textContent = roundness;
        }
        this.updateDice();
      });
    }
    
    // Animation
    if (this.elements.animationSpeed) {
      this.elements.animationSpeed.addEventListener('input', () => {
        const speed = parseFloat(this.elements.animationSpeed.value);
        this.settingsManager.setSetting('animation', 'speed', speed);
        if (this.elements.animationSpeedValue) {
          this.elements.animationSpeedValue.textContent = speed.toFixed(1);
        }
      });
    }
    
    if (this.elements.friction) {
      this.elements.friction.addEventListener('input', () => {
        const friction = parseFloat(this.elements.friction.value);
        this.settingsManager.setSetting('animation', 'friction', friction);
        if (this.elements.frictionValue) {
          this.elements.frictionValue.textContent = friction.toFixed(1);
        }
        this.updateDice();
      });
    }
    
    if (this.elements.bounciness) {
      this.elements.bounciness.addEventListener('input', () => {
        const bounciness = parseFloat(this.elements.bounciness.value);
        this.settingsManager.setSetting('animation', 'bounciness', bounciness);
        if (this.elements.bouncinessValue) {
          this.elements.bouncinessValue.textContent = bounciness.toFixed(1);
        }
        this.updateDice();
      });
    }
    
    // Camera
    if (this.elements.cameraAngle) {
      this.elements.cameraAngle.addEventListener('input', () => {
        const angle = parseInt(this.elements.cameraAngle.value);
        this.settingsManager.setSetting('camera', 'angle', angle);
        if (this.elements.cameraAngleValue) {
          this.elements.cameraAngleValue.textContent = angle;
        }
        this.updateCamera();
      });
    }
    
    if (this.elements.cameraDistance) {
      this.elements.cameraDistance.addEventListener('input', () => {
        const distance = parseInt(this.elements.cameraDistance.value);
        this.settingsManager.setSetting('camera', 'distance', distance);
        if (this.elements.cameraDistanceValue) {
          this.elements.cameraDistanceValue.textContent = distance;
        }
        this.updateCamera();
      });
    }
    
    if (this.elements.autoRotate) {
      this.elements.autoRotate.addEventListener('change', () => {
        const autoRotate = this.elements.autoRotate.checked;
        this.settingsManager.setSetting('camera', 'autoRotate', autoRotate);
        this.updateCamera();
      });
    }
    
    // Lighting
    if (this.elements.lightIntensity) {
      this.elements.lightIntensity.addEventListener('input', () => {
        const intensity = parseFloat(this.elements.lightIntensity.value);
        this.settingsManager.setSetting('lighting', 'intensity', intensity);
        if (this.elements.lightIntensityValue) {
          this.elements.lightIntensityValue.textContent = intensity.toFixed(1);
        }
        this.updateLighting();
      });
    }
    
    if (this.elements.shadows) {
      this.elements.shadows.addEventListener('change', () => {
        const shadows = this.elements.shadows.checked;
        this.settingsManager.setSetting('lighting', 'shadows', shadows);
        this.updateLighting();
      });
    }
    
    // Export
    if (this.elements.exportFormat) {
      this.elements.exportFormat.addEventListener('change', () => {
        this.settingsManager.setSetting('export', 'format', this.elements.exportFormat.value);
      });
    }
    
    if (this.elements.exportQuality) {
      this.elements.exportQuality.addEventListener('input', () => {
        const quality = parseFloat(this.elements.exportQuality.value);
        this.settingsManager.setSetting('export', 'quality', quality);
        if (this.elements.exportQualityValue) {
          this.elements.exportQualityValue.textContent = quality.toFixed(1);
        }
      });
    }
    
    if (this.elements.transparent) {
      this.elements.transparent.addEventListener('change', () => {
        const transparent = this.elements.transparent.checked;
        this.settingsManager.setSetting('export', 'transparent', transparent);
      });
    }
    
    // Buttons
    if (this.elements.rollButton) {
      this.elements.rollButton.addEventListener('click', () => {
        this.rollDice();
      });
    }
    
    if (this.elements.stopButton) {
      this.elements.stopButton.addEventListener('click', () => {
        this.stopAnimation();
      });
    }
    
    if (this.elements.resetButton) {
      this.elements.resetButton.addEventListener('click', () => {
        this.resetSettings();
      });
    }
    
    if (this.elements.addDieButton) {
      this.elements.addDieButton.addEventListener('click', () => {
        this.addDie();
      });
    }
    
    if (this.elements.clearDiceButton) {
      this.elements.clearDiceButton.addEventListener('click', () => {
        this.clearDice();
      });
    }
    
    // Export buttons
    if (this.elements.exportSVGButton) {
      this.elements.exportSVGButton.addEventListener('click', () => {
        this.exportSVG();
      });
    }
    
    if (this.elements.exportPNGButton) {
      this.elements.exportPNGButton.addEventListener('click', () => {
        this.exportPNG();
      });
    }
    
    if (this.elements.exportGIFButton) {
      this.elements.exportGIFButton.addEventListener('click', () => {
        this.exportGIF();
      });
    }
    
    // Presets
    if (this.elements.savePresetButton) {
      this.elements.savePresetButton.addEventListener('click', () => {
        this.savePreset();
      });
    }
    
    // Color schemes
    if (this.elements.colorSchemeSelect) {
      this.elements.colorSchemeSelect.addEventListener('change', () => {
        this.applyColorScheme(this.elements.colorSchemeSelect.value);
      });
    }
    
    // Save settings when window is closed
    window.addEventListener('beforeunload', () => {
      this.settingsManager.saveSettings();
    });
  }
  
  /**
   * Populate select options from settings manager
   */
  populateSelectOptions() {
    // Populate material types
    if (this.elements.materialType) {
      // Clear existing options first
      this.elements.materialType.innerHTML = '';
      
      // Add options from settings manager
      this.settingsManager.materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material.id;
        option.textContent = material.name;
        this.elements.materialType.appendChild(option);
      });
    }
    
    // Populate pip styles
    if (this.elements.pipStyle) {
      // Clear existing options first
      this.elements.pipStyle.innerHTML = '';
      
      // Add options from settings manager
      this.settingsManager.pipStyles.forEach(style => {
        const option = document.createElement('option');
        option.value = style.id;
        option.textContent = style.name;
        this.elements.pipStyle.appendChild(option);
      });
    }
    
    // Populate color schemes
    if (this.elements.colorSchemeSelect) {
      Object.keys(this.settingsManager.colorSchemes).forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme;
        option.textContent = scheme.charAt(0).toUpperCase() + scheme.slice(1);
        this.elements.colorSchemeSelect.appendChild(option);
      });
    }
    
    // Populate presets
    this.updatePresetsList();
  }
  
  /**
   * Update UI controls from settings
   */
  updateUIFromSettings() {
    // Dice type
    if (this.elements.diceType) {
      this.elements.diceType.value = this.settingsManager.getSetting('dice', 'type');
    }
    
    // Appearance
    if (this.elements.diceColor) {
      this.elements.diceColor.value = this.settingsManager.getSetting('dice', 'color');
    }
    
    if (this.elements.pipColor) {
      this.elements.pipColor.value = this.settingsManager.getSetting('dice', 'pipColor');
    }
    
    if (this.elements.materialType) {
      this.elements.materialType.value = this.settingsManager.getSetting('dice', 'material');
    }
    
    if (this.elements.pipStyle) {
      this.elements.pipStyle.value = this.settingsManager.getSetting('dice', 'pipStyle');
    }
    
    if (this.elements.diceSize) {
      const size = this.settingsManager.getSetting('dice', 'size');
      this.elements.diceSize.value = size;
      if (this.elements.diceSizeValue) {
        this.elements.diceSizeValue.textContent = size;
      }
    }
    
    if (this.elements.roundness) {
      const roundness = this.settingsManager.getSetting('dice', 'roundness');
      this.elements.roundness.value = roundness;
      if (this.elements.roundnessValue) {
        this.elements.roundnessValue.textContent = roundness;
      }
    }
    
    // Animation
    if (this.elements.animationSpeed) {
      const speed = this.settingsManager.getSetting('animation', 'speed');
      this.elements.animationSpeed.value = speed;
      if (this.elements.animationSpeedValue) {
        this.elements.animationSpeedValue.textContent = speed.toFixed(1);
      }
    }
    
    if (this.elements.friction) {
      const friction = this.settingsManager.getSetting('animation', 'friction');
      this.elements.friction.value = friction;
      if (this.elements.frictionValue) {
        this.elements.frictionValue.textContent = friction.toFixed(1);
      }
    }
    
    if (this.elements.bounciness) {
      const bounciness = this.settingsManager.getSetting('animation', 'bounciness');
      this.elements.bounciness.value = bounciness;
      if (this.elements.bouncinessValue) {
        this.elements.bouncinessValue.textContent = bounciness.toFixed(1);
      }
    }
    
    // Camera
    if (this.elements.cameraAngle) {
      const angle = this.settingsManager.getSetting('camera', 'angle');
      this.elements.cameraAngle.value = angle;
      if (this.elements.cameraAngleValue) {
        this.elements.cameraAngleValue.textContent = angle;
      }
    }
    
    if (this.elements.cameraDistance) {
      const distance = this.settingsManager.getSetting('camera', 'distance');
      this.elements.cameraDistance.value = distance;
      if (this.elements.cameraDistanceValue) {
        this.elements.cameraDistanceValue.textContent = distance;
      }
    }
    
    if (this.elements.autoRotate) {
      this.elements.autoRotate.checked = this.settingsManager.getSetting('camera', 'autoRotate');
    }
    
    // Lighting
    if (this.elements.lightIntensity) {
      const intensity = this.settingsManager.getSetting('lighting', 'intensity');
      this.elements.lightIntensity.value = intensity;
      if (this.elements.lightIntensityValue) {
        this.elements.lightIntensityValue.textContent = intensity.toFixed(1);
      }
    }
    
    if (this.elements.shadows) {
      this.elements.shadows.checked = this.settingsManager.getSetting('lighting', 'shadows');
    }
    
    // Export
    if (this.elements.exportFormat) {
      this.elements.exportFormat.value = this.settingsManager.getSetting('export', 'format');
    }
    
    if (this.elements.exportQuality) {
      const quality = this.settingsManager.getSetting('export', 'quality');
      this.elements.exportQuality.value = quality;
      if (this.elements.exportQualityValue) {
        this.elements.exportQualityValue.textContent = quality.toFixed(1);
      }
    }
    
    if (this.elements.transparent) {
      this.elements.transparent.checked = this.settingsManager.getSetting('export', 'transparent');
    }
  }
  
  /**
   * Create initial dice
   */
  createInitialDice() {
    // Create a single die with current settings
    this.addDie();
  }
  
  /**
   * Update dice with current settings
   */
  updateDice() {
    // Update all dice with current settings
    const diceOptions = {
      type: this.settingsManager.getSetting('dice', 'type'),
      size: this.settingsManager.getSetting('dice', 'size'),
      color: this.settingsManager.getSetting('dice', 'color'),
      material: this.settingsManager.getSetting('dice', 'material'),
      pipColor: this.settingsManager.getSetting('dice', 'pipColor'),
      pipStyle: this.settingsManager.getSetting('dice', 'pipStyle'),
      borderWidth: this.settingsManager.getSetting('dice', 'borderWidth'),
      borderColor: this.settingsManager.getSetting('dice', 'borderColor'),
      roundness: this.settingsManager.getSetting('dice', 'roundness'),
      texture: this.settingsManager.getSetting('dice', 'texture'),
      friction: this.settingsManager.getSetting('animation', 'friction'),
      restitution: this.settingsManager.getSetting('animation', 'bounciness')
    };
    
    this.diceRenderer.dice.forEach(die => {
      die.updateOptions(diceOptions);
    });
    
    // Save settings
    this.settingsManager.saveSettings();
  }
  
  /**
   * Update camera with current settings
   */
  updateCamera() {
    const angle = this.settingsManager.getSetting('camera', 'angle');
    const distance = this.settingsManager.getSetting('camera', 'distance');
    const autoRotate = this.settingsManager.getSetting('camera', 'autoRotate');
    
    // Convert angle to radians
    const angleRad = angle * (Math.PI / 180);
    
    // Calculate camera position
    const x = Math.sin(angleRad) * distance;
    const y = distance / 2;
    const z = Math.cos(angleRad) * distance;
    
    // Update camera position
    this.diceRenderer.camera.position.set(x, y, z);
    this.diceRenderer.camera.lookAt(0, 0, 0);
    
    // Update controls
    this.diceRenderer.controls.autoRotate = autoRotate;
    
    // Save settings
    this.settingsManager.saveSettings();
  }
  
  /**
   * Update lighting with current settings
   */
  updateLighting() {
    const intensity = this.settingsManager.getSetting('lighting', 'intensity');
    const shadows = this.settingsManager.getSetting('lighting', 'shadows');
    
    // Update ambient light
    this.diceRenderer.ambientLight.intensity = intensity * 0.4;
    
    // Update directional light
    this.diceRenderer.directionalLight.intensity = intensity * 0.8;
    this.diceRenderer.directionalLight.castShadow = shadows;
    
    // Update front light
    this.diceRenderer.frontLight.intensity = intensity * 0.3;
    
    // Update renderer shadow map
    this.diceRenderer.renderer.shadowMap.enabled = shadows;
    
    // Save settings
    this.settingsManager.saveSettings();
  }
  
  /**
   * Roll dice with current settings
   */
  rollDice() {
    const speed = this.settingsManager.getSetting('animation', 'speed');
    const duration = this.settingsManager.getSetting('animation', 'rollTime');
    
    this.diceRenderer.rollDice({
      force: speed * 5,
      torque: speed * 10,
      duration: duration
    });
  }
  
  /**
   * Stop dice animation
   */
  stopAnimation() {
    this.diceRenderer.stopAnimation();
  }
  
  /**
   * Reset settings to defaults
   */
  resetSettings() {
    this.settingsManager.resetSettings();
    this.updateUIFromSettings();
    this.updateDice();
    this.updateCamera();
    this.updateLighting();
  }
  
  /**
   * Add a new die to the scene
   */
  addDie() {
    const diceOptions = {
      type: this.settingsManager.getSetting('dice', 'type'),
      size: this.settingsManager.getSetting('dice', 'size'),
      position: {
        x: (Math.random() - 0.5) * 100,
        y: 100 + Math.random() * 50,
        z: (Math.random() - 0.5) * 100
      },
      color: this.settingsManager.getSetting('dice', 'color'),
      material: this.settingsManager.getSetting('dice', 'material'),
      pipColor: this.settingsManager.getSetting('dice', 'pipColor'),
      pipStyle: this.settingsManager.getSetting('dice', 'pipStyle'),
      borderWidth: this.settingsManager.getSetting('dice', 'borderWidth'),
      borderColor: this.settingsManager.getSetting('dice', 'borderColor'),
      roundness: this.settingsManager.getSetting('dice', 'roundness'),
      texture: this.settingsManager.getSetting('dice', 'texture'),
      friction: this.settingsManager.getSetting('animation', 'friction'),
      restitution: this.settingsManager.getSetting('animation', 'bounciness')
    };
    
    this.diceRenderer.createDie(diceOptions);
  }
  
  /**
   * Clear all dice from the scene
   */
  clearDice() {
    this.diceRenderer.clearDice();
  }
  
  /**
   * Export current view as SVG
   */
  exportSVG() {
    // In a real implementation, this would export the current view as SVG
    // This is a simplified version that would be expanded in a real implementation
    alert('SVG export is not implemented in this demo');
  }
  
  /**
   * Export current view as PNG
   */
  exportPNG() {
    const format = 'png';
    const quality = this.settingsManager.getSetting('export', 'quality');
    
    const dataURL = this.diceRenderer.exportImage(format, quality);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `dice-${Date.now()}.${format}`;
    link.click();
  }
  
  /**
   * Export current view as animated GIF
   */
  exportGIF() {
    const options = {
      frames: this.settingsManager.getSetting('export', 'animationFrames'),
      duration: this.settingsManager.getSetting('animation', 'rollTime'),
      quality: 10,
      width: 320,
      height: 240
    };
    
    // Show loading indicator
    this.showNotification('Generating GIF...', false);
    
    this.diceRenderer.exportAnimatedGIF(options)
      .then(dataURL => {
        // Create a download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `dice-animation-${Date.now()}.gif`;
        link.click();
        
        // Show success notification
        this.showNotification('GIF exported successfully!');
      })
      .catch(error => {
        console.error('Error exporting GIF:', error);
        
        // Show error notification
        this.showNotification('Error exporting GIF', true);
      });
  }
  
  /**
   * Save current settings as a preset
   */
  savePreset() {
    if (!this.elements.presetNameInput) {
      return;
    }
    
    const name = this.elements.presetNameInput.value.trim();
    
    if (!name) {
      this.showNotification('Please enter a preset name', true);
      return;
    }
    
    this.settingsManager.createPreset(name);
    this.updatePresetsList();
    
    // Clear input
    this.elements.presetNameInput.value = '';
    
    // Show success notification
    this.showNotification(`Preset "${name}" saved successfully!`);
  }
  
  /**
   * Update presets list
   */
  updatePresetsList() {
    if (!this.elements.presetsList) {
      return;
    }
    
    // Clear list
    this.elements.presetsList.innerHTML = '';
    
    // Get presets
    const presets = this.settingsManager.getPresets();
    
    // Add presets to list
    presets.forEach(preset => {
      const presetItem = document.createElement('div');
      presetItem.className = 'preset-item';
      presetItem.textContent = preset.name;
      
      // Add click event to load preset
      presetItem.addEventListener('click', () => {
        this.loadPreset(preset.name);
      });
      
      this.elements.presetsList.appendChild(presetItem);
    });
  }
  
  /**
   * Load a preset
   * @param {string} presetName - Preset name
   */
  loadPreset(presetName) {
    this.settingsManager.loadPreset(presetName);
    this.updateUIFromSettings();
    this.updateDice();
    this.updateCamera();
    this.updateLighting();
    
    // Show success notification
    this.showNotification(`Preset "${presetName}" loaded successfully!`);
  }
  
  /**
   * Apply a color scheme
   * @param {string} schemeName - Color scheme name
   */
  applyColorScheme(schemeName) {
    this.settingsManager.applyColorScheme(schemeName);
    this.updateUIFromSettings();
    this.updateDice();
    
    // Show success notification
    this.showNotification(`Color scheme "${schemeName}" applied successfully!`);
  }
  
  /**
   * Show a notification
   * @param {string} message - Notification message
   * @param {boolean} isError - Whether this is an error notification
   */
  showNotification(message, isError = false) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);
    }
    
    // Set message and style
    notification.textContent = message;
    notification.className = `notification ${isError ? 'error' : ''}`;
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Hide notification after a delay
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}

// Export for use in Node.js environments (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIControls;
}
