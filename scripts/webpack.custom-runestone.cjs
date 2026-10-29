const path = require("node:path");

module.exports = (env, argv) => {
    const project = path.resolve(__dirname, "..");
    const source = path.resolve(
        env.runestoneSource || "C:/Code/rs/bases/rsptx/interactives",
    );
    const destination = path.resolve(
        env.builddir || path.join(project, "assets/custom-runestone"),
    );
    const configurations = require(path.join(source, "webpack.config.js"))(
        { ...env, builddir: destination },
        argv,
    );

    // Only build the browser bundle. The second upstream configuration builds
    // server-side JavaScript and cleans a fixed directory in the source checkout.
    const browser = configurations[0];
    browser.context = source;
    browser.cache = {
        type: "filesystem",
        cacheDirectory: path.join(project, ".cache/webpack-runestone"),
    };
    return browser;
};
