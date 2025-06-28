# Google Apps Script TOTP Generator

A Google Apps Script implementation for generating TOTP (Time-based One-Time Password) codes compatible with Google Authenticator and other authenticator apps.

## Overview

This script provides a simple function to generate TOTP codes using the RFC 6238 standard. It includes:

- **Base32 decoding** for seed keys
- **HMAC-SHA1 computation** using Google Apps Script utilities
- **Dynamic truncation** following RFC 6238
- **Secure seed storage** using Google Apps Script Properties Service
- **Simple interface** with just one main function: `getTOTP()`

## Setup

1. **Create a new Google Apps Script project**
   - Go to [script.google.com](https://script.google.com)
   - Create a new project
   - Replace the default code with the contents of `Code.gs`

2. **Set your TOTP seed**
   - Your seed should be a 32-character Base32 encoded string
   - In the Apps Script editor, go to **Project Settings** (gear icon in sidebar)
   - Scroll down to **Script Properties**
   - Click **Add script property**
   - Set **Property**: `SEED`
   - Set **Value**: Your 32-character Base32 seed (e.g., `JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP`)
   - Click **Save script property**

## Usage

### Main Functions

#### `getTOTP()`
Generates a TOTP code using the seed stored in Script Properties. This is the main function you'll use.
```javascript
const code = getTOTP();
console.log(code); // Returns 6-digit TOTP code
```

#### `test()` (Development Function)
A simple test function that calls `getTOTP()` and logs the result to the console.
```javascript
test(); // Logs current TOTP code to console
```

### Example Usage

```javascript
// Generate current TOTP code using seed from Script Properties
const currentCode = getTOTP();
console.log('Current TOTP:', currentCode);

// Or use the test function for quick testing
test(); // This will log the TOTP code to console
```

## Technical Details

### Algorithm
- **Hash Function**: HMAC-SHA1
- **Time Step**: 30 seconds (configurable)
- **Code Length**: 6 digits (configurable)
- **Counter**: Unix timestamp divided by time step
- **Encoding**: Base32 for seed keys

### Security
- Seeds are stored securely using Google Apps Script's Properties Service
- No sensitive data is logged or exposed
- Compatible with RFC 6238 standard

### Dependencies
- Google Apps Script `Utilities` service for HMAC computation
- Google Apps Script `PropertiesService` for secure storage

## Testing

Use the built-in `test()` function to quickly verify your TOTP generation:

```javascript
// Run the test function to see current TOTP code
test();
```

The script uses the current timestamp and your stored seed to generate codes. For development and debugging, check the execution logs in the Google Apps Script editor.

## Compatibility

This implementation is compatible with:
- Google Authenticator
- Authy
- Microsoft Authenticator
- Any RFC 6238 compliant TOTP app

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Disclaimer

This code is provided for educational and personal use. Use at your own risk. Always test thoroughly before using in production environments. 