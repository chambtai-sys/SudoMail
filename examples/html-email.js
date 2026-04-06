/**
 * SudoMail Example — HTML Email
 * Run: node examples/html-email.js
 */

const sudomail = require('../src/index');

const output = sudomail.create({
  from: 'hello@myapp.com',
  to: ['user@example.com'],
  subject: '🎉 Welcome to MyApp!',
  body: 'Welcome to MyApp! Please view this email in an HTML-capable client.',
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f0f4f8; padding: 40px; }
    .card { max-width: 560px; margin: auto; background: #fff; border-radius: 10px; padding: 40px; }
    h1 { color: #2d3748; }
    .btn { display: inline-block; padding: 12px 28px; background: #4299e1; color: #fff; border-radius: 6px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to MyApp! 🎉</h1>
    <p>Your account has been created. Click below to get started.</p>
    <a href="https://myapp.com/dashboard" class="btn">Go to Dashboard</a>
  </div>
</body>
</html>`,
  output: './examples/output/html-example.eml',
});

console.log(`✅ Created: ${output}`);
