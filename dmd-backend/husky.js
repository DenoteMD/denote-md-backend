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

switch (params[0]) {
  case 'message':
    process.exit(0);
  default:
    process.exit(1);
}
