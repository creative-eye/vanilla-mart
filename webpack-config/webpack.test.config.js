import jasmineWebpackPlugin from 'jasmine-webpack-plugin';

module.exports = {
    entry: ['../tests/specs.js'],

    plugins: [new JasmineWebpackPlugin()]
};
