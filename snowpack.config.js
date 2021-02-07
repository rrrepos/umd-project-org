// snowpack.config.js
module.exports = {
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2020',
    },
    buildOptions: {
        out: "docs",
        clean: false
    },
    mount: {
        "public": "/docs",
        "src": "/",
    },
    packageOptions: {
        polyfillNode: true
    }
};