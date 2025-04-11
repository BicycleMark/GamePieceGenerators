/**
 * Dice Generator
 * Core functionality for 3D dice rendering and physics simulation
 */

class DiceRenderer {
  /**
   * Initialize the dice renderer
   * @param {HTMLElement} container - Container element for the renderer
   * @param {Object} options - Renderer options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = Object.assign({
      width: container.clientWidth,
      height: container.clientHeight,
      antialias: true,
      alpha: true,
      shadows: true
    }, options);
    
    this.dice = [];
    this.isAnimating = false;
    this.animationId = null;
    
    this.init();
  }
  
  /**
   * Initialize Three.js scene, camera, renderer, and physics
   */
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    // Create camera with better perspective for 3D viewing
    this.camera = new THREE.PerspectiveCamera(
      45, 
      this.options.width / this.options.height, 
      0.1, 
      2000
    );
    // Position camera at an angle to better show the 3D nature of the dice
    this.camera.position.set(150, 150, 250);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.options.antialias,
      alpha: this.options.alpha
    });
    this.renderer.setSize(this.options.width, this.options.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    if (this.options.shadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    this.container.appendChild(this.renderer.domElement);
    
    // Add lights
    this.setupLights();
    
    // Add floor
    this.setupFloor();
    
    // Setup physics
    this.setupPhysics();
    
    // Setup controls
    this.setupControls();
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Start rendering
    this.animate();
  }
  
  /**
   * Set up scene lighting
   */
  setupLights() {
    // Ambient light - increase intensity for better overall illumination
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);
    
    // Main directional light (sun)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(100, 200, 100);
    this.directionalLight.castShadow = this.options.shadows;
    
    // Configure shadow properties
    if (this.options.shadows) {
      this.directionalLight.shadow.mapSize.width = 2048;
      this.directionalLight.shadow.mapSize.height = 2048;
      this.directionalLight.shadow.camera.near = 0.5;
      this.directionalLight.shadow.camera.far = 500;
      this.directionalLight.shadow.camera.left = -200;
      this.directionalLight.shadow.camera.right = 200;
      this.directionalLight.shadow.camera.top = 200;
      this.directionalLight.shadow.camera.bottom = -200;
      this.directionalLight.shadow.bias = -0.0001; // Reduce shadow acne
    }
    
    this.scene.add(this.directionalLight);
    
    // Add a soft light from the front - increase intensity for better visibility
    this.frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    this.frontLight.position.set(0, 50, 200);
    this.scene.add(this.frontLight);
    
    // Add a fill light from the back for better 3D definition
    this.backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    this.backLight.position.set(0, 100, -200);
    this.scene.add(this.backLight);
  }
  
  /**
   * Set up floor for dice to roll on
   */
  setupFloor() {
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -50;
    this.floor.receiveShadow = this.options.shadows;
    
    // Add a grid to help with visual reference
    const gridHelper = new THREE.GridHelper(1000, 50, 0xcccccc, 0xcccccc);
    gridHelper.position.y = -49.9; // Slightly above the floor to prevent z-fighting
    this.scene.add(gridHelper);
    
    this.scene.add(this.floor);
  }
  
  /**
   * Set up physics simulation
   */
  setupPhysics() {
    // Initialize physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;
    
    // Create floor body
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0, // static body
      shape: floorShape
    });
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    floorBody.position.set(0, -50, 0);
    
    this.world.addBody(floorBody);
  }
  
  /**
   * Set up camera controls
   */
  setupControls() {
    // Create a simple placeholder for controls in case OrbitControls is not available
    this.controls = {
      update: () => {
        // Simple auto-rotation fallback
        if (this._autoRotate) {
          const rotationSpeed = 0.005;
          this.camera.position.x = this.camera.position.x * Math.cos(rotationSpeed) - this.camera.position.z * Math.sin(rotationSpeed);
          this.camera.position.z = this.camera.position.x * Math.sin(rotationSpeed) + this.camera.position.z * Math.cos(rotationSpeed);
          this.camera.lookAt(0, 0, 0);
        }
      },
      dispose: () => {},
      autoRotate: false,
      enableDamping: false,
      dampingFactor: 0.05,
      screenSpacePanning: false,
      minDistance: 100,
      maxDistance: 800,
      maxPolarAngle: Math.PI / 2
    };
    
    // Store auto-rotation state
    this._autoRotate = true;
    
    // Try to use OrbitControls if available
    try {
      if (typeof THREE.OrbitControls === 'function') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 800;
        this.controls.maxPolarAngle = Math.PI / 2;
        // Enable auto-rotation to better showcase the 3D nature
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
        console.log('OrbitControls initialized successfully');
      } else {
        console.warn('THREE.OrbitControls is not available. Using fallback controls.');
      }
    } catch (error) {
      console.error('Error setting up OrbitControls:', error);
      console.log('Using fallback controls instead');
    }
  }
  
  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  /**
   * Animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Update physics
    if (this.isAnimating) {
      this.world.step(1 / 60);
      
      // Update dice positions based on physics
      this.dice.forEach(die => {
        die.updateFromPhysics();
      });
    }
    
    // Update controls
    this.controls.update();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Create a new die
   * @param {Object} options - Die options
   * @returns {Dice} The created die
   */
  createDie(options = {}) {
    const die = new Dice(this, options);
    this.dice.push(die);
    return die;
  }
  
  /**
   * Remove a die from the scene
   * @param {Dice} die - The die to remove
   */
  removeDie(die) {
    const index = this.dice.indexOf(die);
    if (index !== -1) {
      die.remove();
      this.dice.splice(index, 1);
    }
  }
  
  /**
   * Clear all dice from the scene
   */
  clearDice() {
    while (this.dice.length > 0) {
      this.removeDie(this.dice[0]);
    }
  }
  
  /**
   * Roll all dice
   * @param {Object} options - Roll options
   */
  rollDice(options = {}) {
    this.isAnimating = true;
    
    this.dice.forEach(die => {
      die.roll(options);
    });
    
    // Stop animation after a set time
    if (options.duration) {
      setTimeout(() => {
        this.isAnimating = false;
      }, options.duration);
    }
  }
  
  /**
   * Stop all dice animation
   */
  stopAnimation() {
    this.isAnimating = false;
  }
  
  /**
   * Dispose of the renderer and resources
   */
  dispose() {
    this.stopAnimation();
    cancelAnimationFrame(this.animationId);
    
    this.clearDice();
    
    this.renderer.dispose();
    this.controls.dispose();
    
    window.removeEventListener('resize', this.onWindowResize);
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
  
  /**
   * Export the current view as an image
   * @param {string} format - Export format ('png', 'jpg')
   * @param {number} quality - Image quality (0-1)
   * @returns {string} Data URL of the image
   */
  exportImage(format = 'png', quality = 0.9) {
    // Render the scene
    this.renderer.render(this.scene, this.camera);
    
    // Get the data URL
    return this.renderer.domElement.toDataURL(`image/${format}`, quality);
  }
  
  /**
   * Export the current view as an animated GIF
   * @param {Object} options - GIF options
   * @returns {Promise<string>} Promise resolving to the GIF data URL
   */
  exportAnimatedGIF(options = {}) {
    return new Promise((resolve, reject) => {
      const defaults = {
        frames: 24,
        duration: 2000,
        quality: 10,
        width: 320,
        height: 240
      };
      
      const settings = Object.assign({}, defaults, options);
      
      // Create a GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: settings.quality,
        width: settings.width,
        height: settings.height,
        workerScript: 'js/gif.worker.js'
      });
      
      // Roll the dice
      this.rollDice({ duration: settings.duration });
      
      // Calculate frame delay
      const frameDelay = settings.duration / settings.frames;
      
      // Capture frames
      let framesLeft = settings.frames;
      
      const captureFrame = () => {
        // Render the scene
        this.renderer.render(this.scene, this.camera);
        
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        canvas.width = settings.width;
        canvas.height = settings.height;
        const context = canvas.getContext('2d');
        
        // Draw the renderer canvas to our sized canvas
        context.drawImage(
          this.renderer.domElement,
          0, 0, this.renderer.domElement.width, this.renderer.domElement.height,
          0, 0, settings.width, settings.height
        );
        
        // Add the frame to the GIF
        gif.addFrame(canvas, { delay: frameDelay, copy: true });
        
        framesLeft--;
        
        if (framesLeft > 0) {
          setTimeout(captureFrame, frameDelay);
        } else {
          // Finish the GIF
          gif.on('finished', blob => {
            // Convert blob to data URL
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          gif.render();
        }
      };
      
      // Start capturing frames
      captureFrame();
    });
  }
}

class Dice {
  /**
   * Initialize a die
   * @param {DiceRenderer} renderer - The dice renderer
   * @param {Object} options - Die options
   */
  constructor(renderer, options = {}) {
    this.renderer = renderer;
    this.options = Object.assign({
      type: 'd6',
      size: 50,
      position: { x: 0, y: 100, z: 0 },
      color: 0xffffff,
      material: 'plastic',
      pipColor: 0x000000,
      pipStyle: 'dots',
      borderWidth: 2,
      borderColor: 0xcccccc,
      roundness: 10,
      texture: 'smooth',
      mass: 300,
      friction: 0.8,
      restitution: 0.3
    }, options);
    
    this.mesh = null;
    this.body = null;
    this.value = 1;
    
    this.init();
  }
  
  /**
   * Initialize the die geometry, material, and physics
   */
  init() {
    this.createMesh();
    this.createPhysicsBody();
    this.addToScene();
  }
  
  /**
   * Create the 3D mesh for the die
   */
  createMesh() {
    let geometry;
    
    // Create geometry based on die type
    switch (this.options.type) {
      case 'd6':
      default:
        geometry = this.createD6Geometry();
        break;
    }
    
    // Create material
    const material = this.createMaterial();
    
    // Create mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    // Add pips
    this.addPips();
  }
  
  /**
   * Create a d6 (cube) geometry
   * @returns {THREE.BufferGeometry} The created geometry
   */
  createD6Geometry() {
    const size = this.options.size;
    const radius = (this.options.roundness / 100) * (size / 2);
    
    // Use BoxGeometry for a cube with no roundness
    if (radius <= 0) {
      return new THREE.BoxGeometry(size, size, size);
    }
    
    // Create a rounded cube using BoxGeometry with more segments for smoother corners
    const boxGeometry = new THREE.BoxGeometry(
      size - radius * 2, 
      size - radius * 2, 
      size - radius * 2,
      4, 4, 4 // More segments for smoother corners
    );
    const positions = boxGeometry.attributes.position.array;
    
    // Create a buffer geometry to modify
    const geometry = new THREE.BufferGeometry();
    const newPositions = [];
    const normals = [];
    const uvs = [];
    
    // Process each vertex
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Normalize the position to get the direction from center
      const length = Math.sqrt(x * x + y * y + z * z);
      let nx = 0, ny = 0, nz = 0;
      
      // Avoid division by zero
      if (length > 0) {
        nx = x / length;
        ny = y / length;
        nz = z / length;
      }
      
      // Add radius in the direction of the normal
      const newX = x + nx * radius;
      const newY = y + ny * radius;
      const newZ = z + nz * radius;
      
      newPositions.push(newX, newY, newZ);
      normals.push(nx, ny, nz);
      
      // Better UV mapping for texture alignment
      uvs.push((newX / size) + 0.5, (newY / size) + 0.5);
    }
    
    // Use the indices from the original BoxGeometry
    geometry.setIndex(boxGeometry.index);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    
    // Compute vertex normals to ensure smooth shading
    geometry.computeVertexNormals();
    
    return geometry;
  }
  
  /**
   * Create material based on options
   * @returns {THREE.Material} The created material
   */
  createMaterial() {
    let material;
    
    // Base material properties
    const materialProps = {
      color: new THREE.Color(this.options.color),
      side: THREE.DoubleSide
    };
    
    // Create different materials based on the material type
    switch (this.options.material) {
      case 'metal':
        material = new THREE.MeshStandardMaterial({
          ...materialProps,
          metalness: 0.8,
          roughness: 0.2
        });
        break;
        
      case 'wood':
        material = new THREE.MeshStandardMaterial({
          ...materialProps,
          metalness: 0.0,
          roughness: 0.8
        });
        // Would add wood texture in a real implementation
        break;
        
      case 'glass':
        material = new THREE.MeshPhysicalMaterial({
          ...materialProps,
          transmission: 0.9,
          opacity: 0.3,
          metalness: 0.0,
          roughness: 0.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
        break;
        
      case 'marble':
        material = new THREE.MeshStandardMaterial({
          ...materialProps,
          metalness: 0.0,
          roughness: 0.3
        });
        // Would add marble texture in a real implementation
        break;
        
      case 'plastic':
      default:
        material = new THREE.MeshStandardMaterial({
          ...materialProps,
          metalness: 0.0,
          roughness: 0.5
        });
        break;
    }
    
    return material;
  }
  
  /**
   * Add pips (dots or numbers) to the die faces
   */
  addPips() {
    // Define pip positions for each face of a d6
    const pipPositions = {
      // Face 1 (single pip in center)
      1: [
        [0, 0, 0]
      ],
      // Face 2 (two pips in opposite corners)
      2: [
        [-0.3, -0.3, 0],
        [0.3, 0.3, 0]
      ],
      // Face 3 (three pips in diagonal)
      3: [
        [-0.3, -0.3, 0],
        [0, 0, 0],
        [0.3, 0.3, 0]
      ],
      // Face 4 (four pips in corners)
      4: [
        [-0.3, -0.3, 0],
        [-0.3, 0.3, 0],
        [0.3, -0.3, 0],
        [0.3, 0.3, 0]
      ],
      // Face 5 (four in corners, one in center)
      5: [
        [-0.3, -0.3, 0],
        [-0.3, 0.3, 0],
        [0, 0, 0],
        [0.3, -0.3, 0],
        [0.3, 0.3, 0]
      ],
      // Face 6 (six pips in two rows)
      6: [
        [-0.3, -0.3, 0],
        [-0.3, 0, 0],
        [-0.3, 0.3, 0],
        [0.3, -0.3, 0],
        [0.3, 0, 0],
        [0.3, 0.3, 0]
      ]
    };
    
    // Define face normals for a cube
    const faceNormals = [
      [0, 0, 1],   // front (face 1)
      [0, 0, -1],  // back (face 6)
      [0, 1, 0],   // top (face 5)
      [0, -1, 0],  // bottom (face 2)
      [1, 0, 0],   // right (face 3)
      [-1, 0, 0]   // left (face 4)
    ];
    
    // Define face values (which number goes on which face)
    const faceValues = [1, 6, 5, 2, 3, 4];
    
    // Size of the die
    const size = this.options.size;
    const halfSize = size / 2;
    const pipSize = size * 0.12; // Slightly larger pips (12% of die size)
    const pipDepth = size * 0.03; // Increase depth for better visibility
    
    // Create pips based on the selected style
    for (let i = 0; i < faceNormals.length; i++) {
      const faceValue = faceValues[i];
      const normal = faceNormals[i];
      
      // Skip if no pips for this value
      if (!pipPositions[faceValue]) continue;
      
      // Create a group for this face's pips
      const faceGroup = new THREE.Group();
      
      // Add pips based on style
      if (this.options.pipStyle === 'dots' || !this.options.pipStyle) {
        // Create dots with more depth (use cylinders instead of flat circles)
        pipPositions[faceValue].forEach(pos => {
          // Create a short cylinder for 3D pips
          const pipGeometry = new THREE.CylinderGeometry(
            pipSize / 2,  // top radius
            pipSize / 2,  // bottom radius
            pipDepth,     // height
            16,           // radial segments
            1,            // height segments
            false         // open ended
          );
          
          const pipMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.options.pipColor),
            roughness: 0.3,
            metalness: 0.2
          });
          
          const pip = new THREE.Mesh(pipGeometry, pipMaterial);
          
          // Position the pip on the face
          pip.position.set(
            pos[0] * size * 0.5,
            pos[1] * size * 0.5,
            -pipDepth / 2  // Half inside, half outside the face
          );
          
          // Rotate to align with face
          pip.rotation.x = Math.PI / 2;
          
          faceGroup.add(pip);
        });
      } else if (this.options.pipStyle === 'numbers') {
        // For numbers, create a slightly recessed circle with a number
        const pipGeometry = new THREE.CylinderGeometry(
          pipSize * 0.8,  // top radius
          pipSize * 0.8,  // bottom radius
          pipDepth,       // height
          32,             // radial segments
          1,              // height segments
          false           // open ended
        );
        
        const pipMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(this.options.pipColor),
          roughness: 0.3,
          metalness: 0.2
        });
        
        const pip = new THREE.Mesh(pipGeometry, pipMaterial);
        pip.position.set(0, 0, -pipDepth / 2);
        pip.rotation.x = Math.PI / 2;
        faceGroup.add(pip);
      }
      
      // Position the face group - move further out from the face for better visibility
      faceGroup.position.set(
        normal[0] * (halfSize + 0.5), // Move further outside the cube
        normal[1] * (halfSize + 0.5),
        normal[2] * (halfSize + 0.5)
      );
      
      // Rotate the face group to face outward
      if (normal[0] === 1) {
        faceGroup.rotation.y = Math.PI / 2;
      } else if (normal[0] === -1) {
        faceGroup.rotation.y = -Math.PI / 2;
      } else if (normal[1] === 1) {
        faceGroup.rotation.x = -Math.PI / 2;
      } else if (normal[1] === -1) {
        faceGroup.rotation.x = Math.PI / 2;
      } else if (normal[2] === -1) {
        faceGroup.rotation.y = Math.PI;
      }
      
      // Add the face group to the mesh
      this.mesh.add(faceGroup);
    }
  }
  
  /**
   * Create the physics body for the die
   */
  createPhysicsBody() {
    const size = this.options.size;
    const halfSize = size / 2;
    
    // Create a box shape
    const shape = new CANNON.Box(new CANNON.Vec3(halfSize, halfSize, halfSize));
    
    // Create the body
    this.body = new CANNON.Body({
      mass: this.options.mass,
      shape: shape,
      position: new CANNON.Vec3(
        this.options.position.x,
        this.options.position.y,
        this.options.position.z
      ),
      material: new CANNON.Material({
        friction: this.options.friction,
        restitution: this.options.restitution
      })
    });
    
    // Add the body to the physics world
    this.renderer.world.addBody(this.body);
  }
  
  /**
   * Add the die mesh to the scene
   */
  addToScene() {
    this.renderer.scene.add(this.mesh);
    
    // Update the mesh position to match the physics body
    this.updateFromPhysics();
  }
  
  /**
   * Update the mesh position and rotation from the physics body
   */
  updateFromPhysics() {
    if (this.mesh && this.body) {
      // Update position
      this.mesh.position.copy(this.body.position);
      
      // Update rotation
      this.mesh.quaternion.copy(this.body.quaternion);
    }
  }
  
  /**
   * Roll the die with physics
   * @param {Object} options - Roll options
   */
  roll(options = {}) {
    const force = options.force || 5;
    const torque = options.torque || 10;
    
    // Reset position
    this.body.position.set(
      Math.random() * 40 - 20,
      100 + Math.random() * 50,
      Math.random() * 40 - 20
    );
    
    // Reset velocity and angular velocity
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    
    // Apply random force
    this.body.applyLocalForce(
      new CANNON.Vec3(
        (Math.random() - 0.5) * force * 1000,
        (Math.random() - 0.5) * force * 1000,
        (Math.random() - 0.5) * force * 1000
      ),
      new CANNON.Vec3(0, 0, 0)
    );
    
    // Apply random torque
    this.body.applyTorque(
      new CANNON.Vec3(
        (Math.random() - 0.5) * torque * 1000,
        (Math.random() - 0.5) * torque * 1000,
        (Math.random() - 0.5) * torque * 1000
      )
    );
    
    // Determine the result after rolling
    setTimeout(() => {
      this.determineValue();
    }, options.duration || 2000);
  }
  
  /**
   * Determine the value of the die based on its orientation
   */
  determineValue() {
    // In a real implementation, this would determine which face is up
    // and set the value accordingly
    
    // For a d6, we would check which face normal is most aligned with the up vector
    
    // This is a simplified version that just sets a random value
    this.value = Math.floor(Math.random() * 6) + 1;
  }
  
  /**
   * Remove the die from the scene and physics world
   */
  remove() {
    if (this.mesh) {
      this.renderer.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh = null;
    }
    
    if (this.body) {
      this.renderer.world.removeBody(this.body);
      this.body = null;
    }
  }
  
  /**
   * Update die options
   * @param {Object} options - New options
   */
  updateOptions(options) {
    this.options = Object.assign(this.options, options);
    
    // Remove old mesh and body
    this.remove();
    
    // Create new mesh and body with updated options
    this.init();
  }
}

// Export for use in Node.js environments (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiceRenderer, Dice };
}
