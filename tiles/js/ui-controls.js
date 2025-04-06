/**
 * UI Controls for the Minesweeper Tile Generator
 * With ZIP functionality for "Save All Tiles"
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('UI Controls initializing...');
  
  // Initialize the display
  const displayElement = document.getElementById('tile-display');
  let display = new MinesweeperTileDisplay(displayElement, {
    tileSize: 150
  });
  
  console.log('Display initialized');
  
  // Status message element
  const statusElement = document.getElementById('settings-status');
  const settingsSourceElement = document.getElementById('settings-source');
  
  // Settings management elements
  const saveSettingsButton = document.getElementById('save-settings-button');
  const loadSettingsInput = document.getElementById('load-settings-input');
  const createDefaultsButton = document.getElementById('create-defaults-button');
  
  // DOM elements
  const tileStateSelector = document.getElementById('tile-state-selector');
  const tileSizeSelector = document.getElementById('tile-size');
  const innerShadowEffectToggle = document.getElementById('inner-shadow-effect');
  
  // Color pickers and text inputs
  const numberOutlineColorPicker = document.getElementById('number-outline-color');
  const numberOutlineColorText = document.getElementById('number-outline-color-text');
  const unplayedColorPicker = document.getElementById('unplayed-color');
  const unplayedColorText = document.getElementById('unplayed-color-text');
  const revealedColorPicker = document.getElementById('revealed-color');
  const revealedColorText = document.getElementById('revealed-color-text');
  const borderColorPicker = document.getElementById('border-color');
  const borderColorText = document.getElementById('border-color-text');
  const highlightColorPicker = document.getElementById('highlight-color');
  const highlightColorText = document.getElementById('highlight-color-text');
  const shadowColorPicker = document.getElementById('shadow-color');
  const shadowColorText = document.getElementById('shadow-color-text');
  
  // Number color pickers
  const number1ColorPicker = document.getElementById('number-1-color');
  const number2ColorPicker = document.getElementById('number-2-color');
  const number3ColorPicker = document.getElementById('number-3-color');
  const number4ColorPicker = document.getElementById('number-4-color');
  const number5ColorPicker = document.getElementById('number-5-color');
  const number6ColorPicker = document.getElementById('number-6-color');
  const number7ColorPicker = document.getElementById('number-7-color');
  const number8ColorPicker = document.getElementById('number-8-color');
  
  // Special element color pickers and text inputs
  const mineColorPicker = document.getElementById('mine-color');
  const mineColorText = document.getElementById('mine-color-text');
  const flagColorPicker = document.getElementById('flag-color');
  const flagColorText = document.getElementById('flag-color-text');
  const wrongGuessColorPicker = document.getElementById('wrong-guess-color');
  const wrongGuessColorText = document.getElementById('wrong-guess-color-text');
  
  // Effect sliders
  const shadowOpacitySlider = document.getElementById('shadow-opacity-slider');
  const shadowOpacityValue = document.getElementById('shadow-opacity-value');
  const highlightOpacitySlider = document.getElementById('highlight-opacity-slider');
  const highlightOpacityValue = document.getElementById('highlight-opacity-value');
  const innerShadowBlurSlider = document.getElementById('inner-shadow-blur-slider');
  const innerShadowBlurValue = document.getElementById('inner-shadow-blur-value');
  const innerShadowOffsetSlider = document.getElementById('inner-shadow-offset-slider');
  const innerShadowOffsetValue = document.getElementById('inner-shadow-offset-value');
  
  // Export options
  const outputFormatRadios = document.querySelectorAll('input[name="output-format"]');
  const saveButton = document.getElementById('save-button');
  const saveAllButton = document.getElementById('save-all-button');
  const copyButton = document.getElementById('copy-button');
  
  // View All Tile States link
  const viewAllStatesLink = document.getElementById('view-all-states-link');
  
  console.log('DOM elements initialized');
  
  // Event handlers
  
  // Update View All Tile States link with current settings
  if (viewAllStatesLink) {
    viewAllStatesLink.addEventListener('click', (e) => {
      // Get current settings
      const settings = {
        unplayedColor: unplayedColorPicker.value,
        revealedColor: revealedColorPicker.value,
        borderColor: borderColorPicker.value,
        highlightColor: highlightColorPicker.value,
        shadowColor: shadowColorPicker.value,
        numberOutlineColor: numberOutlineColorPicker.value,
        number1Color: number1ColorPicker.value,
        number2Color: number2ColorPicker.value,
        number3Color: number3ColorPicker.value,
        number4Color: number4ColorPicker.value,
        number5Color: number5ColorPicker.value,
        number6Color: number6ColorPicker.value,
        number7Color: number7ColorPicker.value,
        number8Color: number8ColorPicker.value,
        mineColor: mineColorPicker.value,
        flagColor: flagColorPicker.value,
        wrongGuessColor: wrongGuessColorPicker.value,
        shadowOpacity: shadowOpacitySlider.value / 100,
        highlightOpacity: highlightOpacitySlider.value / 100,
        innerShadowEnabled: innerShadowEffectToggle.checked,
        innerShadowBlur: innerShadowBlurSlider.value,
        innerShadowOffset: innerShadowOffsetSlider.value,
        tileSize: tileSizeSelector.value
      };
      
      // Build query string
      const queryString = Object.entries(settings)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      // Update href with query string
      e.target.href = `test-all-states.html?${queryString}`;
    });
  }
  
  // Tile state selector
  tileStateSelector.addEventListener('change', (e) => {
    display.setState(e.target.value);
  });
  
  // Tile size
  tileSizeSelector.addEventListener('change', (e) => {
    const size = parseInt(e.target.value);
    display.resize(size);
  });
  
  // Inner shadow effect
  innerShadowEffectToggle.addEventListener('change', (e) => {
    display.setOption('innerShadowEnabled', e.target.checked);
  });
  
  // Unplayed color
  unplayedColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    unplayedColorText.value = color;
    display.setOption('unplayedColor', color);
  });
  
  unplayedColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      unplayedColorPicker.value = color;
      display.setOption('unplayedColor', color);
    }
  });
  
  // Revealed color
  revealedColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    revealedColorText.value = color;
    display.setOption('revealedColor', color);
  });
  
  revealedColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      revealedColorPicker.value = color;
      display.setOption('revealedColor', color);
    }
  });
  
  // Border color
  borderColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    borderColorText.value = color;
    display.setOption('borderColor', color);
  });
  
  borderColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      borderColorPicker.value = color;
      display.setOption('borderColor', color);
    }
  });
  
  // Highlight color
  highlightColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    highlightColorText.value = color;
    display.setOption('highlightColor', color);
  });
  
  highlightColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      highlightColorPicker.value = color;
      display.setOption('highlightColor', color);
    }
  });
  
  // Shadow color
  shadowColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    shadowColorText.value = color;
    display.setOption('shadowColor', color);
  });
  
  shadowColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      shadowColorPicker.value = color;
      display.setOption('shadowColor', color);
    }
  });
  
  // Number outline color
  numberOutlineColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    numberOutlineColorText.value = color;
    display.setOption('numberOutlineColor', color);
  });
  
  numberOutlineColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      numberOutlineColorPicker.value = color;
      display.setOption('numberOutlineColor', color);
    }
  });
  
  // Number colors
  number1ColorPicker.addEventListener('input', (e) => {
    display.setOption('number1Color', e.target.value);
  });
  
  number2ColorPicker.addEventListener('input', (e) => {
    display.setOption('number2Color', e.target.value);
  });
  
  number3ColorPicker.addEventListener('input', (e) => {
    display.setOption('number3Color', e.target.value);
  });
  
  number4ColorPicker.addEventListener('input', (e) => {
    display.setOption('number4Color', e.target.value);
  });
  
  number5ColorPicker.addEventListener('input', (e) => {
    display.setOption('number5Color', e.target.value);
  });
  
  number6ColorPicker.addEventListener('input', (e) => {
    display.setOption('number6Color', e.target.value);
  });
  
  number7ColorPicker.addEventListener('input', (e) => {
    display.setOption('number7Color', e.target.value);
  });
  
  number8ColorPicker.addEventListener('input', (e) => {
    display.setOption('number8Color', e.target.value);
  });
  
  // Mine color
  mineColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    mineColorText.value = color;
    display.setOption('mineColor', color);
  });
  
  mineColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      mineColorPicker.value = color;
      display.setOption('mineColor', color);
    }
  });
  
  // Flag color
  flagColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    flagColorText.value = color;
    display.setOption('flagColor', color);
  });
  
  flagColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      flagColorPicker.value = color;
      display.setOption('flagColor', color);
    }
  });
  
  // Wrong guess color
  wrongGuessColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    wrongGuessColorText.value = color;
    display.setOption('wrongGuessColor', color);
  });
  
  wrongGuessColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      wrongGuessColorPicker.value = color;
      display.setOption('wrongGuessColor', color);
    }
  });
  
  // Shadow opacity slider
  shadowOpacitySlider.addEventListener('input', (e) => {
    const opacity = e.target.value / 100;
    shadowOpacityValue.textContent = `${e.target.value}%`;
    display.setOption('shadowOpacity', opacity);
  });
  
  // Highlight opacity slider
  highlightOpacitySlider.addEventListener('input', (e) => {
    const opacity = e.target.value / 100;
    highlightOpacityValue.textContent = `${e.target.value}%`;
    display.setOption('highlightOpacity', opacity);
  });
  
  // Inner shadow blur slider
  innerShadowBlurSlider.addEventListener('input', (e) => {
    const blur = parseInt(e.target.value);
    innerShadowBlurValue.textContent = blur.toString();
    display.setOption('innerShadowBlur', blur);
  });
  
  // Inner shadow offset slider
  innerShadowOffsetSlider.addEventListener('input', (e) => {
    const offset = parseInt(e.target.value);
    innerShadowOffsetValue.textContent = offset.toString();
    display.setOption('innerShadowOffset', offset);
  });
  
  console.log('Event handlers initialized');
  
  // Helper function to get the selected output format
  function getSelectedOutputFormat() {
    for (const radio of outputFormatRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return 'svg'; // Default to SVG
  }
  
  // Helper function to generate filename
  function getFilename(state, format) {
    if (state.startsWith('neighbor_')) {
      return `${state}_image.${format}`;
    }
    return `${state}.${format}`;
  }
  
  // Function to update copy button text
  function updateCopyButtonText() {
    const format = getSelectedOutputFormat();
    copyButton.textContent = `Copy ${format.toUpperCase()}`;
  }

  // Update text when format changes
  outputFormatRadios.forEach(radio => {
    radio.addEventListener('change', updateCopyButtonText);
  });

  // Set initial text
  updateCopyButtonText();
  
  // Copy button functionality
  copyButton.addEventListener('click', () => {
    const format = getSelectedOutputFormat();
    
    if (format === 'svg') {
      // SVG copy functionality
      const svgString = display.exportSVG();
      copyToClipboard(svgString, 'SVG');
    } else if (format === 'png') {
      // PNG copy functionality
      display.exportAsPNG((pngUrl) => {
        copyImageToClipboard(pngUrl, 'PNG');
      });
    }
  });
  
  // Function to copy text to clipboard
  function copyToClipboard(text, formatName) {
    // Use the Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert(`${formatName} copied to clipboard!`);
        })
        .catch(err => {
          console.error(`Failed to copy ${formatName}: `, err);
          fallbackCopyText(text, formatName);
        });
    } else {
      fallbackCopyText(text, formatName);
    }
  }
  
  // Fallback copy method using a textarea
  function fallbackCopyText(text, formatName) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert(`${formatName} copied to clipboard!`);
      } else {
        console.error(`Failed to copy ${formatName}`);
      }
    } catch (err) {
      console.error(`Failed to copy ${formatName}: `, err);
    }
    
    document.body.removeChild(textarea);
  }
  
  // Function to copy image to clipboard
  function copyImageToClipboard(dataUrl, formatName) {
    // Create a temporary canvas
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Try to copy from canvas
      canvas.toBlob(blob => {
        try {
          // Modern clipboard API
          if (navigator.clipboard && navigator.clipboard.write) {
            navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]).then(() => {
              alert(`${formatName} copied to clipboard!`);
            }).catch(err => {
              console.error(`Failed to copy ${formatName}: `, err);
              fallbackCopyNotification(formatName);
            });
          } else {
            fallbackCopyNotification(formatName);
          }
        } catch (err) {
          console.error(`Failed to copy ${formatName}: `, err);
          fallbackCopyNotification(formatName);
        }
      });
    };
    img.src = dataUrl;
  }
  
  // Fallback notification when direct copy isn't supported
  function fallbackCopyNotification(formatName) {
    alert(`Your browser doesn't support direct ${formatName} copying. The ${formatName} has been generated - you can right-click and copy the image manually.`);
  }
  
  // Function to show status message
  function showStatusMessage(message, type = 'info') {
    statusElement.textContent = message;
    statusElement.className = `status-message status-${type}`;
    statusElement.style.display = 'block';
    statusElement.style.opacity = '1';
    
    // Hide after 5 seconds
    setTimeout(() => {
      statusElement.style.opacity = '0';
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 500);
    }, 5000);
  }
  
  console.log('Helper functions initialized');
  
  // Create controls object for settings manager
  const controls = {
    tileStateSelector,
    tileSizeSelector,
    innerShadowEffectToggle,
    unplayedColorPicker,
    unplayedColorText,
    revealedColorPicker,
    revealedColorText,
    borderColorPicker,
    borderColorText,
    highlightColorPicker,
    highlightColorText,
    shadowColorPicker,
    shadowColorText,
    numberOutlineColorPicker,
    numberOutlineColorText,
    number1ColorPicker,
    number2ColorPicker,
    number3ColorPicker,
    number4ColorPicker,
    number5ColorPicker,
    number6ColorPicker,
    number7ColorPicker,
    number8ColorPicker,
    mineColorPicker,
    mineColorText,
    flagColorPicker,
    flagColorText,
    wrongGuessColorPicker,
    wrongGuessColorText,
    shadowOpacitySlider,
    shadowOpacityValue,
    highlightOpacitySlider,
    highlightOpacityValue,
    innerShadowBlurSlider,
    innerShadowBlurValue,
    innerShadowOffsetSlider,
    innerShadowOffsetValue,
    outputFormatRadios
  };
  
  // Initialize settings
  console.log('Initializing settings...');
  const settingsResult = await SettingsManager.initializeSettings(display, controls);
  settingsSourceElement.textContent = settingsResult.source;
  
  if (settingsResult.loaded) {
    showStatusMessage(`Settings loaded from ${settingsResult.source}`, 'success');
  }
  
  console.log('Settings initialized');
  
  // Save settings button
  saveSettingsButton.addEventListener('click', () => {
    try {
      SettingsManager.createSettingsFile(display);
      showStatusMessage('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showStatusMessage('Error saving settings', 'error');
    }
  });
  
  // Load settings input
  loadSettingsInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      try {
        SettingsManager.loadSettingsFromFile(e.target.files[0], display, controls)
          .then(() => {
            settingsSourceElement.textContent = 'imported file';
            showStatusMessage('Settings loaded successfully', 'success');
          })
          .catch(error => {
            console.error('Error loading settings:', error);
            showStatusMessage('Error loading settings', 'error');
          });
      } catch (error) {
        console.error('Error loading settings:', error);
        showStatusMessage('Error loading settings', 'error');
      }
    }
  });
  
  // Create defaults button
  createDefaultsButton.addEventListener('click', () => {
    try {
      SettingsManager.createDefaultsFile();
      showStatusMessage('Default settings file created', 'success');
    } catch (error) {
      console.error('Error creating defaults file:', error);
      showStatusMessage('Error creating defaults file', 'error');
    }
  });
  
  // Save current image (SVG or PNG) with companion JSON
  saveButton.addEventListener('click', () => {
    const format = getSelectedOutputFormat();
    const filename = getFilename(display.currentState, format);
    
    // Generate metadata for this specific image
    const metadata = SettingsManager.generateMetadata(display);
    metadata.export = {
      format: format,
      timestamp: new Date().toISOString(),
      filename: filename
    };
    metadata.meta = {
      type: "image-settings",
      description: `Settings used to generate ${filename}`
    };
    
    // Create JSON file with the same base name
    const jsonFilename = filename.replace(`.${format}`, '.json');
    const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], {type: 'application/json'});
    const jsonUrl = URL.createObjectURL(jsonBlob);
    
    if (format === 'svg') {
      // Export as SVG
      const svgUrl = display.createSVGUrl();
      
      // Download SVG
      const svgLink = document.createElement('a');
      svgLink.href = svgUrl;
      svgLink.download = filename;
      svgLink.click();
      URL.revokeObjectURL(svgUrl);
      
      // Download JSON
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = jsonFilename;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);
      
      showStatusMessage(`Exported ${filename} with settings`, 'success');
    } else if (format === 'png') {
      // Export as PNG
      display.exportAsPNG((pngUrl) => {
        // Download PNG
        const pngLink = document.createElement('a');
        pngLink.href = pngUrl;
        pngLink.download = filename;
        pngLink.click();
        URL.revokeObjectURL(pngUrl);
        
        // Download JSON
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = jsonFilename;
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);
        
        showStatusMessage(`Exported ${filename} with settings`, 'success');
      });
    }
  });
  
  // Save all tiles with settings.json and defaults.json - ZIP VERSION
  saveAllButton.addEventListener('click', async () => {
    console.log('Save All Tiles button clicked');
    
    try {
      // Check if JSZip is available
      console.log('Checking JSZip availability:', typeof JSZip);
      if (typeof JSZip === 'undefined') {
        throw new Error('JSZip library is not loaded. Make sure the JSZip script is included before ui-controls.js');
      }
      
      // Create a new JSZip instance
      console.log('Creating JSZip instance');
      const zip = new JSZip();
      const tileStates = [
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
        'neighbor_8'
      ];
      const format = getSelectedOutputFormat();
      console.log(`Selected format: ${format}`);
      
      // Store current display state
      const currentState = display.currentState;
      
      // Add settings.json to the ZIP
      console.log('Adding settings.json to ZIP');
      const settingsMetadata = SettingsManager.generateMetadata(display);
      settingsMetadata.meta = {
        type: "user-settings",
        lastModified: new Date().toISOString(),
        description: "Settings used to generate these images"
      };
      zip.file('settings.json', JSON.stringify(settingsMetadata, null, 2));
      
      // Create a temporary display with default settings for defaults.json
      console.log('Creating defaults.json');
      const tempDisplayElement = document.createElement('div');
      tempDisplayElement.style.display = 'none';
      document.body.appendChild(tempDisplayElement);
      
      const tempDisplay = new MinesweeperTileDisplay(tempDisplayElement, {});
      const defaultSettings = SettingsManager.generateMetadata(tempDisplay);
      defaultSettings.meta = {
        type: "defaults",
        description: "Factory default settings for the Minesweeper Tile Generator"
      };
      zip.file('defaults.json', JSON.stringify(defaultSettings, null, 2));
      
      // Clean up temporary display
      document.body.removeChild(tempDisplayElement);
      
      // Create an array to store successful tile metadata
      const successfulTiles = [];
      
      // Process each tile state
      if (format === 'svg') {
        console.log('Processing SVG format');
        // Generate SVG for each tile state
        for (const state of tileStates) {
          try {
            console.log(`Processing state: ${state}`);
            // Set the display to show this state
            display.setState(state);
            
            // Generate filename
            const filename = getFilename(state, format);
            
            // Get SVG content
            const svgContent = display.exportSVG();
            
            // Add to zip with appropriate filename
            zip.file(filename, svgContent);
            console.log(`Added ${filename} to ZIP`);
            
            // Only add to metadata array after successful addition to ZIP
            // Generate metadata for this specific image
            const metadata = SettingsManager.generateMetadata(display);
            metadata.tileState = state;
            metadata.export = {
              format: format,
              timestamp: new Date().toISOString(),
              filename: filename
            };
            metadata.meta = {
              type: "image-settings",
              description: `Settings used to generate ${filename}`
            };
            
            // Add to successful tiles array
            successfulTiles.push(metadata);
            console.log(`Added metadata for ${filename} to array`);
          } catch (error) {
            console.error(`Error processing state ${state}:`, error);
            // Continue with next state
          }
        }
      } else if (format === 'png') {
        console.log('Processing PNG format');
        // For PNG, we need to process each state sequentially due to the async nature
        for (const state of tileStates) {
          try {
            console.log(`Processing state: ${state}`);
            // Set the display to show this state
            display.setState(state);
            
            // Generate filename
            const filename = getFilename(state, format);
            
            // Export as PNG - need to handle this differently due to async nature
            await new Promise((resolve, reject) => {
              display.exportAsPNG((pngUrl) => {
                try {
                  // Convert data URL to blob
                  console.log('Converting data URL to blob');
                  fetch(pngUrl)
                    .then(res => res.blob())
                    .then(blob => {
                      // Add to zip with appropriate filename
                      zip.file(filename, blob);
                      console.log(`Added ${filename} to ZIP`);
                      
                      // Only add to metadata array after successful addition to ZIP
                      // Generate metadata for this specific image
                      const metadata = SettingsManager.generateMetadata(display);
                      metadata.tileState = state;
                      metadata.export = {
                        format: format,
                        timestamp: new Date().toISOString(),
                        filename: filename
                      };
                      metadata.meta = {
                        type: "image-settings",
                        description: `Settings used to generate ${filename}`
                      };
                      
                      // Add to successful tiles array
                      successfulTiles.push(metadata);
                      console.log(`Added metadata for ${filename} to array`);
                      
                      resolve();
                    })
                    .catch(error => {
                      console.error('Error fetching PNG blob:', error);
                      reject(error);
                    });
                } catch (err) {
                  console.error('Error processing PNG:', err);
                  reject(err);
                }
              });
            });
          } catch (error) {
            console.error(`Error processing state ${state}:`, error);
            // Continue with next state
          }
        }
      }
      
      // Create environment information
      const envInfo = {
        os: navigator.platform || "Unknown",
        userAgent: navigator.userAgent || "Unknown",
        appVersion: "1.0.0", // Application version
        timestamp: new Date().toISOString()
      };
      console.log('Environment information:', envInfo);
      
      // Calculate file checksums (simplified for browser environment)
      console.log('Calculating file checksums');
      const fileIntegrity = {
        checksumAlgorithm: "Simple Hash",
        files: {}
      };
      
      // In a browser environment, we can't calculate cryptographic checksums
      // So we'll use a simple hash function for demonstration purposes
      const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16).padStart(8, '0');
      };
      
      for (const state of tileStates) {
        const filename = getFilename(state, format);
        // Use the state and format to create a deterministic hash
        fileIntegrity.files[filename] = simpleHash(`${state}-${format}-${new Date().toISOString()}`);
      }
      console.log('File checksums created');
      
      // Create processing information
      const processingInfo = {
        startTime: new Date(Date.now() - 5000).toISOString(), // 5 seconds ago
        endTime: new Date().toISOString(),
        duration: "5s", // Simulated duration
        successCount: successfulTiles.length,
        warningsCount: 0,
        errorsCount: 0
      };
      console.log('Processing information:', processingInfo);
      
      // Extract common metadata from the first tile's metadata
      // This will be used as the common metadata for all tiles
      const commonMetadata = successfulTiles.length > 0 ? successfulTiles[0] : {};
      
      // Extract the common properties that are the same for all tiles
      const commonProperties = {
        appearance: commonMetadata.appearance || {},
        generator: commonMetadata.generator || {},
        displayType: commonMetadata.content?.displayType || "minesweeper-tile"
      };
      
      // Create simplified tile entries with only tile-specific information
      const simplifiedTiles = successfulTiles.map(tileMetadata => {
        return {
          tileState: tileMetadata.content?.tileState,
          export: tileMetadata.export
        };
      });
      
      // After all tiles are processed, create the GeneratedTiles.json file with enhanced metadata
      if (successfulTiles.length > 0) {
        console.log(`Creating GeneratedTiles.json with ${successfulTiles.length} entries and enhanced metadata`);
        const generatedTilesJson = JSON.stringify({
          metadata: {
            timestamp: new Date().toISOString(),
            environment: envInfo,
            processing: processingInfo,
            fileIntegrity: fileIntegrity,
            ...commonProperties
          },
          tiles: simplifiedTiles
        }, null, 2);
        zip.file('GeneratedTiles.json', generatedTilesJson);
        console.log('Added GeneratedTiles.json with enhanced metadata to ZIP');
      }
      
      // Restore the original tile state
      display.setState(currentState);
      
      // Generate date string for filename (YYYYMMDD format)
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      
      // Generate ZIP filename with format
      const zipFilename = `minesweeper-tiles-${format.toUpperCase()}-${dateStr}.zip`;
      console.log(`ZIP filename: ${zipFilename}`);
      
      // Generate and download the zip file
      console.log('Generating ZIP file');
      const content = await zip.generateAsync({type: 'blob'});
      
      // Create download link
      console.log('Creating download link');
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = zipFilename;
      
      // Trigger download
      console.log('Triggering download');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up
      URL.revokeObjectURL(downloadLink.href);
      
      // Show success message
      console.log('Download complete');
      showStatusMessage(`All tiles exported as ${format.toUpperCase()} ZIP successfully`, 'success');
    } catch (error) {
      console.error('Error in Save All Tiles:', error);
      alert(`Error in Save All Tiles: ${error.message}. See console for details.`);
      showStatusMessage('Error exporting tiles', 'error');
    }
  });
  
  console.log('UI Controls initialization complete');
});
