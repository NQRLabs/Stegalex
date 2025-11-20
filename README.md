# Stegalex

Classical text encryption and decryption with independent styling controls.

## Overview

Stegalex is a browser-based tool for transforming text using classical cipher methods. It supports both encoding and decoding across multiple cipher types, with independent font and styling controls for input and output text. Perfect for ARG creators who need to encrypt messages and players who need to decode them.

## Features

### Cipher Methods

- **A1Z26** - Convert letters to numbers (A=1, B=2, ... Z=26)
- **Caesar Cipher** - Shift alphabet by N positions (customizable shift amount)
- **Vigenère Cipher** - Polyalphabetic substitution (custom key)
- **Base64** - Standard Base64 encoding
- **ROT13** - Rotate by 13 places
- **Atbash** - Reverse alphabet (A=Z, B=Y, etc.)
- **Binary** - Convert to binary representation
- **Hexadecimal** - Convert to hexadecimal

### Styling Controls

Each text area (input and output) has independent controls for:

- **Font Family** - Choose from 6 different fonts
- **Font Size** - Adjustable from 12-72px
- **Color** - Full color picker
- **Bold** - Toggle bold text
- **Italic** - Toggle italic text
- **Alignment** - Left, center, or right

### Export Options

- **Copy to Clipboard** - One-click copy of output text
- **Save as Image** - Export output as PNG with styling preserved

### Bidirectional

All ciphers support both encoding and decoding through a simple toggle, making the tool useful for both creators and solvers.

## Usage

### Basic Workflow

1. **Select Cipher Method** - Choose from the dropdown in the control panel
2. **Choose Direction** - Select "Encode" or "Decode"
3. **Set Parameters** - Adjust method-specific parameters (shift amount, key, etc.)
4. **Enter Text** - Type or paste your text in the input area
5. **Style Output** - Customize the appearance of your output
6. **Export** - Copy to clipboard or save as image

### Method-Specific Parameters

**Caesar Cipher**
- Shift Amount: 1-25 (default: 3)

**Vigenère Cipher**
- Key: Alphabetic key for encryption (default: "KEY")

**A1Z26**
- Separator: Character(s) between numbers (default: "-")

**Binary**
- Add spaces between bytes (optional)

**Hexadecimal**
- Uppercase/lowercase toggle
- Add spaces between bytes (optional)

### Styling Workflow

1. Select font family from the dropdown
2. Adjust size using the number input
3. Pick a color with the color picker
4. Toggle bold/italic with the B/I buttons
5. Set alignment (left/center/right)

Input and output can be styled completely independently.

## Technical Details

### Implementation

- **Pure JavaScript** - No external dependencies
- **Real-time transformation** - Output updates as you type
- **Offline-first** - All processing happens in the browser
- **Privacy-focused** - No data leaves your computer

### Cipher Algorithms

- **A1Z26** - Direct character code mapping
- **Caesar** - Modular arithmetic shift
- **Vigenère** - Repeating key polyalphabetic substitution
- **Base64** - Browser native btoa/atob
- **ROT13** - Fixed Caesar shift of 13
- **Atbash** - Alphabet reversal mapping
- **Binary** - Character to 8-bit binary
- **Hex** - Character to hexadecimal

### Image Export

The save-as-image feature uses HTML5 Canvas to render text with all styling applied:

1. Creates canvas based on text dimensions
2. Wraps text to fit within 800px width
3. Applies font, size, color, weight, style, and alignment
4. Exports as PNG with dark background

## Design

### Visual Style

Stegalex features a modern techno aesthetic:

- **Neon accents** - Cyan (#00f0ff) and teal (#00ffaa) highlights
- **Terminal chrome** - Section headers styled like terminal windows
- **Scanline overlay** - Subtle CRT effect
- **Dark theme** - Deep black background (#030508)
- **Professional layout** - Clean dual-panel design

### Responsive Design

- **Desktop**: Control panel left, dual text panels right (split view)
- **Tablet/Mobile**: Stacked layout with collapsible control panel
- **Touch-friendly**: Large tap targets and easy-to-use controls

## Browser Compatibility

Tested on modern evergreen browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Keyboard navigable
- ARIA labels for screen readers
- Respects `prefers-reduced-motion`
- High contrast color scheme
- Focus visible indicators

## Privacy & Security

- **No tracking** - No analytics or data collection
- **No uploads** - All processing happens locally
- **No accounts** - Use immediately without sign-up
- **Open source** - MIT licensed, code is auditable

## Use Cases

### For ARG Creators

- Encode clues and messages
- Test different cipher methods
- Create styled output images
- Verify encoding/decoding pairs

### For ARG Players

- Decode discovered messages
- Try multiple cipher methods quickly
- Copy decoded text for further analysis
- Export solutions as images

### For Educators

- Demonstrate classical ciphers
- Create cipher exercises
- Show encoding/decoding process
- Generate styled examples

## License

MIT License - Copyright (c) 2025 NQR

See LICENSE file for full text.

## Links

- **Website**: [nqrlabs.com](https://nqrlabs.com)
- **Discord**: [CLU Community](https://discord.gg/HT9YE8rvuN)
- **Live App**: [nqrlabs.com/Stegalex](https://nqrlabs.com/Stegalex/)

---

Part of the NQR Labs toolkit for puzzle solvers and ARG creators.
