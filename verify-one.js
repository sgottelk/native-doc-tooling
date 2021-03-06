const fs = require('fs');
const unified = require('unified');
const frontmatter = require('remark-frontmatter');
const rpm = require('remark-parse-yaml');
const rp = require('remark-parse');

const makeNative = require('./native-compiler');

require('node-json-color-stringify');

const processor = unified()
    .use(rp)
    .use(frontmatter)
    .use(rpm)
    .use(makeNative)
    .freeze();

if (process.argv.length <= 2) {
    process.exitCode = 2;
    return;
}

const input = process.argv[2];

try {
    const nativeData = processor
        .processSync(fs.readFileSync(input));

    if (nativeData.contents.hash === '0x0') {
        throw new Error('No native hash was specified.');
    }

    console.log(JSON.colorStringify(nativeData.contents, null, 4));

    process.exitCode = 0;
} catch (e) {
    console.log(e);

    process.exitCode = 1;
}