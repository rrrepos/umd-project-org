// snowpack.config.js
module.exports = {
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2018',
    },
    buildOptions: {
        out: "docs"
    },
    mount: {
        "src": "/",
    },
    packageOptions: {
        polyfillNode: true
    }
};