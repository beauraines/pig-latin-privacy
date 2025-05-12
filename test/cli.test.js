const assert = require('assert');
const { exec } = require('child_process');

// Helper function to run CLI command
function runCliCommand(args, callback) {
  exec(`node cli.js ${args}`, { cwd: '../' }, (error, stdout, stderr) => {
    if (error) {
      return callback(stderr);
    }
    callback(null, stdout.trim());
  });
}

describe('CLI Pig Latin Translator', () => {
  it('should translate a single message', (done) => {
    runCliCommand('"Hello world"', (err, result) => {
      if (err) return done(err);
      assert.strictEqual(result, 'Ellohay orldway');
      done();
    });
  });

  it('should format with wrapper if --wrapper is provided', (done) => {
    runCliCommand('"Hello world" --wrapper --type plp', (err, result) => {
      if (err) return done(err);
      const expectedOutput = '-----BEGIN PLP MESSAGE-----\nEllohay orldway\n-----END PLP MESSAGE-----';
      assert.strictEqual(result, expectedOutput);
      done();
    });
  });

  it('should not use wrapper if --no-wrapper is provided', (done) => {
    runCliCommand('"Hello world" --no-wrapper', (err, result) => {
      if (err) return done(err);
      assert.strictEqual(result, 'Ellohay orldway');
      done();
    });
  });

  it('should read from STDIN if no input is provided', (done) => {
    exec('echo "Hello world" | node cli.js', { cwd: '../' }, (error, stdout, stderr) => {
      if (error) return done(error);
      assert.strictEqual(stdout.trim(), 'Ellohay orldway');
      done();
    });
  });
});
