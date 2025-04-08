/**
 * UI Controls for the 7-Segment LED Display Generator
 * With ZIP functionality for "Save All Digits"
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('UI Controls initializing...');
  
  // Initialize the display
  const displayElement = document.getElementById('led-display');
  let display = new SevenSegmentDisplay(displayElement, {
    width: 100,
    height: 200
  });
  
  console.log('Display initialized');
  
  // View All Digits link
  const viewAllDigitsLink = document.getElementById('view-all-digits-link');
  
  // Status message element
  const statusElement = document.getElementById('settings-status');
  const settingsSourceElement = document.getElementById('settings-source');
  
  // Settings management elements
  const saveSettingsButton = document.getElementById('save-settings-button');
  const loadSettingsInput = document.getElementById('load-settings-input');
  const createDefaultsButton = document.getElementById('create-defaults-button');
  
  // DOM elements
  const digitSelector = document.getElementById('digit-selector');
  const displaySizeSelector = document.getElementById('display-size');
  const glowEffectToggle = document.getElementById('glow-effect');
  const foregroundColorPicker = document.getElementById('foreground-color');
  const foregroundColorText = document.getElementById('foreground-color-text');
  const backgroundColorPicker = document.getElementById('background-color');
  const backgroundColorText = document.getElementById('background-color-text');
  const opacitySlider = document.getElementById('opacity-slider');
  const opacityValue = document.getElementById('opacity-value');
  const edgeRadiusSlider = document.getElementById('edge-radius-slider');
  const edgeRadiusValue = document.getElementById('edge-radius-value');
  const outputFormatRadios = document.querySelectorAll('input[name="output-format"]');
  const saveButton = document.getElementById('save-button');
  const saveAllButton = document.getElementById('save-all-button');
  const copyButton = document.getElementById('copy-button');
  
  console.log('DOM elements initialized');
  
  // Function to update the "View All Digits" link with current parameters
  function updateViewAllDigitsLink() {
    if (!viewAllDigitsLink) return;
    
    const params = new URLSearchParams();
    
    // Add current display settings to URL parameters
    params.set('foregroundColor', display.options.foregroundColor);
    params.set('backgroundColor', display.options.backgroundColor);
    params.set('opacityOffSegment', display.options.opacityOffSegment);
    params.set('edgeRadius', display.options.edgeRadius);
    params.set('glowEnabled', display.options.glowEnabled);
    params.set('width', display.options.width);
    params.set('height', display.options.height);
    
    // Update the link href
    viewAllDigitsLink.href = `test-all-digits.html?${params.toString()}`;
  }
  
  // Set initial link parameters
  updateViewAllDigitsLink();
  
  // Event handlers
  
  // Digit selector
  digitSelector.addEventListener('change', (e) => {
    display.setDigit(e.target.value);
  });
  
  // Display size
  displaySizeSelector.addEventListener('change', (e) => {
    const [width, height] = e.target.value.split(',').map(Number);
    display.resize(width, height);
    updateViewAllDigitsLink();
  });
  
  // Glow effect
  glowEffectToggle.addEventListener('change', (e) => {
    display.setOption('glowEnabled', e.target.checked);
    updateViewAllDigitsLink();
  });
  
  // Foreground color
  foregroundColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    foregroundColorText.value = color;
    display.setOption('foregroundColor', color);
    updateViewAllDigitsLink();
  });
  
  foregroundColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      foregroundColorPicker.value = color;
      display.setOption('foregroundColor', color);
      updateViewAllDigitsLink();
    }
  });
  
  // Background color
  backgroundColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    backgroundColorText.value = color;
    display.setOption('backgroundColor', color);
    updateViewAllDigitsLink();
  });
  
  backgroundColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      backgroundColorPicker.value = color;
      display.setOption('backgroundColor', color);
      updateViewAllDigitsLink();
    }
  });
  
  // Opacity slider
  opacitySlider.addEventListener('input', (e) => {
    const opacity = e.target.value / 100;
    opacityValue.textContent = `${e.target.value}%`;
    display.setOption('opacityOffSegment', opacity);
    updateViewAllDigitsLink();
  });
  
  // Edge radius slider
  edgeRadiusSlider.addEventListener('input', (e) => {
    const radius = parseInt(e.target.value);
    edgeRadiusValue.textContent = radius.toString();
    display.setOption('edgeRadius', radius);
    updateViewAllDigitsLink();
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
  function getFilename(digit, format) {
    const digitName = digit === '' ? 'blank' : digit;
    return `digit_${digitName}_image.${format}`;
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
    digitSelector,
    displaySizeSelector,
    glowEffectToggle,
    foregroundColorPicker,
    foregroundColorText,
    backgroundColorPicker,
    backgroundColorText,
    opacitySlider,
    opacityValue,
    edgeRadiusSlider,
    edgeRadiusValue,
    outputFormatRadios
  };
  
  // Initialize settings
  console.log('Initializing settings...');
  const settingsResult = await SettingsManager.initializeSettings(display, controls);
  settingsSourceElement.textContent = settingsResult.source;
  
  if (settingsResult.loaded) {
    showStatusMessage(`Settings loaded from ${settingsResult.source}`, 'success');
  }
  
  // Update the link after settings are loaded
  updateViewAllDigitsLink();
  
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
            updateViewAllDigitsLink();
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
    const filename = getFilename(display.currentDigit, format);
    
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
  
  // Save all digits with settings.json and defaults.json
  saveAllButton.addEventListener('click', async () => {
    console.log('Save All Digits button clicked');
    
    try {
      // Check if JSZip is available
      console.log('Checking JSZip availability:', typeof JSZip);
      if (typeof JSZip === 'undefined') {
        throw new Error('JSZip library is not loaded. Make sure the JSZip script is included before ui-controls.js');
      }
      
      // Create a new JSZip instance
      console.log('Creating JSZip instance');
      const zip = new JSZip();
      const digits = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const format = getSelectedOutputFormat();
      console.log(`Selected format: ${format}`);
      
      // Store current display state
      const currentDigit = display.currentDigit;
      
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
      
      const tempDisplay = new SevenSegmentDisplay(tempDisplayElement, {});
      const defaultSettings = SettingsManager.generateMetadata(tempDisplay);
      defaultSettings.meta = {
        type: "defaults",
        description: "Factory default settings for the 7-Segment LED Display Generator"
      };
      zip.file('defaults.json', JSON.stringify(defaultSettings, null, 2));
      
      // Clean up temporary display
      document.body.removeChild(tempDisplayElement);
      
      // Process each digit
      for (const digit of digits) {
        try {
          console.log(`Processing digit: ${digit}`);
          // Set the display to show this digit
          display.setDigit(digit);
          
          // Generate filename
          const filename = getFilename(digit, format);
          
          if (format === 'svg') {
            // Get SVG content
            const svgContent = display.exportSVG();
            
            // Add to zip with appropriate filename
            zip.file(filename, svgContent);
          } else if (format === 'png') {
            // For PNG, we need to handle this differently due to async nature
            await new Promise((resolve, reject) => {
              display.exportAsPNG((pngUrl) => {
                try {
                  // Convert data URL to blob
                  fetch(pngUrl)
                    .then(res => res.blob())
                    .then(blob => {
                      // Add to zip with appropriate filename
                      zip.file(filename, blob);
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
          }
          
          console.log(`Added ${filename} to ZIP`);
        } catch (error) {
          console.error(`Error processing digit ${digit}:`, error);
          // Continue with next digit
        }
      }
      
      // Restore the original digit display
      display.setDigit(currentDigit);
      
      // Generate date string for filename (YYYYMMDD format)
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      
      // Generate ZIP filename with format
      const zipFilename = `7segment-digits-${format.toUpperCase()}-${dateStr}.zip`;
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
      showStatusMessage(`All digits exported as ${format.toUpperCase()} ZIP successfully`, 'success');
    } catch (error) {
      console.error('Error in Save All Digits:', error);
      alert(`Error in Save All Digits: ${error.message}. See console for details.`);
      showStatusMessage('Error exporting digits', 'error');
    }
  });
  
  console.log('UI Controls initialization complete');
});
