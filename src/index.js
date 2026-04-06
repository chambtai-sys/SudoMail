/**
 * SudoMail — index.js
 * Programmatic API
 *
 * @example
 * const sudomail = require('sudomail');
 * sudomail.create({
 *   from: 'me@example.com',
 *   to: ['you@example.com'],
 *   subject: 'Hello!',
 *   body: 'This is a test.',
 *   output: './hello.eml'
 * });
 */

const { generateEml, writeEml } = require('./generator');
const { listTemplates, getTemplate } = require('./templates');
const { generateMessageId, formatDate, isValidEmail, parseEmailList } = require('./utils');

/**
 * Create and save a .eml file.
 * @param {Object} opts
 * @returns {string} Output file path
 */
function create(opts = {}) {
  const content = generateEml(opts);
  const outputPath = opts.output || './output.eml';
  writeEml(content, outputPath);
  return outputPath;
}

/**
 * Generate raw .eml string without writing to disk.
 * @param {Object} opts
 * @returns {string}
 */
function generate(opts = {}) {
  return generateEml(opts);
}

module.exports = {
  create,
  generate,
  listTemplates,
  getTemplate,
  generateMessageId,
  formatDate,
  isValidEmail,
  parseEmailList,
};
