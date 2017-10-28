'use strict';

const PrettyError = require('pretty-error');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const pe = new PrettyError();

const devBuildConfig = require('../webpack-config/webpack.prod.config')();

pe.start();

// prepare build step - not necessary atm
// build and transpile js and scss bundle
// update index.html with new hashes
// start server

(function init() {
    buildCode(devBuildConfig)
        .then(startServer)
        .catch(err => {
            console.error(new Error(err));
        })
})();

function buildCode(devBuildConfig) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(devBuildConfig);

        compiler.plugin('done', (stats) => {
            console.log(stats.toString({
                chunks: false,
                colors: true,
            }));
        });

        resolve({ compiler })
    });
}

function startServer(res) {
    const server = new webpackDevServer(res.compiler, {
        hot: true,
        inline: true,
    });

    server.listen(3000);
}
