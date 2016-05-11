'use strict';

/* eslint-env node */

var spawn = require('child_process').spawn;
var watch = require('watch');
var resolvePath = require('path').resolve;
var debounce = require('lodash').debounce;

var runTests = debounce(function runTests() {
    process.stdout.write('Running Tests:\n\n');

    spawn('node', [require.resolve('./test.js')], {
        stdio: 'inherit',
        detached: false
    });
}, 50);

watch.watchTree(resolvePath(__dirname, '../src'), runTests);
watch.watchTree(resolvePath(__dirname, '../test/spec'), runTests);
