/**
 * SudoMail — utils.js
 * Shared helper utilities
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique Message-ID for an email.
 * @returns {string}
 */
function generateMessageId() {
  return `<${uuidv4()}@sudomail>`;
}

/**
 * Format a Date object to RFC 2822 date string.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
function formatDate(date = new Date()) {
  return date.toUTCString().replace('GMT', '+0000');
}

/**
 * Encode a string to base64 (for MIME encoding).
 * @param {string|Buffer} content
 * @returns {string}
 */
function toBase64(content) {
  return Buffer.from(content).toString('base64');
}

/**
 * Wrap a base64 string at 76 characters per line (MIME spec).
 * @param {string} b64
 * @returns {string}
 */
function wrapBase64(b64) {
  return b64.match(/.{1,76}/g).join('\r\n');
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Parse a comma-separated list of emails into an array.
 * @param {string} input
 * @returns {string[]}
 */
function parseEmailList(input) {
  if (!input) return [];
  return input.split(',').map(e => e.trim()).filter(Boolean);
}

module.exports = {
  generateMessageId,
  formatDate,
  toBase64,
  wrapBase64,
  isValidEmail,
  parseEmailList,
};
