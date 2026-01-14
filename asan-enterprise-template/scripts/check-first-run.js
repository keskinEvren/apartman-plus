#!/usr/bin/env node
/**
 * ASANMOD First Run Check
 *
 * Ensures wizard runs on first npm install
 * Creates flag to prevent repeated runs
 * Skips in CI environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const FLAG_FILE = path.join(PROJECT_ROOT, '.asanmod', 'wizard-completed');

function main() {
  // Check if wizard already run
  if (fs.existsSync(FLAG_FILE)) {
    return; // Skip - already completed
  }

  // Skip in CI environments
  if (process.env.CI || process.env.SKIP_WIZARD) {
    console.log('⏭️  Skipping wizard (CI environment detected)');
    return;
  }

  console.log('\n🎉 Welcome to ASANMOD Enterprise Template!\n');
  console.log('📦 First run detected. Running setup wizard...\n');

  // Run wizard
  try {
    execSync('npm run wizard', {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });

    // Create completion flag
    const flagDir = path.dirname(FLAG_FILE);
    if (!fs.existsSync(flagDir)) {
      fs.mkdirSync(flagDir, { recursive: true });
    }

    const packageJson = require(path.join(PROJECT_ROOT, 'package.json'));
    fs.writeFileSync(FLAG_FILE, JSON.stringify({
      completed: new Date().toISOString(),
      version: packageJson.version,
    }, null, 2));

    console.log('\n✅ Setup complete!\n');
    console.log('Run `npm run dev` to start development\n');
  } catch (error) {
    console.error('\n❌ Wizard failed:', error.message);
    console.error('\nYou can run it manually with: npm run wizard\n');
    process.exit(1);
  }
}

main();
