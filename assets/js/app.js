/**
 * Stegalex - Classical Text Encryption & Decryption
 * MIT License - Copyright (c) 2025 NQR
 *
 * Architecture:
 * - Bidirectional cipher transformation
 * - Independent styling controls for plaintext/ciphertext
 * - Custom font upload support
 * - Copy to clipboard and save as image functionality
 * - Cipher history context for ARG creators/players
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  method: 'a1z26',
  lastEditedField: 'plaintext', // Track which field user is editing
  parameters: {
    caesarShift: 3,
    vigenereKey: 'KEY',
    a1z26Separator: '-',
    binarySpaces: true,
    hexUppercase: true,
    hexSpaces: true 
  },
  plaintextStyle: {
    font: "'Segoe UI', sans-serif",
    customFont: null,
    size: 16,
    color: '#d7e8ff',
    bgColor: '#030508',
    bold: false,
    italic: false,
    align: 'left'
  },
  ciphertextStyle: {
    font: "'Segoe UI', sans-serif",
    customFont: null,
    size: 16,
    color: '#d7e8ff',
    bgColor: '#030508',
    bold: false,
    italic: false,
    align: 'left'
  }
};

// ============================================================================
// DOM ELEMENT REFERENCES (populated on DOMContentLoaded)
// ============================================================================

let cipherMethod, caesarShift, caesarShiftValue, vigenereKey, a1z26Separator;
let binarySpaces, hexUppercase, hexSpaces;
let historyToggle, historyContent, historyText;
let plaintextText, ciphertextText;
let plaintextFont, plaintextFontFile, plaintextSize, plaintextColor, plaintextBgColor, plaintextBold, plaintextItalic, plaintextAlign;
let ciphertextFont, ciphertextFontFile, ciphertextSize, ciphertextColor, ciphertextBgColor, ciphertextBold, ciphertextItalic, ciphertextAlign;
let savePlaintextImage, saveCiphertextImage;
let licenseFooter, licenseModal, licenseOverlay, licenseClose;

// ============================================================================
// CIPHER HISTORY CONTENT
// ============================================================================

const cipherHistory = {
  a1z26: `<p><strong>A1Z26</strong> is one of the simplest letter-to-number encodings, mapping each letter of the alphabet to its position (A=1, B=2, ... Z=26).</p>
<p>While rarely used for serious encryption, A1Z26 appears constantly in ARG puzzles as a first step toward more complex ciphers. Players often encounter strings of numbers and immediately test A1Z26 as a baseline check.</p>
<p>It's a teaching cipher—easy to spot, easy to solve, but useful for layering with other methods. In puzzle design, A1Z26 works well when you want to nudge players without blocking them entirely.</p>`,

  caesar: `<p><strong>Caesar Cipher</strong> is named after Julius Caesar, who used it to protect military messages around 58 BCE. Each letter shifts forward by a fixed number of positions in the alphabet.</p>
<p>The most famous historical use was Caesar's own shift of 3 (A→D, B→E, etc.). The British codebreakers encountered Caesar shifts during WWII as components of more complex German ciphers.</p>
<p>For ARG creators, Caesar is perfect for breadcrumb clues. It's recognizable enough that players feel smart for solving it, but weak enough that it won't stop them for long. Vary the shift amount to keep it interesting. ROT13 (shift of 13) is the most widely recognized variant.</p>`,

  vigenere: `<p><strong>Vigenère Cipher</strong>, developed by Giovan Battista Bellaso in 1553 and misattributed to Blaise de Vigenère, was once called "le chiffre indéchiffrable" (the indecipherable cipher).</p>
<p>It remained unbroken for centuries until Charles Babbage and Friedrich Kasiski independently cracked it in the mid-1800s. The Confederacy used it during the American Civil War. It saw use in early 20th-century espionage before modern cryptanalysis made it obsolete.</p>
<p>In ARGs, Vigenère strikes a sweet spot: not trivial, but solvable with frequency analysis or known plaintext attacks. Players who recognize it feel accomplished. The key itself can be part of the puzzle narrative—a date, a name, a phrase hidden elsewhere in your game.</p>`,

  base64: `<p><strong>Base64</strong> encoding was designed in the 1980s for encoding binary data into ASCII text, primarily for email attachments (MIME) and data URLs.</p>
<p>It's not a cipher—it's an encoding scheme. Anyone can decode it instantly with command-line tools or online decoders. That's the point. It makes binary data safe for text-only transmission.</p>
<p>ARG creators use Base64 when they want to hide data in plain sight without making it challenging. It's a "wrapper" that players can unwrap quickly if they recognize the characteristic trailing equals signs (=, ==). Useful for embedding images or obfuscating URLs without encryption.</p>`,

  rot13: `<p><strong>ROT13</strong> (Rotate by 13 places) is a special case of the Caesar cipher that maps A↔N, B↔O, C↔P, and so on. Applying ROT13 twice returns the original text—it's its own inverse.</p>
<p>It emerged in the 1980s on Usenet newsgroups as a way to obscure spoilers, punchlines, and offensive content without true encryption. The intent was never security—just a trivial barrier to prevent accidental reading.</p>
<p>For ARGs, ROT13 is a wink to players. It signals "this isn't serious encryption, just a light veil." It's nostalgia for old internet culture. Players familiar with forums and early online games will smile when they see it.</p>`,

  atbash: `<p><strong>Atbash</strong> is a Hebrew cipher dating back to around 500 BCE, originally used in the Hebrew Bible (Book of Jeremiah). It reverses the alphabet: A↔Z, B↔Y, C↔X, etc.</p>
<p>The name "Atbash" comes from the first and last letter pairs in Hebrew (Aleph-Tav, Bet-Shin). It's one of the oldest known ciphers. Historically, it appeared in Jewish mysticism (Kabbalah) and biblical commentary.</p>
<p>In ARGs, Atbash is elegant and simple. It's symmetrical—encoding and decoding are the same operation. Use it when you want an ancient or mystical flavor to your puzzle. Players who recognize it will appreciate the historical nod.</p>`,

  binary: `<p><strong>Binary encoding</strong> represents text as sequences of 0s and 1s, with each character typically encoded as an 8-bit byte (ASCII standard from the 1960s).</p>
<p>While not a cipher, binary is the foundation of all modern computing. It's been used in puzzles since the early days of hacker culture and cyberpunk fiction. Players often encounter binary in digital or tech-themed ARGs.</p>
<p>Use binary when you want a computational aesthetic. Long strings of 01100001 01100010 01100011 look intimidating but are trivial to decode with any ASCII converter. It's visual noise that signals "something digital is happening here."</p>`,

  hex: `<p><strong>Hexadecimal encoding</strong> represents each byte as two hex digits (0-9, A-F). It emerged in the 1960s alongside early computing as a more human-readable alternative to binary.</p>
<p>Hex dumps are common in programming, debugging, and reverse engineering. Players familiar with code will immediately recognize hex patterns. It's used in color codes (#00F0FF), memory addresses, and low-level data inspection.</p>
<p>In ARGs, hex is compact and technical. Use it for URLs, file names, or embedded data. It's less visually overwhelming than binary but still signals "technical puzzle ahead." Players can decode it with any hex-to-text converter.</p>`
};

// ============================================================================
// CIPHER METHODS
// ============================================================================

/**
 * A1Z26 - Convert letters to numbers (A=1, B=2, ... Z=26)
 */
function a1z26Encode(text) {
  const separator = state.parameters.a1z26Separator;

  // Split by spaces to preserve word boundaries
  return text.split(' ').map(word => {
    return word
      .toUpperCase()
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return (code - 64).toString();
        }
        return char;
      })
      .join(separator);
  }).join(' ');
}

function a1z26Decode(text) {
  const separator = state.parameters.a1z26Separator;

  // Split by spaces to preserve word boundaries
  return text.split(' ').map(word => {
    const parts = word.split(separator);
    return parts
      .map(part => {
        const num = parseInt(part.trim());
        if (!isNaN(num) && num >= 1 && num <= 26) {
          return String.fromCharCode(num + 64);
        }
        return part;
      })
      .join('');
  }).join(' ');
}

/**
 * Caesar Cipher - Shift alphabet by N positions
 */
function caesarEncode(text) {
  const shift = state.parameters.caesarShift;
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

function caesarDecode(text) {
  const shift = 26 - state.parameters.caesarShift;
  const originalShift = state.parameters.caesarShift;
  state.parameters.caesarShift = shift;
  const result = caesarEncode(text);
  state.parameters.caesarShift = originalShift;
  return result;
}

/**
 * Vigenère Cipher - Polyalphabetic substitution
 */
function vigenereEncode(text) {
  const key = state.parameters.vigenereKey.toUpperCase().replace(/[^A-Z]/g, '');
  if (key.length === 0) return text;

  let keyIndex = 0;
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        const shift = key.charCodeAt(keyIndex % key.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        const shift = key.charCodeAt(keyIndex % key.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

function vigenereDecode(text) {
  const key = state.parameters.vigenereKey.toUpperCase().replace(/[^A-Z]/g, '');
  if (key.length === 0) return text;

  let keyIndex = 0;
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        const shift = key.charCodeAt(keyIndex % key.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        const shift = key.charCodeAt(keyIndex % key.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      return char;
    })
    .join('');
}

/**
 * Base64 - Standard Base64 encoding
 */
function base64Encode(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text) {
  try {
    return decodeURIComponent(escape(atob(text.trim())));
  } catch (e) {
    return '[Invalid Base64]';
  }
}

/**
 * ROT13 - Rotate by 13 places
 */
function rot13(text) {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      return char;
    })
    .join('');
}

/**
 * Atbash - Reverse alphabet (A=Z, B=Y, etc.)
 */
function atbash(text) {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(90 - (code - 65));
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(122 - (code - 97));
      }
      return char;
    })
    .join('');
}

/**
 * Binary - Convert to binary representation
 */
function binaryEncode(text) {
  const binary = text
    .split('')
    .map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    })
    .join(state.parameters.binarySpaces ? ' ' : '');
  return binary;
}

function binaryDecode(text) {
  const cleaned = text.replace(/\s/g, '');
  const bytes = cleaned.match(/.{1,8}/g) || [];
  return bytes
    .map(byte => {
      const num = parseInt(byte, 2);
      return isNaN(num) ? '' : String.fromCharCode(num);
    })
    .join('');
}

/**
 * Hexadecimal - Convert to hex representation
 */
function hexEncode(text) {
  const hex = text
    .split('')
    .map(char => {
      const h = char.charCodeAt(0).toString(16).padStart(2, '0');
      return state.parameters.hexUppercase ? h.toUpperCase() : h;
    })
    .join(state.parameters.hexSpaces ? ' ' : '');
  return hex;
}

function hexDecode(text) {
  const cleaned = text.replace(/\s/g, '');
  const bytes = cleaned.match(/.{1,2}/g) || [];
  return bytes
    .map(byte => {
      const num = parseInt(byte, 16);
      return isNaN(num) ? '' : String.fromCharCode(num);
    })
    .join('');
}

// ============================================================================
// TRANSFORMATION LOGIC
// ============================================================================

/**
 * Transform text based on current method and direction
 */
function encode(input) {
  if (input === '') return '';

  try {
    switch (state.method) {
      case 'a1z26': return a1z26Encode(input);
      case 'caesar': return caesarEncode(input);
      case 'vigenere': return vigenereEncode(input);
      case 'base64': return base64Encode(input);
      case 'rot13': return rot13(input);
      case 'atbash': return atbash(input);
      case 'binary': return binaryEncode(input);
      case 'hex': return hexEncode(input);
      default: return input;
    }
  } catch (e) {
    return '[Error: ' + e.message + ']';
  }
}

function decode(input) {
  if (input === '') return '';

  try {
    switch (state.method) {
      case 'a1z26': return a1z26Decode(input);
      case 'caesar': return caesarDecode(input);
      case 'vigenere': return vigenereDecode(input);
      case 'base64': return base64Decode(input);
      case 'rot13': return rot13(input);
      case 'atbash': return atbash(input);
      case 'binary': return binaryDecode(input);
      case 'hex': return hexDecode(input);
      default: return input;
    }
  } catch (e) {
    return '[Error: ' + e.message + ']';
  }
}

/**
 * Transform based on which field was last edited
 */
function transformText() {
  if (state.lastEditedField === 'plaintext') {
    // Encode plaintext → ciphertext
    const input = plaintextText.value;
    ciphertextText.value = encode(input);
  } else {
    // Decode ciphertext → plaintext
    const input = ciphertextText.value;
    plaintextText.value = decode(input);
  }
}


/**
 * Update visible parameter controls based on selected method
 */
function updateParameterVisibility() {
  const paramGroups = document.querySelectorAll('.parameter-group');
  paramGroups.forEach(group => group.classList.remove('active'));

  const methodMap = {
    'caesar': 'caesar',
    'vigenere': 'vigenere',
    'a1z26': 'a1z26',
    'binary': 'binary',
    'hex': 'hex'
  };

  const targetMethod = methodMap[state.method] || 'default';
  const targetGroup = document.querySelector(`.parameter-group[data-method="${targetMethod}"]`);
  if (targetGroup) {
    targetGroup.classList.add('active');
  } else {
    const defaultGroup = document.querySelector('.parameter-group[data-method="default"]');
    if (defaultGroup) defaultGroup.classList.add('active');
  }
}

/**
 * Update cipher history text
 */
function updateCipherHistory() {
  historyText.innerHTML = cipherHistory[state.method] || '<p>No history available for this method.</p>';
}

/**
 * Update placeholder examples based on current cipher
 */
function updatePlaceholders() {
  const exampleWord = 'hello';
  const exampleEncoded = encode(exampleWord);

  plaintextText.placeholder = `Enter plaintext here... Example: ${exampleWord}`;
  ciphertextText.placeholder = `Enter ciphertext here... Example: ${exampleEncoded}`;
}

// ============================================================================
// STYLING FUNCTIONS
// ============================================================================

/**
 * Apply styling to plaintext textarea
 */
function applyPlaintextStyling() {
  const font = state.plaintextStyle.customFont || state.plaintextStyle.font;
  plaintextText.style.fontFamily = font;
  plaintextText.style.fontSize = state.plaintextStyle.size + 'px';
  plaintextText.style.color = state.plaintextStyle.color;
  plaintextText.style.backgroundColor = state.plaintextStyle.bgColor;
  plaintextText.style.fontWeight = state.plaintextStyle.bold ? 'bold' : 'normal';
  plaintextText.style.fontStyle = state.plaintextStyle.italic ? 'italic' : 'normal';
  plaintextText.style.textAlign = state.plaintextStyle.align;
}

/**
 * Apply styling to ciphertext textarea
 */
function applyCiphertextStyling() {
  const font = state.ciphertextStyle.customFont || state.ciphertextStyle.font;
  ciphertextText.style.fontFamily = font;
  ciphertextText.style.fontSize = state.ciphertextStyle.size + 'px';
  ciphertextText.style.color = state.ciphertextStyle.color;
  ciphertextText.style.backgroundColor = state.ciphertextStyle.bgColor;
  ciphertextText.style.fontWeight = state.ciphertextStyle.bold ? 'bold' : 'normal';
  ciphertextText.style.fontStyle = state.ciphertextStyle.italic ? 'italic' : 'normal';
  ciphertextText.style.textAlign = state.ciphertextStyle.align;
}

/**
 * Load custom font from file
 */
async function loadCustomFont(file, target) {
  const fontName = 'CustomFont_' + Date.now();
  const fontUrl = URL.createObjectURL(file);

  const fontFace = new FontFace(fontName, `url(${fontUrl})`);

  try {
    await fontFace.load();
    document.fonts.add(fontFace);

    if (target === 'plaintext') {
      state.plaintextStyle.customFont = fontName;
      applyPlaintextStyling();
    } else {
      state.ciphertextStyle.customFont = fontName;
      applyCiphertextStyling();
    }
  } catch (error) {
    alert('Failed to load font file. Please try a different file.');
    if (target === 'plaintext') {
      plaintextFont.value = state.plaintextStyle.font;
    } else {
      ciphertextFont.value = state.ciphertextStyle.font;
    }
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Save textarea content as image
 * Matches visible text as closely as possible
 */
function saveAsImage(textarea, styleObj, filename) {
  const text = textarea.value;
  if (!text) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Get textarea computed style for accurate rendering
  const computedStyle = window.getComputedStyle(textarea);
  const padding = 20;
  const lineHeight = styleObj.size * 1.6;

  // Set font to measure text accurately
  const fontWeight = styleObj.bold ? 'bold' : 'normal';
  const fontStyle = styleObj.italic ? 'italic' : 'normal';
  const fontFamily = styleObj.customFont || styleObj.font;
  ctx.font = `${fontStyle} ${fontWeight} ${styleObj.size}px ${fontFamily}`;

  // Get textarea width for text wrapping
  const textareaWidth = textarea.clientWidth - 40; // Account for textarea padding
  const maxWidth = Math.max(400, textareaWidth);

  // Split text into lines respecting newlines and wrapping
  const lines = [];
  const paragraphs = text.split('\n');

  paragraphs.forEach(paragraph => {
    if (paragraph === '') {
      lines.push('');
      return;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth - padding * 2) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
  });

  // Calculate canvas dimensions based on content
  canvas.width = maxWidth;
  canvas.height = Math.max(100, lines.length * lineHeight + padding * 2);

  // Fill background
  ctx.fillStyle = styleObj.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Redraw text (font context is lost after canvas resize)
  ctx.fillStyle = styleObj.color;
  ctx.font = `${fontStyle} ${fontWeight} ${styleObj.size}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  lines.forEach((line, index) => {
    let x = padding;

    if (styleObj.align === 'center') {
      const metrics = ctx.measureText(line);
      x = (canvas.width - metrics.width) / 2;
    } else if (styleObj.align === 'right') {
      const metrics = ctx.measureText(line);
      x = canvas.width - metrics.width - padding;
    }

    const y = padding + index * lineHeight;
    ctx.fillText(line, x, y);
  });

  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
  // Cipher method change
    cipherMethod.addEventListener('change', function() {
    state.method = this.value;
    updateParameterVisibility();
    updateCipherHistory();
    updatePlaceholders();
    transformText();
  });
  
  // Parameter controls
  caesarShift.addEventListener('input', function() {
    state.parameters.caesarShift = parseInt(this.value);
    caesarShiftValue.textContent = this.value;
    updatePlaceholders();
    transformText();
  });

  vigenereKey.addEventListener('input', function() {
    state.parameters.vigenereKey = this.value;
    updatePlaceholders();
    transformText();
  });

  a1z26Separator.addEventListener('input', function() {
    state.parameters.a1z26Separator = this.value;
    updatePlaceholders();
    transformText();
  });

  binarySpaces.addEventListener('change', function() {
    state.parameters.binarySpaces = this.checked;
    updatePlaceholders();
    transformText();
  });

  hexUppercase.addEventListener('change', function() {
    state.parameters.hexUppercase = this.checked;
    updatePlaceholders();
    transformText();
  });

  hexSpaces.addEventListener('change', function() {
    state.parameters.hexSpaces = this.checked;
    updatePlaceholders();
    transformText();
  });
  
  // History toggle
  historyToggle.addEventListener('click', function() {
    this.classList.toggle('collapsed');
    historyContent.classList.toggle('collapsed');
  });
  
  // ============================================================================
  // EVENT LISTENERS - TEXT INPUT (Bidirectional)
  // ============================================================================
  
  plaintextText.addEventListener('input', function() {
    state.lastEditedField = 'plaintext';
    transformText();
  });
  
  ciphertextText.addEventListener('input', function() {
    state.lastEditedField = 'ciphertext';
    transformText();
  });
  
  // ============================================================================
  // EVENT LISTENERS - STYLING CONTROLS
  // ============================================================================
  
  // Plaintext styling
  plaintextFont.addEventListener('change', function() {
    if (this.value === 'custom') {
      plaintextFontFile.click();
    } else {
      state.plaintextStyle.font = this.value;
      state.plaintextStyle.customFont = null;
      applyPlaintextStyling();
    }
  });
  
  plaintextFontFile.addEventListener('change', function() {
    if (this.files.length > 0) {
      loadCustomFont(this.files[0], 'plaintext');
    } else {
      plaintextFont.value = state.plaintextStyle.font;
    }
  });
  
  plaintextSize.addEventListener('input', function() {
    state.plaintextStyle.size = parseInt(this.value);
    applyPlaintextStyling();
  });
  
  plaintextColor.addEventListener('input', function() {
    state.plaintextStyle.color = this.value;
    applyPlaintextStyling();
  });

  plaintextBgColor.addEventListener('input', function() {
    state.plaintextStyle.bgColor = this.value;
    applyPlaintextStyling();
  });

  plaintextBold.addEventListener('click', function() {
    state.plaintextStyle.bold = !state.plaintextStyle.bold;
    this.classList.toggle('active', state.plaintextStyle.bold);
    applyPlaintextStyling();
  });
  
  plaintextItalic.addEventListener('click', function() {
    state.plaintextStyle.italic = !state.plaintextStyle.italic;
    this.classList.toggle('active', state.plaintextStyle.italic);
    applyPlaintextStyling();
  });
  
  plaintextAlign.addEventListener('change', function() {
    state.plaintextStyle.align = this.value;
    applyPlaintextStyling();
  });
  
  // Ciphertext styling
  ciphertextFont.addEventListener('change', function() {
    if (this.value === 'custom') {
      ciphertextFontFile.click();
    } else {
      state.ciphertextStyle.font = this.value;
      state.ciphertextStyle.customFont = null;
      applyCiphertextStyling();
    }
  });
  
  ciphertextFontFile.addEventListener('change', function() {
    if (this.files.length > 0) {
      loadCustomFont(this.files[0], 'ciphertext');
    } else {
      ciphertextFont.value = state.ciphertextStyle.font;
    }
  });
  
  ciphertextSize.addEventListener('input', function() {
    state.ciphertextStyle.size = parseInt(this.value);
    applyCiphertextStyling();
  });
  
  ciphertextColor.addEventListener('input', function() {
    state.ciphertextStyle.color = this.value;
    applyCiphertextStyling();
  });

  ciphertextBgColor.addEventListener('input', function() {
    state.ciphertextStyle.bgColor = this.value;
    applyCiphertextStyling();
  });

  ciphertextBold.addEventListener('click', function() {
    state.ciphertextStyle.bold = !state.ciphertextStyle.bold;
    this.classList.toggle('active', state.ciphertextStyle.bold);
    applyCiphertextStyling();
  });
  
  ciphertextItalic.addEventListener('click', function() {
    state.ciphertextStyle.italic = !state.ciphertextStyle.italic;
    this.classList.toggle('active', state.ciphertextStyle.italic);
    applyCiphertextStyling();
  });
  
  ciphertextAlign.addEventListener('change', function() {
    state.ciphertextStyle.align = this.value;
    applyCiphertextStyling();
  });
  
  // ============================================================================
  // EVENT LISTENERS - ACTIONS
  // ============================================================================

  savePlaintextImage.addEventListener('click', function() {
    saveAsImage(plaintextText, state.plaintextStyle, 'stegalex-plaintext.png');
    const originalText = this.textContent;
    this.textContent = '✓';
    setTimeout(() => {
      this.textContent = originalText;
    }, 1000);
  });

  saveCiphertextImage.addEventListener('click', function() {
    saveAsImage(ciphertextText, state.ciphertextStyle, 'stegalex-ciphertext.png');
    const originalText = this.textContent;
    this.textContent = '✓';
    setTimeout(() => {
      this.textContent = originalText;
    }, 1000);
  });
  
  // ============================================================================
  // EVENT LISTENERS - MODAL
  // ============================================================================
  
  licenseFooter.addEventListener('click', function() {
    licenseModal.classList.add('active');
    licenseOverlay.classList.add('active');
  });
  
  licenseClose.addEventListener('click', function() {
    licenseModal.classList.remove('active');
    licenseOverlay.classList.remove('active');
  });
  
  licenseOverlay.addEventListener('click', function() {
    licenseModal.classList.remove('active');
    licenseOverlay.classList.remove('active');
  });
  
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && licenseModal.classList.contains('active')) {
        licenseModal.classList.remove('active');
        licenseOverlay.classList.remove('active');
      }
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Get all DOM element references
  cipherMethod = document.getElementById('cipherMethod');
  caesarShift = document.getElementById('caesarShift');
  caesarShiftValue = document.getElementById('caesarShiftValue');
  vigenereKey = document.getElementById('vigenereKey');
  a1z26Separator = document.getElementById('a1z26Separator');
  binarySpaces = document.getElementById('binarySpaces');
  hexUppercase = document.getElementById('hexUppercase');
  hexSpaces = document.getElementById('hexSpaces');
  historyToggle = document.getElementById('historyToggle');
  historyContent = document.getElementById('historyContent');
  historyText = document.getElementById('historyText');
  plaintextText = document.getElementById('plaintextText');
  ciphertextText = document.getElementById('ciphertextText');
  plaintextFont = document.getElementById('plaintextFont');
  plaintextFontFile = document.getElementById('plaintextFontFile');
  plaintextSize = document.getElementById('plaintextSize');
  plaintextColor = document.getElementById('plaintextColor');
  plaintextBgColor = document.getElementById('plaintextBgColor');
  plaintextBold = document.getElementById('plaintextBold');
  plaintextItalic = document.getElementById('plaintextItalic');
  plaintextAlign = document.getElementById('plaintextAlign');
  ciphertextFont = document.getElementById('ciphertextFont');
  ciphertextFontFile = document.getElementById('ciphertextFontFile');
  ciphertextSize = document.getElementById('ciphertextSize');
  ciphertextColor = document.getElementById('ciphertextColor');
  ciphertextBgColor = document.getElementById('ciphertextBgColor');
  ciphertextBold = document.getElementById('ciphertextBold');
  ciphertextItalic = document.getElementById('ciphertextItalic');
  ciphertextAlign = document.getElementById('ciphertextAlign');
  savePlaintextImage = document.getElementById('savePlaintextImage');
  saveCiphertextImage = document.getElementById('saveCiphertextImage');
  licenseFooter = document.getElementById('licenseFooter');
  licenseModal = document.getElementById('licenseModal');
  licenseOverlay = document.getElementById('licenseOverlay');
  licenseClose = document.getElementById('licenseClose');

  // Set up all event listeners
  setupEventListeners();

  // Apply initial styling
  applyPlaintextStyling();
  applyCiphertextStyling();

  // Show correct parameter group
  updateParameterVisibility();

  // Update cipher history
  updateCipherHistory();

  // Update placeholders
  updatePlaceholders();

  // Start with history collapsed
//  historyToggle.classList.add('collapsed');
//  historyContent.classList.add('collapsed');

  // Initial transform
  transformText();
});
