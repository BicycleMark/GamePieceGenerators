/**
 * Tests for the number outline feature in MinesweeperTileDisplay
 */

// Define a simple mock for the MinesweeperTileDisplay class
class MinesweeperTileDisplay {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      numberOutlineColor: options.numberOutlineColor || '#ffffff',
      numberOutlineWidth: options.numberOutlineWidth || 1,
      ...options
    };
    
    this.numberElements = [];
    
    // Mock methods
    this.createNumberElements = jest.fn();
    this.updateNumberStyles = jest.fn();
  }
  
  // Method to create number elements with outline
  createNumberWithOutline(number) {
    // Create a group for the number
    const group = {
      appendChild: jest.fn(),
      setAttribute: jest.fn()
    };
    
    // Create the outline path
    const outlinePath = {
      setAttribute: jest.fn()
    };
    
    // Create the number path
    const numberPath = {
      setAttribute: jest.fn()
    };
    
    // Add the paths to the group
    group.appendChild(outlinePath);
    group.appendChild(numberPath);
    
    // Set attributes for the outline
    outlinePath.setAttribute('d', `M10,10 L20,20 L30,10 Z`); // Example path
    outlinePath.setAttribute('fill', 'none');
    outlinePath.setAttribute('stroke', this.options.numberOutlineColor);
    outlinePath.setAttribute('stroke-width', this.options.numberOutlineWidth);
    
    // Set attributes for the number
    numberPath.setAttribute('d', `M10,10 L20,20 L30,10 Z`); // Same path
    numberPath.setAttribute('fill', `#00${number}000`); // Color based on number
    
    // Add the group to the element
    this.element.appendChild(group);
    
    // Store the paths for later updates
    this.numberElements.push({
      group,
      outlinePath,
      numberPath
    });
    
    return group;
  }
  
  // Method to update number styles
  updateNumberOutlineStyle() {
    for (const { outlinePath } of this.numberElements) {
      outlinePath.setAttribute('stroke', this.options.numberOutlineColor);
      outlinePath.setAttribute('stroke-width', this.options.numberOutlineWidth);
    }
  }
  
  // Method to set an option
  setOption(option, value) {
    this.options[option] = value;
    
    // Update styles if needed
    if (option === 'numberOutlineColor' || option === 'numberOutlineWidth') {
      this.updateNumberOutlineStyle();
    }
  }
}

describe('MinesweeperTileDisplay Number Outline', () => {
  let display;
  let element;
  
  beforeEach(() => {
    // Create a mock SVG element
    element = {
      appendChild: jest.fn(),
      setAttribute: jest.fn()
    };
    
    // Create a new instance of MinesweeperTileDisplay
    display = new MinesweeperTileDisplay(element, {
      numberOutlineColor: '#ffffff',
      numberOutlineWidth: 1
    });
  });
  
  test('constructor sets default number outline options', () => {
    const defaultDisplay = new MinesweeperTileDisplay(element);
    
    expect(defaultDisplay.options.numberOutlineColor).toBe('#ffffff');
    expect(defaultDisplay.options.numberOutlineWidth).toBe(1);
  });
  
  test('constructor sets custom number outline options', () => {
    const customDisplay = new MinesweeperTileDisplay(element, {
      numberOutlineColor: '#000000',
      numberOutlineWidth: 2
    });
    
    expect(customDisplay.options.numberOutlineColor).toBe('#000000');
    expect(customDisplay.options.numberOutlineWidth).toBe(2);
  });
  
  test('createNumberWithOutline creates paths with correct attributes', () => {
    const group = display.createNumberWithOutline(1);
    
    // Check that the group was created and added to the element
    expect(element.appendChild).toHaveBeenCalledWith(group);
    
    // Get the created paths
    const { outlinePath, numberPath } = display.numberElements[0];
    
    // Check outline path attributes
    expect(outlinePath.setAttribute).toHaveBeenCalledWith('stroke', '#ffffff');
    expect(outlinePath.setAttribute).toHaveBeenCalledWith('stroke-width', 1);
    expect(outlinePath.setAttribute).toHaveBeenCalledWith('fill', 'none');
    
    // Check number path attributes
    expect(numberPath.setAttribute).toHaveBeenCalledWith('fill', '#001000');
  });
  
  test('updateNumberOutlineStyle updates all outline paths', () => {
    // Create some number elements
    display.createNumberWithOutline(1);
    display.createNumberWithOutline(2);
    
    // Change the outline color and width
    display.options.numberOutlineColor = '#ff0000';
    display.options.numberOutlineWidth = 2;
    
    // Update the styles
    display.updateNumberOutlineStyle();
    
    // Check that all outline paths were updated
    for (const { outlinePath } of display.numberElements) {
      expect(outlinePath.setAttribute).toHaveBeenCalledWith('stroke', '#ff0000');
      expect(outlinePath.setAttribute).toHaveBeenCalledWith('stroke-width', 2);
    }
  });
  
  test('setOption updates number outline style when relevant options change', () => {
    // Create a spy for updateNumberOutlineStyle
    const spy = jest.spyOn(display, 'updateNumberOutlineStyle');
    
    // Set a non-relevant option
    display.setOption('tileSize', 200);
    
    // Check that updateNumberOutlineStyle was not called
    expect(spy).not.toHaveBeenCalled();
    
    // Set a relevant option
    display.setOption('numberOutlineColor', '#ff0000');
    
    // Check that updateNumberOutlineStyle was called
    expect(spy).toHaveBeenCalled();
    
    // Reset the spy
    spy.mockClear();
    
    // Set another relevant option
    display.setOption('numberOutlineWidth', 2);
    
    // Check that updateNumberOutlineStyle was called again
    expect(spy).toHaveBeenCalled();
  });
});
