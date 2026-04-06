#!/usr/bin/env node
/**
 * SudoMail — bin/sudomail.js
 * CLI entry point
 */

'use strict';

const { program } = require('commander');
const chalk = require('chalk');
const { interactiveCompose, composeEmail } = require('../src/composer');
const { listTemplates } = require('../src/templates');
const pkg = require('../package.json');

function printBanner() {
  console.log(chalk.cyan(`
 ____            _       __  __       _ _ 
/ ___| _   _  __| | ___ |  \\/  | __ _(_) |
\\___ \\| | | |/ _\` |/ _ \\| |\\/| |/ _\` | | |
 ___) | |_| | (_| | (_) | |  | | (_| | | |
|____/ \\__,_|\\__,_|\\___/|_|  |_|\\__,_|_|_|
`));
  console.log(chalk.bold(`  SudoMail v${pkg.version} — .eml file creator\n`));
}

program
  .name('sudomail')
  .description('📧 SudoMail — Create .eml email files from the command line')
  .version(pkg.version);

program
  .command('compose', { isDefault: true })
  .description('Compose a new .eml email file')
  .option('-f, --from <email>',    'Sender email address')
  .option('-t, --to <email>',      'Recipient (repeat for multiple)', (v, a) => a.concat([v]), [])
  .option('-c, --cc <email>',      'CC email (repeat for multiple)',  (v, a) => a.concat([v]), [])
  .option('-b, --bcc <email>',     'BCC email (repeat for multiple)', (v, a) => a.concat([v]), [])
  .option('-s, --subject <text>',  'Email subject')
  .option('--body <text>',         'Plain text body')
  .option('--html <html>',         'HTML body content')
  .option('-a, --attach <path>',   'Attach a file (repeat for multiple)', (v, a) => a.concat([v]), [])
  .option('-o, --output <path>',   'Output .eml file path', './output.eml')
  .option('--template <name>',     'Use a built-in template')
  .action(async (opts) => {
    printBanner();
    const hasFlags = opts.from || opts.to.length || opts.subject;
    if (hasFlags) {
      await composeEmail(opts);
    } else {
      await interactiveCompose();
    }
  });

program
  .command('template')
  .description('List or use built-in email templates')
  .option('--list',          'List all available templates')
  .option('--use <name>',    'Use a template by name')
  .option('-t, --to <email>','Recipient email address')
  .option('-f, --from <email>','Sender email address')
  .option('-o, --output <path>','Output .eml file path', './output.eml')
  .action(async (opts) => {
    printBanner();
    if (opts.list) {
      const templates = listTemplates();
      console.log(chalk.bold('📋  Available Templates:\n'));
      templates.forEach(t => {
        console.log(`  ${chalk.cyan(t.key.padEnd(12))} ${chalk.bold(t.name)} — ${t.description}`);
      });
      console.log();
      return;
    }
    if (opts.use) {
      await composeEmail({
        from: opts.from || 'sender@example.com',
        to: opts.to   || 'recipient@example.com',
        output: opts.output,
        templateKey: opts.use,
      });
    }
  });

program.parse(process.argv);
