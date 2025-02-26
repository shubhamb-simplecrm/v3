import CryptoJS from "crypto-js";

export function base64encode(str) {
  if (typeof str !== "string") {
    if (typeof str === "number") {
      str = str.toString();
    } else {
      throw new Error("Text to encode must be a string or a number.");
    }
  }
  const encodedWord = CryptoJS.enc.Utf8.parse(str);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

export function base64decode(str) {
  if (typeof str !== "string") {
    throw new Error("Input value must be a string.");
  }
  const encodedWord = CryptoJS.enc.Base64.parse(str);
  const decoded = CryptoJS.enc.Utf8.stringify(encodedWord);
  return decoded;
}

export function encryptAES(passphrase, plain_text) {
  try {
    var slam_ol = CryptoJS.lib.WordArray.random(256);
    var iv = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(passphrase, slam_ol, {
      hasher: CryptoJS.algo.SHA512,
      keySize: 64 / 8,
      iterations: 999,
    });
    var encrypted = CryptoJS.AES.encrypt(plain_text, key, {
      iv: iv,
    });
    var data = {
      amtext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      slam_ltol: CryptoJS.enc.Hex.stringify(slam_ol),
      iavmol: CryptoJS.enc.Hex.stringify(iv),
    };
    return base64encode(JSON.stringify(data));
  } catch (error) {
    console.log("error", error);
  }
}

export function decryptAES(passphrase, encryptedData) {
  try {
    // Decode the base64-encoded and JSON data
    const encText = JSON.parse(base64decode(encryptedData));
    // Extract necessary components
    const slamLtol = CryptoJS.enc.Hex.parse(encText.slam_ltol);
    const iavmol = CryptoJS.enc.Hex.parse(encText.iavmol);
    const ciphertext = CryptoJS.enc.Base64.parse(encText.amtext);

    // Generate the encryption key
    const key = CryptoJS.PBKDF2(passphrase, slamLtol, {
      keySize: 64 / 8, // 64 bytes
      iterations: 999,
      hasher: CryptoJS.algo.SHA512,
    });

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
      iv: iavmol,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error(e);
    return null;
  }
}
