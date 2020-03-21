
const path = require('path');
const fs = require('fs');

const params = process.argv.slice(2);

function fatal(condition, message) {
  if (condition) {
    process.stdout.write(`[Fatal]: ${message}\n`);
    process.exit(1);
  }
}

function info(message) {
  process.stdout.write(`[Info]: ${message}\n`);
}

let keyboardCharactersOnly = /^[0-9a-z\s\n`~!@#$%^&*()_+\-=[\]{}\';:",<.>\/?]+$/im
switch (params[0]) {
  case 'message':
    let filename = path.join(__dirname, params[1]);
    if (!fs.existsSync(filename)) {
      info(`${filename} Not found, does this a git repo?.`);
      process.exit(0);
    }
    let commitMessage = fs.readFileSync(filename)
      .toString()
      .trim();
    let commitSection = commitMessage.split('\n');
    fatal(!keyboardCharactersOnly.test(commitMessage), 'We are only allow characters visible on keyboard');
    fatal(commitSection.length < 2, 'Commit description not found');
    fatal(commitSection[0].split(' ').length <= 3, 'Commit title too common, please tell us what does it contain');
    fatal(commitSection[0].split(' ').length >= 25, 'Commit title too long, please make it short');
    fatal(!(/#[0-9]{1,}/).test(commitMessage), 'Commit description need to contain issue number following this format: "fix #1, close #4"');
    info(`Good commit message:\n------------------\n${commitMessage}`);
    process.exit(0);
    break;
  default:
    process.exit(1);
}
