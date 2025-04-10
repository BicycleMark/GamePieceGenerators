/**
 * Tests for the Dice Generator
 */

const { DiceRenderer, Dice } = require('../../dice/js/dice.js');

// Create mock functions with proper mock properties
const mockRender = jest.fn();
const mockDispose = jest.fn();

// Mock the THREE.js and CANNON.js libraries
global.THREE = {
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    background: null
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn()
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: mockRender,
    domElement: { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test') },
    shadowMap: { enabled: false, type: null },
    dispose: mockDispose
  })),
  Color: jest.fn(),
  AmbientLight: jest.fn().mockImplementation(() => ({
    intensity: 0.4
  })),
  DirectionalLight: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    castShadow: false,
    shadow: {
      mapSize: { width: 0, height: 0 },
      camera: { near: 0, far: 0, left: 0, right: 0, top: 0, bottom: 0 }
    },
    intensity: 0.8
  })),
  PlaneGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  MeshPhysicalMaterial: jest.fn(),
  Mesh: jest.fn().mockImplementation(() => ({
    rotation: { x: 0 },
    position: { 
      y: 0,
      copy: jest.fn(),
      set: jest.fn()
    },
    quaternion: {
      copy: jest.fn(),
      setFromAxisAngle: jest.fn()
    },
    receiveShadow: false,
    castShadow: false,
    geometry: { dispose: jest.fn() },
    material: { dispose: jest.fn() }
  })),
  BoxGeometry: jest.fn(),
  DoubleSide: 'double-side',
  PCFSoftShadowMap: 'pcf-soft-shadow-map',
  OrbitControls: jest.fn().mockImplementation(() => ({
    enableDamping: false,
    dampingFactor: 0,
    screenSpacePanning: false,
    minDistance: 0,
    maxDistance: 0,
    maxPolarAngle: 0,
    update: jest.fn(),
    dispose: jest.fn(),
    autoRotate: false
  }))
};

global.CANNON = {
  World: jest.fn().mockImplementation(() => ({
    gravity: { set: jest.fn() },
    broadphase: null,
    solver: { iterations: 0 },
    addBody: jest.fn(),
    removeBody: jest.fn(),
    step: jest.fn()
  })),
  NaiveBroadphase: jest.fn(),
  Body: jest.fn().mockImplementation(() => ({
    position: { 
      set: jest.fn(), 
      copy: jest.fn(),
      x: 0,
      y: 0,
      z: 0
    },
    quaternion: { 
      setFromAxisAngle: jest.fn(), 
      copy: jest.fn(),
      x: 0,
      y: 0,
      z: 0,
      w: 1
    },
    velocity: { set: jest.fn() },
    angularVelocity: { set: jest.fn() },
    applyLocalForce: jest.fn(),
    applyTorque: jest.fn()
  })),
  Material: jest.fn(),
  Box: jest.fn(),
  Plane: jest.fn(),
  Vec3: jest.fn()
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn();
global.cancelAnimationFrame = jest.fn();

// Mock document.createElement
global.document = {
  createElement: jest.fn().mockImplementation(() => ({
    getContext: jest.fn().mockReturnValue({
      drawImage: jest.fn()
    }),
    width: 0,
    height: 0
  }))
};

// Mock GIF.js
global.GIF = jest.fn().mockImplementation(() => ({
  addFrame: jest.fn(),
  on: jest.fn(),
  render: jest.fn()
}));

// Mock FileReader
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  onload: null,
  onerror: null
}));

describe('DiceRenderer', () => {
  let container;
  let renderer;
  
  beforeEach(() => {
    container = {
      clientWidth: 800,
      clientHeight: 600,
      appendChild: jest.fn(),
      contains: jest.fn().mockReturnValue(true),
      removeChild: jest.fn()
    };
    
    renderer = new DiceRenderer(container);
  });
  
  test('should initialize with default options', () => {
    expect(renderer.container).toBe(container);
    expect(renderer.options.width).toBe(800);
    expect(renderer.options.height).toBe(600);
    expect(renderer.options.antialias).toBe(true);
    expect(renderer.options.alpha).toBe(true);
    expect(renderer.options.shadows).toBe(true);
    expect(renderer.dice).toEqual([]);
    expect(renderer.isAnimating).toBe(false);
    expect(renderer.animationId).not.toBeNull();
  });
  
  test('should create a new die', () => {
    const die = renderer.createDie();
    expect(die).toBeInstanceOf(Dice);
    expect(renderer.dice.length).toBe(1);
  });
  
  test('should remove a die', () => {
    const die = renderer.createDie();
    renderer.removeDie(die);
    expect(renderer.dice.length).toBe(0);
  });
  
  test('should clear all dice', () => {
    renderer.createDie();
    renderer.createDie();
    renderer.clearDice();
    expect(renderer.dice.length).toBe(0);
  });
  
  test('should roll dice', () => {
    const die1 = renderer.createDie();
    const die2 = renderer.createDie();
    
    die1.roll = jest.fn();
    die2.roll = jest.fn();
    
    renderer.rollDice();
    
    expect(renderer.isAnimating).toBe(true);
    expect(die1.roll).toHaveBeenCalled();
    expect(die2.roll).toHaveBeenCalled();
  });
  
  test('should stop animation', () => {
    renderer.isAnimating = true;
    renderer.stopAnimation();
    expect(renderer.isAnimating).toBe(false);
  });
  
  test('should dispose of resources', () => {
    const die = renderer.createDie();
    die.remove = jest.fn();
    
    renderer.dispose();
    
    expect(cancelAnimationFrame).toHaveBeenCalledWith(renderer.animationId);
    expect(die.remove).toHaveBeenCalled();
    expect(renderer.dice.length).toBe(0);
    expect(mockDispose).toHaveBeenCalled();
  });
  
  test('should export image', () => {
    const dataURL = renderer.exportImage('png', 0.9);
    expect(dataURL).toBe('data:image/png;base64,test');
    expect(mockRender).toHaveBeenCalled();
  });
});

describe('Dice', () => {
  let renderer;
  let dice;
  
  beforeEach(() => {
    renderer = {
      scene: { 
        add: jest.fn(),
        remove: jest.fn()
      },
      world: { addBody: jest.fn(), removeBody: jest.fn() }
    };
    
    dice = new Dice(renderer);
  });
  
  test('should initialize with default options', () => {
    expect(dice.renderer).toBe(renderer);
    expect(dice.options.type).toBe('d6');
    expect(dice.options.size).toBe(50);
    expect(dice.options.color).toBe(0xffffff);
    expect(dice.options.material).toBe('plastic');
    expect(dice.value).toBe(1);
  });
  
  test('should update options', () => {
    const newOptions = {
      type: 'd6',
      size: 100,
      color: 0xff0000,
      material: 'metal'
    };
    
    dice.remove = jest.fn();
    dice.init = jest.fn();
    
    dice.updateOptions(newOptions);
    
    expect(dice.options.size).toBe(100);
    expect(dice.options.color).toBe(0xff0000);
    expect(dice.options.material).toBe('metal');
    expect(dice.remove).toHaveBeenCalled();
    expect(dice.init).toHaveBeenCalled();
  });
  
  test('should remove from scene and physics world', () => {
    dice.mesh = { geometry: { dispose: jest.fn() }, material: { dispose: jest.fn() } };
    dice.body = {};
    
    dice.remove();
    
    expect(dice.mesh).toBeNull();
    expect(dice.body).toBeNull();
    expect(renderer.scene.remove).toHaveBeenCalled();
    expect(renderer.world.removeBody).toHaveBeenCalled();
  });
  
  test('should roll with physics', () => {
    dice.body = {
      position: { set: jest.fn() },
      velocity: { set: jest.fn() },
      angularVelocity: { set: jest.fn() },
      applyLocalForce: jest.fn(),
      applyTorque: jest.fn()
    };
    
    dice.determineValue = jest.fn();
    
    jest.useFakeTimers();
    dice.roll();
    
    expect(dice.body.position.set).toHaveBeenCalled();
    expect(dice.body.velocity.set).toHaveBeenCalled();
    expect(dice.body.angularVelocity.set).toHaveBeenCalled();
    expect(dice.body.applyLocalForce).toHaveBeenCalled();
    expect(dice.body.applyTorque).toHaveBeenCalled();
    
    jest.advanceTimersByTime(2000);
    expect(dice.determineValue).toHaveBeenCalled();
    
    jest.useRealTimers();
  });
  
  test('should determine value after rolling', () => {
    // Mock Math.random to return a predictable value
    const originalRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.5);
    
    dice.determineValue();
    
    // For a d6, with Math.random() = 0.5, we expect a value of 4
    // (Math.floor(0.5 * 6) + 1 = 4)
    expect(dice.value).toBe(4);
    
    // Restore original Math.random
    Math.random = originalRandom;
  });
});
