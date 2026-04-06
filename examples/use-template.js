/**
 * SudoMail Example — Using Built-in Templates
 * Run: node examples/use-template.js
 */

const sudomail = require('../src/index');
const { getTemplate } = require('../src/templates');

// List available templates
const templates = sudomail.listTemplates();
console.log('\n📋 Available templates:');
templates.forEach(t => console.log(`  - ${t.key}: ${t.name}`));

// Use the newsletter template
const tmpl = getTemplate('newsletter');

const output = sudomail.create({
  from: 'news@example.com',
  to: ['subscriber@example.com'],
  subject: tmpl.subject,
  body: tmpl.body,
  html: tmpl.html,
  output: './examples/output/newsletter-example.eml',
});

console.log(`\n✅ Newsletter created: ${output}`);
