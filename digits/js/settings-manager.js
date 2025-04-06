/**
 * Settings and Metadata Management for 7-Segment LED Display Generator
 * Uses the SharedSettingsManager for common functionality
 */

// Import the SharedSettingsManager if in Node.js/Jest environment
if (typeof require !== 'undefined') {
  var SharedSettingsManager = require('../../shared/js/settings-manager.js');
}
// In browser environment, SharedSettingsManager should be available globally

/**
 * Generate metadata object with all settings and information
 * @param {SevenSegmentDisplay} display - The display instance
 * @returns {Object} - Metadata object
 */
function generateMetadata(display) {
  return SharedSettingsManager.generateMetadata(display, '7segment');
}

/**
 * Apply settings from metadata to the display
 * @param {Object} metadata - Metadata object with settings
 * @param {SevenSegmentDisplay} display - The display instance
 */
function applySettingsFromMetadata(metadata, display) {
  SharedSettingsManager.applySettingsFromMetadata(metadata, display, '7segment');
}

/**
 * Update UI controls to reflect the settings from metadata
 * @param {Object} metadata - Metadata object with settings
 * @param {Object} controls - Object with UI control elements
 */
function updateControlsFromSettings(metadata, controls) {
  SharedSettingsManager.updateControlsFromSettings(metadata, controls, '7segment');
}

/**
 * Create a settings.json file with current settings
 * @param {SevenSegmentDisplay} display - The display instance
 */
function createSettingsFile(display) {
  return SharedSettingsManager.createSettingsFile(display, '7segment');
}

/**
 * Create a defaults.json file with factory default settings
 */
function createDefaultsFile() {
  return SharedSettingsManager.createDefaultsFile('7segment');
}

/**
 * Load settings from a JSON file
 * @param {File} file - JSON file to load
 * @param {SevenSegmentDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {Promise<Object>} - Promise resolving to the loaded settings
 */
function loadSettingsFromFile(file, display, controls) {
  return SharedSettingsManager.loadSettingsFromFile(file, display, controls, '7segment');
}

/**
 * Try to load settings from URL parameters
 * @param {SevenSegmentDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromUrl(display, controls) {
  return SharedSettingsManager.loadSettingsFromUrl(display, controls, '7segment');
}

/**
 * Try to load settings from local storage
 * @param {SevenSegmentDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {boolean} - Whether settings were loaded
 */
function loadSettingsFromLocalStorage(display, controls) {
  return SharedSettingsManager.loadSettingsFromLocalStorage(display, controls, '7segment');
}

/**
 * Try to load settings from a JSON file on the server
 * @param {string} url - URL of the JSON file
 * @param {SevenSegmentDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {Promise<boolean>} - Promise resolving to whether settings were loaded
 */
async function loadSettingsFromServer(url, display, controls) {
  return SharedSettingsManager.loadSettingsFromServer(url, display, controls, '7segment');
}

/**
 * Initialize settings with proper fallbacks
 * @param {SevenSegmentDisplay} display - The display instance
 * @param {Object} controls - Object with UI control elements
 * @returns {Promise<Object>} - Promise resolving to the settings source info
 */
async function initializeSettings(display, controls) {
  try {
    return await SharedSettingsManager.initializeSettings(display, controls, '7segment');
  } catch (error) {
    console.error('Error initializing settings:', error);
    return { source: 'hardcoded defaults (error recovery)', loaded: false };
  }
}

// Export functions
const SettingsManager = {
  generateMetadata,
  applySettingsFromMetadata,
  updateControlsFromSettings,
  createSettingsFile,
  createDefaultsFile,
  loadSettingsFromFile,
  loadSettingsFromUrl,
  loadSettingsFromLocalStorage,
  loadSettingsFromServer,
  initializeSettings,
  VERSION: SharedSettingsManager.VERSION,
  BUILD_DATE: SharedSettingsManager.BUILD_DATE
};

// For browser environment
if (typeof window !== 'undefined') {
  window.SettingsManager = SettingsManager;
}

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
