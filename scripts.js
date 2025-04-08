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
    
    // Create the checker pieces preview
    const checkersPreview = document.getElementById('checkers-preview');
    
    // Create checker pieces (red, red-king, black, black-king)
    const createCheckerPiece = (color, isKing) => {
      const pieceContainer = document.createElement('div');
      pieceContainer.style.width = '60px';
      pieceContainer.style.height = '60px';
      pieceContainer.style.position = 'relative';
      
      const piece = document.createElement('div');
      piece.style.width = '100%';
      piece.style.height = '100%';
      piece.style.borderRadius = '50%';
      piece.style.position = 'relative';
      
      if (color === 'red') {
        piece.style.backgroundColor = '#e74c3c';
        piece.style.border = '3px solid #c0392b';
        piece.style.boxShadow = 'inset 0 10px 15px rgba(255, 255, 255, 0.3), inset 0 -10px 15px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.2)';
      } else {
        piece.style.backgroundColor = '#2c3e50';
        piece.style.border = '3px solid #1a2530';
        piece.style.boxShadow = 'inset 0 10px 15px rgba(255, 255, 255, 0.2), inset 0 -10px 15px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.2)';
      }
      
      pieceContainer.appendChild(piece);
      
      if (isKing) {
        const crown = document.createElement('div');
        crown.style.position = 'absolute';
        crown.style.top = '50%';
        crown.style.left = '50%';
        crown.style.transform = 'translate(-50%, -50%)';
        crown.style.width = '30px';
        crown.style.height = '15px';
        crown.style.backgroundColor = '#f1c40f';
        crown.style.clipPath = 'polygon(0% 100%, 20% 50%, 40% 100%, 60% 50%, 80% 100%, 100% 50%, 100% 100%)';
        crown.style.zIndex = '2';
        
        piece.appendChild(crown);
      }
      
      return pieceContainer;
    };
    
    // Add the pieces to the preview
    if (checkersPreview) {
      checkersPreview.appendChild(createCheckerPiece('red', false));
      checkersPreview.appendChild(createCheckerPiece('red', true));
      checkersPreview.appendChild(createCheckerPiece('black', false));
      checkersPreview.appendChild(createCheckerPiece('black', true));
    }
    
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
    
    // Cycle through checker piece colors
    let checkerColorIndex = 0;
    const checkerColors = ['#e74c3c', '#9b59b6', '#3498db', '#2ecc71'];
    const checkerBorderColors = ['#c0392b', '#8e44ad', '#2980b9', '#27ae60'];
    
    setInterval(() => {
      checkerColorIndex = (checkerColorIndex + 1) % checkerColors.length;
      
      if (checkersPreview) {
        const redPieces = checkersPreview.querySelectorAll('div > div:first-child');
        
        redPieces.forEach((piece, index) => {
          if (index % 2 === 0) { // Only update red pieces
            piece.style.backgroundColor = checkerColors[checkerColorIndex];
            piece.style.borderColor = checkerBorderColors[checkerColorIndex];
          }
        });
      }
      
      const checkerColorElement = document.getElementById('checker-color');
      if (checkerColorElement) {
        checkerColorElement.textContent = checkerColors[checkerColorIndex];
      }
    }, 2800);
    
    // Cycle through crown colors
    let crownColorIndex = 0;
    const crownColors = ['#f1c40f', '#e67e22', '#f39c12', '#d35400'];
    
    setInterval(() => {
      crownColorIndex = (crownColorIndex + 1) % crownColors.length;
      
      if (checkersPreview) {
        const crowns = checkersPreview.querySelectorAll('div > div > div');
        
        crowns.forEach(crown => {
          crown.style.backgroundColor = crownColors[crownColorIndex];
        });
      }
      
      let crownColorName;
      switch (crownColorIndex) {
        case 0: crownColorName = 'Gold'; break;
        case 1: crownColorName = 'Orange'; break;
        case 2: crownColorName = 'Amber'; break;
        case 3: crownColorName = 'Bronze'; break;
      }
      
      const checkerCrownElement = document.getElementById('checker-crown');
      if (checkerCrownElement) {
        checkerCrownElement.textContent = crownColorName;
      }
    }, 3200);
  });
