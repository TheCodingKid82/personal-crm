const { spawn, execSync } = require('child_process');
const child = spawn('C:\\Users\\theul\\.clawdbot\\imsg-ssh2.exe', ['rpc'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

child.stdout.on('data', d => {
  console.log('STDOUT:', d.toString().trim());
});
child.stderr.on('data', d => {
  console.error('STDERR:', d.toString().trim());
});
child.on('close', code => {
  console.log('EXIT:', code);
});

// Send watch.subscribe
child.stdin.write('{"jsonrpc":"2.0","id":1,"method":"watch.subscribe","params":{}}\n');

// After 3s, send a test message via a separate process
setTimeout(() => {
  console.log('Sending test message...');
  try {
    const r = execSync('C:\\Users\\theul\\.clawdbot\\imsg-ssh2.exe send --to andrewweir410@gmail.com --text "notify-check" --json', { timeout: 15000 });
    console.log('SEND:', r.toString().trim());
  } catch(e) {
    console.error('SEND ERR:', e.message);
  }
}, 3000);

// Kill after 15s
setTimeout(() => {
  console.log('Timeout - killing');
  child.kill();
  process.exit(0);
}, 15000);
