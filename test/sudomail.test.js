/**
 * SudoMail — test/sudomail.test.js
 * Unit tests (no external test runner required — just run: npm test)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sudomail = require('../src/index');
const { generateMessageId, formatDate, isValidEmail, parseEmailList } = require('../src/utils');
const { listTemplates, getTemplate } = require('../src/templates');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌  ${name}`);
    console.log(`      ${err.message}`);
    failed++;
  }
}

console.log('\n🧪  SudoMail Test Suite\n');

// --- Utils ---
console.log('Utils:');

test('generateMessageId returns a bracketed UUID string', () => {
  const id = generateMessageId();
  assert(typeof id === 'string' && id.startsWith('<') && id.endsWith('>'));
});

test('formatDate returns a non-empty RFC 2822-ish string', () => {
  const d = formatDate();
  assert(typeof d === 'string' && d.length > 10);
});

test('isValidEmail accepts valid addresses', () => {
  assert(isValidEmail('user@example.com'));
  assert(isValidEmail('me+tag@sub.domain.org'));
});

test('isValidEmail rejects invalid addresses', () => {
  assert(!isValidEmail('notanemail'));
  assert(!isValidEmail('@nodomain'));
});

test('parseEmailList splits comma-separated emails', () => {
  const list = parseEmailList('a@b.com, c@d.com , e@f.com');
  assert.deepStrictEqual(list, ['a@b.com', 'c@d.com', 'e@f.com']);
});

// --- Templates ---
console.log('\nTemplates:');

test('listTemplates returns at least 3 templates', () => {
  assert(listTemplates().length >= 3);
});

test('getTemplate("plain") returns a valid template', () => {
  const t = getTemplate('plain');
  assert(t && t.subject && t.body);
});

test('getTemplate("nonexistent") returns null', () => {
  assert(getTemplate('nonexistent') === null);
});

// --- Generator ---
console.log('\nGenerator:');

test('generate() returns a plain text .eml string', () => {
  const eml = sudomail.generate({
    from: 'test@sudomail.dev',
    to: ['recv@example.com'],
    subject: 'Test',
    body: 'Hello world',
  });
  assert(eml.includes('From: test@sudomail.dev'));
  assert(eml.includes('To: recv@example.com'));
  assert(eml.includes('Subject: Test'));
  assert(eml.includes('Hello world'));
  assert(eml.includes('Content-Type: text/plain'));
});

test('generate() returns multipart/alternative for HTML emails', () => {
  const eml = sudomail.generate({
    from: 'test@sudomail.dev',
    to: ['recv@example.com'],
    subject: 'HTML Test',
    body: 'Fallback',
    html: '<h1>Hello</h1>',
  });
  assert(eml.includes('multipart/alternative'));
  assert(eml.includes('<h1>Hello</h1>'));
});

test('create() writes .eml to disk and returns the path', () => {
  const output = path.join(__dirname, '../test-output.eml');
  const result = sudomail.create({
    from: 'a@b.com',
    to: ['c@d.com'],
    subject: 'Disk write test',
    body: 'Written by test suite.',
    output,
  });
  assert(result === output);
  assert(fs.existsSync(output));
  fs.unlinkSync(output);
});

// --- Summary ---
console.log(`\n📊  Results: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
