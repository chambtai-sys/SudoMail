/**
 * SudoMail — generator.js
 * Builds valid .eml files with full MIME support
 */

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { generateMessageId, formatDate, toBase64, wrapBase64 } = require('./utils');

const CRLF = '\r\n';
const BOUNDARY_PREFIX = '----=_SudoMailPart_';

function generateBoundary() {
  return BOUNDARY_PREFIX + Date.now().toString(36).toUpperCase();
}

function buildHeaders({ from, to, cc, bcc, subject, messageId, date, contentType }) {
  const headers = [];
  headers.push(`From: ${from}`);
  headers.push(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
  if (cc && cc.length) headers.push(`Cc: ${Array.isArray(cc) ? cc.join(', ') : cc}`);
  if (bcc && bcc.length) headers.push(`Bcc: ${Array.isArray(bcc) ? bcc.join(', ') : bcc}`);
  headers.push(`Subject: ${subject}`);
  headers.push(`Date: ${date || formatDate()}`);
  headers.push(`Message-ID: ${messageId || generateMessageId()}`);
  headers.push(`MIME-Version: 1.0`);
  headers.push(`Content-Type: ${contentType}`);
  return headers.join(CRLF);
}

function buildPlainEmail(opts) {
  const headers = buildHeaders({ ...opts, contentType: 'text/plain; charset=UTF-8' });
  return headers + CRLF + CRLF + (opts.body || '');
}

function buildHtmlEmail(opts) {
  const boundary = generateBoundary();
  const headers = buildHeaders({ ...opts, contentType: `multipart/alternative; boundary="${boundary}"` });

  const parts = [];
  parts.push(`--${boundary}`);
  parts.push('Content-Type: text/plain; charset=UTF-8');
  parts.push('');
  parts.push(opts.body || 'View this email in an HTML-capable email client.');
  parts.push('');
  parts.push(`--${boundary}`);
  parts.push('Content-Type: text/html; charset=UTF-8');
  parts.push('');
  parts.push(opts.html);
  parts.push('');
  parts.push(`--${boundary}--`);

  return headers + CRLF + CRLF + parts.join(CRLF);
}

function buildEmailWithAttachments(opts) {
  const outerBoundary = generateBoundary();
  const headers = buildHeaders({ ...opts, contentType: `multipart/mixed; boundary="${outerBoundary}"` });

  const parts = [];

  if (opts.html) {
    const innerBoundary = generateBoundary() + '_ALT';
    parts.push(`--${outerBoundary}`);
    parts.push(`Content-Type: multipart/alternative; boundary="${innerBoundary}"`);
    parts.push('');
    parts.push(`--${innerBoundary}`);
    parts.push('Content-Type: text/plain; charset=UTF-8');
    parts.push('');
    parts.push(opts.body || 'View this email in an HTML-capable email client.');
    parts.push('');
    parts.push(`--${innerBoundary}`);
    parts.push('Content-Type: text/html; charset=UTF-8');
    parts.push('');
    parts.push(opts.html);
    parts.push('');
    parts.push(`--${innerBoundary}--`);
    parts.push('');
  } else {
    parts.push(`--${outerBoundary}`);
    parts.push('Content-Type: text/plain; charset=UTF-8');
    parts.push('');
    parts.push(opts.body || '');
    parts.push('');
  }

  const attachments = Array.isArray(opts.attach) ? opts.attach : [opts.attach];
  for (const filePath of attachments) {
    if (!filePath || !fs.existsSync(filePath)) {
      console.warn(`⚠️  Attachment not found: ${filePath}`);
      continue;
    }
    const filename = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const fileData = wrapBase64(toBase64(fs.readFileSync(filePath)));

    parts.push(`--${outerBoundary}`);
    parts.push(`Content-Type: ${mimeType}; name="${filename}"`);
    parts.push('Content-Transfer-Encoding: base64');
    parts.push(`Content-Disposition: attachment; filename="${filename}"`);
    parts.push('');
    parts.push(fileData);
    parts.push('');
  }

  parts.push(`--${outerBoundary}--`);
  return headers + CRLF + CRLF + parts.join(CRLF);
}

/**
 * Generate raw .eml content based on options.
 * @param {Object} opts
 * @returns {string}
 */
function generateEml(opts) {
  const hasAttachments = opts.attach && (Array.isArray(opts.attach) ? opts.attach.length > 0 : true);
  if (hasAttachments) return buildEmailWithAttachments(opts);
  if (opts.html) return buildHtmlEmail(opts);
  return buildPlainEmail(opts);
}

/**
 * Write .eml content to a file.
 * @param {string} content
 * @param {string} outputPath
 */
function writeEml(content, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
}

module.exports = { generateEml, writeEml };
