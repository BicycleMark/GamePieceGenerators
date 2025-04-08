/**
 * Simple tests for a shared SettingsManager
 */

// Define mock display classes
class MockMinesweeperTileDisplay {
  constructor() {
    this.currentState = 'unplayed';
    this.options = {
      unplayedColor: '#4a90e2',
      revealedColor: '#C0C0C0',
      numberOutlineColor: '#ffffff'
    };
    this.setState = jest.fn();
    this.setOption = jest.fn();
  }
}

class MockSevenSegmentDisplay {
  constructor() {
    this.currentDigit = '8';
    this.options = {
      foregroundColor: '#ff0000',
      backgroundColor: '#000000'
    };
    this.setDigit = jest.fn();
    this.setOption = jest.fn();
  }
}

// Define a simple SharedSettingsManager
const SharedSettingsManager = {
  generateMetadata: (display, displayType) => {
    // Common metadata structure
    const metadata = {
      generator: {
        name: displayType === 'minesweeper' ? 'Minesweeper Tile Generator' : '7-Segment LED Display Generator',
        version: '1.0.0'
      }
    };
    
    // Add display-specific content
    if (displayType === 'minesweeper') {
      metadata.content = {
        tileState: display.currentState,
        displayType: 'minesweeper-tile'
      };
      metadata.appearance = { ...display.options };
    } else if (displayType === '7segment') {
      metadata.content = {
        digit: display.currentDigit,
        displayType: '7-segment'
      };
      metadata.appearance = { ...display.options };
    }
    
    return metadata;
  },
  
  applySettingsFromMetadata: (metadata, display, displayType) => {
    // Apply content settings based on display type
    if (metadata.content) {
      if (displayType === 'minesweeper' && metadata.content.tileState) {
        display.setState(metadata.content.tileState);
      } else if (displayType === '7segment' && metadata.content.digit !== undefined) {
        display.setDigit(metadata.content.digit);
      }
    }
    
    // Apply appearance settings (works for any display type)
    if (metadata.appearance) {
      for (const [key, value] of Object.entries(metadata.appearance)) {
        if (value !== undefined) {
          display.setOption(key, value);
        }
      }
    }
  }
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = mockLocalStorage;

describe('SharedSettingsManager', () => {
  let minesweeperDisplay;
  let sevenSegmentDisplay;
  
  beforeEach(() => {
    // Create mock displays
    minesweeperDisplay = new MockMinesweeperTileDisplay();
    sevenSegmentDisplay = new MockSevenSegmentDisplay();
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('generateMetadata works for MinesweeperTileDisplay', () => {
    const metadata = SharedSettingsManager.generateMetadata(minesweeperDisplay, 'minesweeper');
    
    expect(metadata).toHaveProperty('content');
    expect(metadata).toHaveProperty('appearance');
    expect(metadata).toHaveProperty('generator');
    
    expect(metadata.content.tileState).toBe('unplayed');
    expect(metadata.content.displayType).toBe('minesweeper-tile');
    
    expect(metadata.appearance.unplayedColor).toBe('#4a90e2');
    expect(metadata.appearance.revealedColor).toBe('#C0C0C0');
    expect(metadata.appearance.numberOutlineColor).toBe('#ffffff');
    
    expect(metadata.generator.name).toBe('Minesweeper Tile Generator');
    expect(metadata.generator.version).toBe('1.0.0');
  });
  
  test('generateMetadata works for SevenSegmentDisplay', () => {
    const metadata = SharedSettingsManager.generateMetadata(sevenSegmentDisplay, '7segment');
    
    expect(metadata).toHaveProperty('content');
    expect(metadata).toHaveProperty('appearance');
    expect(metadata).toHaveProperty('generator');
    
    expect(metadata.content.digit).toBe('8');
    expect(metadata.content.displayType).toBe('7-segment');
    
    expect(metadata.appearance.foregroundColor).toBe('#ff0000');
    expect(metadata.appearance.backgroundColor).toBe('#000000');
    
    expect(metadata.generator.name).toBe('7-Segment LED Display Generator');
    expect(metadata.generator.version).toBe('1.0.0');
  });
  
  test('applySettingsFromMetadata works for MinesweeperTileDisplay', () => {
    const metadata = {
      content: {
        tileState: 'neighbor_1'
      },
      appearance: {
        unplayedColor: '#ff0000',
        revealedColor: '#00ff00'
      }
    };
    
    SharedSettingsManager.applySettingsFromMetadata(metadata, minesweeperDisplay, 'minesweeper');
    
    expect(minesweeperDisplay.setState).toHaveBeenCalledWith('neighbor_1');
    expect(minesweeperDisplay.setOption).toHaveBeenCalledWith('unplayedColor', '#ff0000');
    expect(minesweeperDisplay.setOption).toHaveBeenCalledWith('revealedColor', '#00ff00');
  });
  
  test('applySettingsFromMetadata works for SevenSegmentDisplay', () => {
    const metadata = {
      content: {
        digit: '5'
      },
      appearance: {
        foregroundColor: '#00ff00',
        backgroundColor: '#0000ff'
      }
    };
    
    SharedSettingsManager.applySettingsFromMetadata(metadata, sevenSegmentDisplay, '7segment');
    
    expect(sevenSegmentDisplay.setDigit).toHaveBeenCalledWith('5');
    expect(sevenSegmentDisplay.setOption).toHaveBeenCalledWith('foregroundColor', '#00ff00');
    expect(sevenSegmentDisplay.setOption).toHaveBeenCalledWith('backgroundColor', '#0000ff');
  });
});
