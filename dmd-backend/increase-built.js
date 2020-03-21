var mPackage = require('./package.json');
var mPackageLock = require('./package-lock.json');
var fs = require('fs');

function incVersion(v) {
    let [major, minor, build] = v.split('.').map((i) => parseInt(i, 10));
    build++;
    if (build >= 100) {
        build = 0;
        minor++;
    }
    return [major, minor, build].map((i) => i.toString()).join('.');
}

mPackage.version = incVersion(mPackage.version);
mPackageLock.version = incVersion(mPackageLock.version);

fs.writeFileSync('package.json', JSON.stringify(mPackage, null, '  '));
fs.writeFileSync('package-lock.json', JSON.stringify(mPackageLock, null, '  '));