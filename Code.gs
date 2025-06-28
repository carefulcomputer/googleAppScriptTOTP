/**
 * Generates a TOTP (Time-based One-Time Password) compatible with Google Authenticator
 * @param {string} seed - Base32 encoded seed key
 * @param {number} [timeStep=30] - Time step in seconds (default 30)
 * @param {number} [digits=6] - Number of digits in the TOTP (default 6)
 * @param {number} [timestamp=null] - Custom timestamp (for testing, default uses current time)
 * @return {string} TOTP code
 */
function _generateTOTP(seed, timeStep = 30, digits = 6, timestamp = null) {
  // Use current timestamp if not provided
  if (timestamp === null) {
    timestamp = Math.floor(Date.now() / 1000);
  }
  
  // Calculate time counter
  const timeCounter = Math.floor(timestamp / timeStep);
  
  // Convert seed from Base32 to bytes
  const keyBytes = _base32Decode(seed);
  
  // Convert time counter to 8-byte array (big-endian) - following OTPAuth pattern
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setUint32(4, timeCounter, false); // big-endian, lower 32 bits
  const timeBytes = Array.from(new Uint8Array(buffer));
  
  // Calculate HMAC-SHA1 - using Google Apps Script utilities correctly
  const hmac = _computeHmacSha1(timeBytes, keyBytes);
  
  // Dynamic truncation - following RFC 6238
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = 
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  
  // Generate TOTP code
  const otp = binary % Math.pow(10, digits);
  
  // Pad with leading zeros
  return otp.toString().padStart(digits, '0');
}

/**
 * Decodes a Base32 encoded string to bytes
 * @param {string} base32String - Base32 encoded string
 * @return {number[]} Array of bytes
 * @private
 */
function _base32Decode(base32String) {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const base32Lookup = {};
  
  // Create lookup table
  for (let i = 0; i < base32Chars.length; i++) {
    base32Lookup[base32Chars[i]] = i;
  }
  
  // Remove padding and convert to uppercase
  const cleanInput = base32String.replace(/=/g, '').toUpperCase();
  
  let bits = 0;
  let value = 0;
  let output = [];
  
  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    if (!(char in base32Lookup)) {
      throw new Error('Invalid Base32 character: ' + char);
    }
    
    value = (value << 5) | base32Lookup[char];
    bits += 5;
    
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  
  return output;
}



/**
 * Compute HMAC-SHA1 using Google Apps Script utilities
 * @param {number[]} data - Data as byte array
 * @param {number[]} key - Key as byte array  
 * @return {number[]} HMAC result as byte array
 * @private
 */
function _computeHmacSha1(data, key) {
  // Convert arrays to blobs for Google Apps Script
  const dataBlob = Utilities.newBlob(data);
  const keyBlob = Utilities.newBlob(key);
  
  // Compute HMAC using Google Apps Script utilities
  const signature = Utilities.computeHmacSignature(
    Utilities.MacAlgorithm.HMAC_SHA_1,
    dataBlob.getBytes(),
    keyBlob.getBytes()
  );
  
  // Convert to array of unsigned bytes
  const result = [];
  for (let i = 0; i < signature.length; i++) {
    result.push(signature[i] & 0xff);
  }
  
  return result;
}


/**
 * Get the TOTP seed from script properties
 * @return {string} Base32 encoded seed from SEED property
 * @private
 */
function _getSeedFromProperties() {
  const properties = PropertiesService.getScriptProperties();
  const seed = properties.getProperty('SEED');
  
  if (!seed) {
    throw new Error('SEED property not found. Please set it first using setSeed() function.');
  }
  
  return seed;
}

/**
 * Generate TOTP using seed from script properties
 * @return {string} Current TOTP code
 */
function getTOTP() {
  const seed = _getSeedFromProperties();
  return _generateTOTP(seed);
}

function test() {
  console.log(getTOTP())
}
 