const project = require("../project");

module.exports = function preset(api, opts = {}) {
  // Don't cache the configuration object
  api.cache(false);

  return {
    presets: [
      ["@babel/env", { targets: { node: "current" } }],
      project.isTypeScript ? "@babel/typescript" : null
    ].filter(Boolean),
    plugins: ["@babel/proposal-class-properties"]
  };
};
