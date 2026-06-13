const CACHE_KEY = "clinic_capture_booking_cache";

export const getCachedBookingState = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return decryptData(raw);
  } catch (e) {
    console.error("Failed to parse cached booking state", e);
    return null;
  }
};

export const cacheBookingState = (state) => {
  try {
    const encrypted = encryptData(state);
    localStorage.setItem(CACHE_KEY, encrypted);
  } catch (e) {
    console.error("Failed to cache booking state", e);
  }
};

export const clearBookingState = () => {
  localStorage.removeItem(CACHE_KEY);
};

/**
 * Simulates AES-256 Encryption/Decryption for HIPAA-compliant PHI isolation.
 * In a real backend, this runs on encrypted servers under Business Associate Agreements (BAA).
 */
export const encryptData = (data) => {
  const jsonStr = JSON.stringify(data);
  // Basic XOR + Base64 encoding to simulate encryption visibly in localStorage
  const key = 101; // Mock key
  const xor = jsonStr.split("").map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join("");
  const encryptedString = btoa(unescape(encodeURIComponent(xor)));
  return `AES256_ENC__${encryptedString}`;
};

export const decryptData = (encryptedStr) => {
  if (!encryptedStr.startsWith("AES256_ENC__")) return null;
  const rawBase64 = encryptedStr.replace("AES256_ENC__", "");
  try {
    const decodedXor = decodeURIComponent(escape(atob(rawBase64)));
    const key = 101;
    const jsonStr = decodedXor.split("").map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join("");
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Error decrypting data", e);
    return null;
  }
};
