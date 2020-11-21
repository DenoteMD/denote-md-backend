const fs = require('fs');

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename).toString());
}

function writeJson(filename, obj) {
  return fs.writeFileSync(filename, JSON.stringify(obj, null, '  '));
}

const mPackage = readJson('./package.json');
const mPackageLock = readJson('./package-lock.json');

function incVersion(v) {
  let [major, minor, patch] = v.split('.').map((e) => parseInt(e, 10));
  patch++;
  if (patch > 100) {
    patch = 0;
    minor++;
  }
  if (minor > 100) {
    minor = 0;
    major++;
  }
  return [major, minor, patch].join('.');
}

mPackageLock.version = mPackage.version = incVersion(mPackage.version);

writeJson('package.json', mPackage);
writeJson('package-lock.json', mPackageLock);
