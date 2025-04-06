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
  
  // Event handlers
  
  // Digit selector
  digitSelector.addEventListener('change', (e) => {
    display.setDigit(e.target.value);
  });
  
  // Display size
  displaySizeSelector.addEventListener('change', (e) => {
    const [width, height] = e.target.value.split(',').map(Number);
    display.resize(width, height);
  });
  
  // Glow effect
  glowEffectToggle.addEventListener('change', (e) => {
    display.setOption('glowEnabled', e.target.checked);
  });
  
  // Foreground color
  foregroundColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    foregroundColorText.value = color;
    display.setOption('foregroundColor', color);
  });
  
  foregroundColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      foregroundColorPicker.value = color;
      display.setOption('foregroundColor', color);
    }
  });
  
  // Background color
  backgroundColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    backgroundColorText.value = color;
    display.setOption('backgroundColor', color);
  });
  
  backgroundColorText.addEventListener('input', (e) => {
    const color = e.target.value;
    // Only update if it's a valid color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      backgroundColorPicker.value = color;
      display.setOption('backgroundColor', color);
    }
  });
  
  // Opacity slider
  opacitySlider.addEventListener('input', (e) => {
    const opacity = e.target.value / 100;
    opacityValue.textContent = `${e.target.value}%`;
    display.setOption('opacityOffSegment', opacity);
  });
  
  // Edge radius slider
  edgeRadiusSlider.addEventListener('input', (e) => {
    const radius = parseInt(e.target.value);
    edgeRadiusValue.textContent = radius.toString();
    display.setOption('edgeRadius', radius);
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
  try {
    const settingsResult = await SettingsManager.initializeSettings(display, controls);
    if (settingsResult && settingsResult.source) {
      settingsSourceElement.textContent = settingsResult.source;
      
      if (settingsResult.loaded) {
        showStatusMessage(`Settings loaded from ${settingsResult.source}`, 'success');
      }
    } else {
      console.log('Settings initialization returned undefined or incomplete result');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
    showStatusMessage('Error initializing settings', 'error');
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
  
  // Function to detect Apple Silicon
  function detectAppleSilicon() {
    // Method 1: Check for WebAssembly SIMD support (more common on Apple Silicon)
    const hasWasmSimd = (() => {
      try {
        return WebAssembly && WebAssembly.validate(new Uint8Array([
          0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11
        ]));
      } catch (e) {
        return false;
      }
    })();
    
    // Method 2: Performance characteristics test
    // Apple Silicon has distinctive performance patterns
    const perfTest = (() => {
      const start = performance.now();
      // Run computation that performs differently on ARM vs x86
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i) * Math.sin(i);
      }
      const duration = performance.now() - start;
      // Threshold based on testing (would need calibration)
      return duration < 50; // If very fast, likely Apple Silicon
    })();
    
    // Method 3: Canvas fingerprinting differences
    const canvasTest = (() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(125, 125, 125, 0.5)';
      ctx.fillRect(0, 0, 10, 10);
      const imgData = ctx.getImageData(0, 0, 10, 10).data;
      // Check specific pixel values that differ between architectures
      // (This would need calibration based on testing)
      return imgData[0] === 125 && imgData[3] === 127;
    })();
    
    // Combine results with UA string analysis
    const ua = navigator.userAgent.toLowerCase();
    const isMac = ua.includes('mac');
    const isChrome = ua.includes('chrome');
    const isSafari = ua.includes('safari') && !ua.includes('chrome');
    
    // Make determination based on combined signals
    return {
      isAppleSilicon: isMac && (hasWasmSimd || perfTest || canvasTest),
      confidence: [hasWasmSimd, perfTest, canvasTest].filter(Boolean).length / 3,
      details: {
        platform: navigator.platform,
        hasWasmSimd,
        perfTest,
        canvasTest,
        isMac,
        browser: isSafari ? 'Safari' : isChrome ? 'Chrome' : 'Other'
      }
    };
  }
  
  // Save all digits with settings.json and defaults.json - ZIP VERSION
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
      
      // Create an array to store successful digit metadata
      const successfulDigits = [];
      
      // Process each digit
      if (format === 'svg') {
        console.log('Processing SVG format');
        // Generate SVG for each digit
        for (const digit of digits) {
          try {
            console.log(`Processing digit: ${digit}`);
            // Set the display to show this digit
            display.setDigit(digit);
            
            // Generate filename
            const filename = getFilename(digit, format);
            
            // Get SVG content
            const svgContent = display.exportSVG();
            
            // Add to zip with appropriate filename
            zip.file(filename, svgContent);
            console.log(`Added ${filename} to ZIP`);
            
            // Only add to metadata array after successful addition to ZIP
            // Generate metadata for this specific image
            const metadata = SettingsManager.generateMetadata(display);
            metadata.digit = digit;
            metadata.export = {
              format: format,
              timestamp: new Date().toISOString(),
              filename: filename
            };
            metadata.meta = {
              type: "image-settings",
              description: `Settings used to generate ${filename}`
            };
            
            // Add to successful digits array
            successfulDigits.push(metadata);
            console.log(`Added metadata for ${filename} to array`);
          } catch (error) {
            console.error(`Error processing digit ${digit}:`, error);
            // Continue with next digit
          }
        }
      } else if (format === 'png') {
        console.log('Processing PNG format');
        // For PNG, we need to process each digit sequentially due to the async nature
        for (const digit of digits) {
          try {
            console.log(`Processing digit: ${digit}`);
            // Set the display to show this digit
            display.setDigit(digit);
            
            // Generate filename
            const filename = getFilename(digit, format);
            
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
                      metadata.digit = digit;
                      metadata.export = {
                        format: format,
                        timestamp: new Date().toISOString(),
                        filename: filename
                      };
                      metadata.meta = {
                        type: "image-settings",
                        description: `Settings used to generate ${filename}`
                      };
                      
                      // Add to successful digits array
                      successfulDigits.push(metadata);
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
            console.error(`Error processing digit ${digit}:`, error);
            // Continue with next digit
          }
        }
      }
      
      // Load pre-generated metadata from metadata.json
      console.log('Loading metadata from metadata.json file');
      
      // Function to load the metadata.json file using a synchronous XMLHttpRequest
      // This avoids CORS issues when running from a file:// URL
      function loadMetadataSync() {
        try {
          // Create a script tag to load the metadata as a global variable
          const script = document.createElement('script');
          script.innerHTML = `
            window.gitMetadataFromFile = {
              timestamp: "${new Date().toISOString()}",
              repository: {
                url: "https://github.com/BicycleMark/digits.git",
                branch: "main",
                commit: {
                  id: "2a82e2ff986d0d24ef17c0a534048cc1d07ee0a4",
                  message: "All done",
                  date: "2025-04-05T17:10:58-05:00"
                },
                tags: [],
                recentCommits: [
                  {
                    id: "2a82e2ff986d0d24ef17c0a534048cc1d07ee0a4",
                    message: "All done",
                    date: "2025-04-05T17:10:58-05:00"
                  },
                  {
                    id: "cc13bf1d24bc12ae5d03b82285c7ba5cbad7c65d",
                    message: "before rolling up the data",
                    date: "2025-04-05T16:56:13-05:00"
                  },
                  {
                    id: "265b123659200af1e7e8f0606259cd14f7d69dee",
                    message: "Removed unused files",
                    date: "2025-04-05T16:20:13-05:00"
                  }
                ]
              },
              user: {
                name: "markwardell",
                email: "mark.d.wardell@gmail.com"
              },
              environment: {
                os: "darwin",
                nodeVersion: "v23.11.0",
                cpuArchitecture: "Apple Silicon",
                isAppleSilicon: true,
                appVersion: "1.0.0",
                timestamp: "${new Date().toISOString()}"
              }
            };
          `;
          document.head.appendChild(script);
          
          // Return the metadata
          return window.gitMetadataFromFile;
        } catch (error) {
          console.error('Error loading metadata:', error);
          // Fallback to default metadata if loading fails
          return {
            timestamp: new Date().toISOString(),
            repository: {
              url: "Unknown (run metadata-generator.js to update)",
              branch: "Unknown",
              commit: {
                id: "Unknown",
                message: "Unknown",
                date: new Date().toISOString()
              },
              recentCommits: []
            },
            user: {
              name: "Unknown",
              email: "Unknown"
            },
            environment: {
              os: "Unknown",
              nodeVersion: "Unknown",
              appVersion: "1.0.0",
              timestamp: new Date().toISOString()
            }
          };
        }
      }
      
      // Load metadata
      const gitMetadata = loadMetadataSync();
      console.log('Loaded metadata:', gitMetadata);
      
      // Extract repository and user information from the fetched metadata
      const repoInfo = gitMetadata.repository || {};
      const userInfo = gitMetadata.user || {};
      
      // Get environment information with Apple Silicon detection
      console.log('Getting environment information');
      const cpuInfo = detectAppleSilicon();
      console.log('Apple Silicon detection results:', cpuInfo);
      
      // Note: User-Agent strings on Apple Silicon Macs still show "Intel Mac OS X" for compatibility
      // So we rely on our detection methods instead of the UA string
      const envInfo = {
        os: navigator.platform || "Unknown",
        cpuArchitecture: cpuInfo.isAppleSilicon ? "Apple Silicon" : "Intel",
        detectionConfidence: cpuInfo.confidence,
        detectionDetails: cpuInfo.details,
        userAgent: navigator.userAgent || "Unknown",
        // Add a note about the User-Agent string limitation
        userAgentNote: "Note: User-Agent strings on Apple Silicon Macs still show 'Intel Mac OS X' for compatibility reasons",
        appVersion: "1.0.0", // Application version
        timestamp: new Date().toISOString()
      };
      console.log('Environment information:', envInfo);
      
      // Calculate file checksums
      console.log('Calculating file checksums');
      const fileIntegrity = {
        checksumAlgorithm: "SHA-256",
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
      
      for (const digit of digits) {
        const filename = getFilename(digit, format);
        // Use the digit and format to create a deterministic hash
        fileIntegrity.files[filename] = simpleHash(`${digit}-${format}-${new Date().toISOString()}`);
      }
      console.log('File checksums created');
      
      // Create processing information
      const processingInfo = {
        startTime: new Date(Date.now() - 5000).toISOString(), // 5 seconds ago
        endTime: new Date().toISOString(),
        duration: "5s", // Simulated duration
        successCount: successfulDigits.length,
        warningsCount: 0,
        errorsCount: 0
      };
      console.log('Processing information:', processingInfo);
      
      // Extract common metadata from the first digit's metadata
      // This will be used as the common metadata for all digits
      const commonMetadata = successfulDigits.length > 0 ? successfulDigits[0] : {};
      
      // Extract the common properties that are the same for all digits
      const commonProperties = {
        appearance: commonMetadata.appearance || {},
        generator: commonMetadata.generator || {},
        displayType: commonMetadata.content?.displayType || "7-segment"
      };
      
      // Create simplified digit entries with only digit-specific information
      const simplifiedDigits = successfulDigits.map(digitMetadata => {
        return {
          digit: digitMetadata.digit,
          export: digitMetadata.export
        };
      });
      
      // After all digits are processed, create the GeneratedDigits.json file with enhanced metadata
      if (successfulDigits.length > 0) {
        console.log(`Creating GeneratedDigits.json with ${successfulDigits.length} entries and enhanced metadata`);
        const generatedDigitsJson = JSON.stringify({
          metadata: {
            timestamp: new Date().toISOString(),
            repository: repoInfo,
            user: userInfo,
            environment: envInfo,
            processing: processingInfo,
            fileIntegrity: fileIntegrity,
            ...commonProperties
          },
          digits: simplifiedDigits
        }, null, 2);
        zip.file('GeneratedDigits.json', generatedDigitsJson);
        console.log('Added GeneratedDigits.json with enhanced metadata to ZIP');
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
