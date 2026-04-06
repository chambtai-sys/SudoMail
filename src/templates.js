/**
 * SudoMail — templates.js
 * Built-in email templates
 */

const TEMPLATES = {
  plain: {
    name: 'Plain Text',
    description: 'A simple plain text email',
    subject: 'Hello from SudoMail',
    body: 'This email was composed using SudoMail.\n\nBest regards,\nSudoMail',
    html: null,
  },

  html: {
    name: 'Basic HTML',
    description: 'A simple HTML email with a greeting',
    subject: 'Hello from SudoMail',
    body: 'This email was composed using SudoMail.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #333; }
    h1 { color: #2b6cb0; }
    .footer { margin-top: 40px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <h1>Hello from SudoMail! 📧</h1>
  <p>This email was composed using <strong>SudoMail</strong> — the CLI email file creator.</p>
  <div class="footer">Sent with SudoMail · <a href="https://github.com/chambtai-sys/SudoMail">GitHub</a></div>
</body>
</html>`,
  },

  newsletter: {
    name: 'Newsletter',
    description: 'A styled newsletter-style HTML email',
    subject: '📰 Your SudoMail Newsletter',
    body: 'Your weekly newsletter is here. View in HTML for the best experience.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { background:#f4f4f4; font-family:Arial,sans-serif; margin:0; padding:0; }
    .container { max-width:600px; margin:30px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
    .header { background:#2b6cb0; color:#fff; padding:32px; text-align:center; }
    .header h1 { margin:0; font-size:28px; }
    .content { padding:32px; color:#333; line-height:1.6; }
    .cta { display:inline-block; margin-top:16px; padding:12px 28px; background:#2b6cb0; color:#fff; border-radius:4px; text-decoration:none; font-weight:bold; }
    .footer { background:#f4f4f4; padding:16px; text-align:center; font-size:12px; color:#999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>📰 SudoMail Newsletter</h1><p>Your weekly update is here</p></div>
    <div class="content">
      <h2>What's New?</h2>
      <p>Welcome to this week's edition! Here's everything you need to know.</p>
      <a href="#" class="cta">Read More →</a>
    </div>
    <div class="footer">You're receiving this because you subscribed. · <a href="#">Unsubscribe</a></div>
  </div>
</body>
</html>`,
  },

  welcome: {
    name: 'Welcome Email',
    description: 'A user onboarding / welcome email',
    subject: '👋 Welcome aboard!',
    body: 'Welcome! We are thrilled to have you.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family:Arial,sans-serif; background:#f9f9f9; padding:40px; }
    .card { max-width:560px; margin:auto; background:#fff; border-radius:10px; padding:40px; box-shadow:0 2px 10px rgba(0,0,0,0.08); }
    h1 { color:#1a202c; }
    .emoji { font-size:48px; text-align:center; display:block; margin-bottom:16px; }
    p { color:#4a5568; line-height:1.8; }
    .btn { display:inline-block; margin-top:20px; padding:14px 32px; background:#48bb78; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold; }
  </style>
</head>
<body>
  <div class="card">
    <span class="emoji">🎉</span>
    <h1>Welcome aboard!</h1>
    <p>We're so excited to have you with us. Your account is all set and ready to go.</p>
    <a href="#" class="btn">Get Started →</a>
  </div>
</body>
</html>`,
  },
};

function listTemplates() {
  return Object.entries(TEMPLATES).map(([key, t]) => ({ key, name: t.name, description: t.description }));
}

function getTemplate(key) {
  return TEMPLATES[key] || null;
}

module.exports = { listTemplates, getTemplate, TEMPLATES };
