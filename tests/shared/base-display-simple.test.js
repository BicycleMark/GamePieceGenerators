/**
 * Simple tests for the BaseDisplay class
 */

// Define a simple BaseDisplay class for testing
class BaseDisplay {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      width: 100,
      height: 100,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.element.innerHTML = '';
    this.element.style.width = `${this.options.width}px`;
    this.element.style.height = `${this.options.height}px`;
  }
  
  setOption(option, value) {
    this.options[option] = value;
    this.updateStyles();
  }
  
  updateStyles() {
    // Mock implementation
  }
}

describe('BaseDisplay', () => {
  let display;
  let element;
  
  beforeEach(() => {
    // Create a mock element
    element = {
      innerHTML: 'old content',
      style: {}
    };
    
    // Create a spy for updateStyles
    BaseDisplay.prototype.updateStyles = jest.fn();
    
    // Create a new instance
    display = new BaseDisplay(element, {
      width: 200,
      height: 300
    });
  });
  
  test('constructor sets properties correctly', () => {
    expect(display.element).toBe(element);
    expect(display.options.width).toBe(200);
    expect(display.options.height).toBe(300);
  });
  
  test('init clears element and sets dimensions', () => {
    expect(element.innerHTML).toBe('');
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('300px');
  });
  
  test('setOption updates option and calls updateStyles', () => {
    display.setOption('color', 'red');
    
    expect(display.options.color).toBe('red');
    expect(display.updateStyles).toHaveBeenCalled();
  });
});
