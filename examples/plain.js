/**
 * SudoMail Example — Plain Text Email
 * Run: node examples/plain.js
 */

const sudomail = require('../src/index');

const output = sudomail.create({
  from: 'alice@example.com',
  to: ['bob@example.com'],
  subject: 'Hey Bob!',
  body: `Hi Bob,

Just wanted to check in and say hello. Hope you're doing well!

Best,
Alice`,
  output: './examples/output/plain-example.eml',
});

console.log(`✅ Created: ${output}`);
