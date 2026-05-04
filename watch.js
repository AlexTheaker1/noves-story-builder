const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const WATCH = ['app.js', 'styles.css', 'data.js', 'index.html'];
const DEBOUNCE_MS = 2500;

let timer = null;

function push() {
  try {
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    execSync('git add app.js styles.css data.js index.html', { cwd: ROOT });
    const diff = execSync('git diff --cached --name-only', { cwd: ROOT }).toString().trim();
    if (!diff) { console.log(`[${timestamp}] No changes to push`); return; }
    execSync(`git commit -m "Update ${timestamp}"`, { cwd: ROOT });
    execSync('git push', { cwd: ROOT });
    console.log(`[${timestamp}] Pushed — ${diff.split('\n').join(', ')}`);
  } catch (e) {
    console.error('Push failed:', e.message);
  }
}

WATCH.forEach(file => {
  fs.watch(path.join(ROOT, file), () => {
    clearTimeout(timer);
    timer = setTimeout(push, DEBOUNCE_MS);
  });
});

console.log('Watching for changes — will auto-push to GitHub...');
console.log('Press Ctrl+C to stop.\n');
