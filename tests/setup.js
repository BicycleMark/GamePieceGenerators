/**
 * Jest setup file for GamePieceGenerators tests
 * This file is run before each test file
 */

// Mock browser globals that might be needed
global.window = {
  URL: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn()
  }
};

// Mock document methods and properties
global.document = {
  createElement: jest.fn((tag) => {
    if (tag === 'svg') {
      return {
        setAttribute: jest.fn(),
        appendChild: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        querySelector: jest.fn(),
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn(() => false)
        },
        style: {},
        innerHTML: '',
        cloneNode: jest.fn(() => ({
          appendChild: jest.fn(),
          setAttribute: jest.fn(),
          querySelectorAll: jest.fn(() => []),
          querySelector: jest.fn(),
          classList: {
            add: jest.fn(),
            remove: jest.fn()
          },
          style: {}
        }))
      };
    }
    if (tag === 'canvas') {
      return {
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
          toDataURL: jest.fn(() => 'data:image/png;base64,mockdata')
        })),
        width: 0,
        height: 0,
        toBlob: jest.fn(callback => callback(new Blob(['mockdata'])))
      };
    }
    if (tag === 'a' || tag === 'div' || tag === 'span') {
      return {
        setAttribute: jest.fn(),
        style: {},
        click: jest.fn(),
        appendChild: jest.fn(),
        href: ''
      };
    }
    if (tag === 'defs' || tag === 'g' || tag === 'path' || tag === 'rect' || tag === 'circle' || tag === 'line') {
      return {
        setAttribute: jest.fn(),
        innerHTML: '',
        appendChild: jest.fn()
      };
    }
    return {
      setAttribute: jest.fn(),
      style: {},
      appendChild: jest.fn()
    };
  }),
  createElementNS: jest.fn((namespace, tag) => {
    return global.document.createElement(tag);
  }),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  },
  head: {
    appendChild: jest.fn()
  }
};

// Mock XMLSerializer
global.XMLSerializer = jest.fn(() => ({
  serializeToString: jest.fn(() => '<svg></svg>')
}));

// Mock Image
global.Image = class {
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
};

// Mock Blob
global.Blob = jest.fn((content, options) => ({
  size: 0,
  type: options.type
}));

// Mock navigator
global.navigator = {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    write: jest.fn(() => Promise.resolve())
  },
  platform: 'MacIntel',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    blob: () => Promise.resolve(new Blob())
  })
);

// Mock URL
global.URL = {
  createObjectURL: jest.fn(() => 'mock-object-url'),
  revokeObjectURL: jest.fn()
};

// Mock ClipboardItem if needed for tests
global.ClipboardItem = jest.fn((data) => data);

// Mock performance
global.performance = {
  now: jest.fn(() => 0)
};

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Import Jest globals
const { afterEach } = require('@jest/globals');

// Clean up mocks after each test
if (typeof afterEach === 'function') {
  afterEach(() => {
    jest.clearAllMocks();
  });
} else {
  // If afterEach is not available, just log a message
  console.log('afterEach not available in this context');
}
