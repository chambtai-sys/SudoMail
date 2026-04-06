/**
 * SudoMail — composer.js
 * Interactive and programmatic email composition
 */

const inquirer = require('inquirer');
const { isValidEmail, parseEmailList } = require('./utils');
const { getTemplate, listTemplates } = require('./templates');
const { generateEml, writeEml } = require('./generator');

async function interactiveCompose() {
  console.log('\n📧  Welcome to SudoMail — Interactive Compose Mode\n');

  const answers = await inquirer.prompt([
    {
      type: 'input', name: 'from', message: 'From (sender email):',
      validate: v => isValidEmail(v) || 'Please enter a valid email address.',
    },
    {
      type: 'input', name: 'to', message: 'To (recipient, comma-separate multiple):',
      validate: v => v.trim().length > 0 || 'At least one recipient is required.',
    },
    { type: 'input', name: 'cc',  message: 'CC (optional):' },
    { type: 'input', name: 'bcc', message: 'BCC (optional):' },
    {
      type: 'input', name: 'subject', message: 'Subject:',
      validate: v => v.trim().length > 0 || 'Subject cannot be empty.',
    },
    {
      type: 'list', name: 'format', message: 'Email format:',
      choices: ['Plain Text', 'HTML', 'Use Template'], default: 'Plain Text',
    },
    {
      type: 'editor', name: 'body', message: 'Plain text body:',
      when: a => a.format !== 'Use Template',
    },
    {
      type: 'editor', name: 'html', message: 'HTML body:',
      when: a => a.format === 'HTML',
    },
    {
      type: 'list', name: 'templateKey', message: 'Choose a template:',
      choices: listTemplates().map(t => ({ name: `${t.name} — ${t.description}`, value: t.key })),
      when: a => a.format === 'Use Template',
    },
    { type: 'input', name: 'attach', message: 'Attachment path (optional):' },
    { type: 'input', name: 'output', message: 'Output file path:', default: './output.eml' },
  ]);

  await composeEmail(answers);
}

async function composeEmail(opts) {
  let { from, to, cc, bcc, subject, body, html, templateKey, attach, output } = opts;

  if (templateKey) {
    const tmpl = getTemplate(templateKey);
    if (tmpl) {
      subject = subject || tmpl.subject;
      body    = body    || tmpl.body;
      html    = html    || tmpl.html;
    }
  }

  const toList  = parseEmailList(Array.isArray(to)  ? to.join(',')  : to);
  const ccList  = parseEmailList(Array.isArray(cc)  ? cc.join(',')  : cc);
  const bccList = parseEmailList(Array.isArray(bcc) ? bcc.join(',') : bcc);
  const attachList = attach ? (Array.isArray(attach) ? attach : [attach]).filter(Boolean) : [];

  const emlContent = generateEml({
    from, to: toList, cc: ccList, bcc: bccList,
    subject, body, html,
    attach: attachList.length > 0 ? attachList : undefined,
  });

  const outputPath = output || './output.eml';
  writeEml(emlContent, outputPath);

  console.log(`\n✅  Email saved to: ${outputPath}`);
  console.log(`   From:    ${from}`);
  console.log(`   To:      ${toList.join(', ')}`);
  if (ccList.length)    console.log(`   CC:      ${ccList.join(', ')}`);
  if (bccList.length)   console.log(`   BCC:     ${bccList.join(', ')}`);
  console.log(`   Subject: ${subject}`);
  if (attachList.length) console.log(`   Attachments: ${attachList.length} file(s)`);
  console.log();
}

module.exports = { interactiveCompose, composeEmail };
