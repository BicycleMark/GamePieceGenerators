// Create seven-segment displays for the digits preview
document.addEventListener('DOMContentLoaded', function() {
    // Create the digits preview
    const digitsPreview = document.getElementById('digits-preview');
    
    // Create three seven-segment displays showing "123"
    const digits = ['1', '2', '3'];
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    
    digits.forEach((digit, index) => {
      const display = document.createElement('div');
      display.className = 'seven-segment';
      display.style.backgroundColor = '#000000';
      digitsPreview.appendChild(display);
      
      // Create segments
      const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      segments.forEach(segmentId => {
        const segment = document.createElement('div');
        segment.className = `segment ${segmentId}`;
        segment.style.backgroundColor = colors[index];
        
        // Set segment on/off based on digit
        if (digit === '1' && (segmentId === 'b' || segmentId === 'c')) {
          segment.classList.add('on');
        } else if (digit === '2' && (segmentId === 'a' || segmentId === 'b' || segmentId === 'd' || segmentId === 'e' || segmentId === 'g')) {
          segment.classList.add('on');
        } else if (digit === '3' && (segmentId === 'a' || segmentId === 'b' || segmentId === 'c' || segmentId === 'd' || segmentId === 'g')) {
          segment.classList.add('on');
        } else {
          segment.classList.add('off');
        }
        
        display.appendChild(segment);
      });
    });
    
    // Create the tiles preview
    const tilesPreview = document.getElementById('tiles-preview');
    
    // Create different tile states
    const tileStates = [
      'default', 'default', 'flagged', 'default',
      'revealed', 'number-1', 'number-2', 'number-3',
      'default', 'revealed', 'mine', 'default'
    ];
    
    tileStates.forEach(state => {
      const tile = document.createElement('div');
      tile.className = 'minesweeper-tile';
      
      if (state !== 'default') {
        if (state === 'revealed' || state.startsWith('number') || state === 'mine') {
          tile.classList.add('revealed');
        }
        
        if (state.startsWith('number') || state === 'flagged' || state === 'mine') {
          tile.classList.add(state);
        }
      }
      
      tilesPreview.appendChild(tile);
    });
    
    // Add animation to cycle through different colors for the digits
    let colorIndex = 0;
    const digitColors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00', '#00ffff'];
    
    setInterval(() => {
      colorIndex = (colorIndex + 1) % digitColors.length;
      const segments = document.querySelectorAll('.seven-segment .segment.on');
      segments.forEach(segment => {
        segment.style.backgroundColor = digitColors[colorIndex];
      });
      document.getElementById('digit-color').textContent = digitColors[colorIndex];
    }, 2000);
    
    // Toggle glow effect
    let glowOn = true;
    setInterval(() => {
      glowOn = !glowOn;
      const segments = document.querySelectorAll('.seven-segment .segment.on');
      segments.forEach(segment => {
        segment.style.filter = glowOn ? 'drop-shadow(0 0 5px currentColor)' : 'none';
      });
      document.getElementById('digit-glow').textContent = glowOn ? 'On' : 'Off';
    }, 3000);
    
    // Cycle through tile colors
    let tileColorIndex = 0;
    const tileColors = ['#4a90e2', '#e24a4a', '#4ae24a', '#e2e24a'];
    
    setInterval(() => {
      tileColorIndex = (tileColorIndex + 1) % tileColors.length;
      const defaultTiles = document.querySelectorAll('.minesweeper-tile:not(.revealed)');
      defaultTiles.forEach(tile => {
        tile.style.backgroundColor = tileColors[tileColorIndex];
      });
      document.getElementById('tile-color').textContent = tileColors[tileColorIndex];
    }, 2500);
    
    // Toggle shadow effect
    let shadowOn = true;
    setInterval(() => {
      shadowOn = !shadowOn;
      const tiles = document.querySelectorAll('.minesweeper-tile');
      tiles.forEach(tile => {
        if (shadowOn) {
          if (tile.classList.contains('revealed')) {
            tile.style.boxShadow = 'inset 1px 1px 0 rgba(0, 0, 0, 0.2), inset -1px -1px 0 rgba(255, 255, 255, 0.7)';
          } else {
            tile.style.boxShadow = 'inset 2px 2px 0 rgba(255, 255, 255, 0.7), inset -2px -2px 0 rgba(0, 0, 0, 0.3)';
          }
        } else {
          tile.style.boxShadow = 'none';
        }
      });
      document.getElementById('tile-shadow').textContent = shadowOn ? 'On' : 'Off';
    }, 3500);
  });