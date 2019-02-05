const project = require("../project");

module.exports = {
  extends: [
    project.hasAnyDep("react")
      ? "eslint-config-airbnb"
      : "eslint-config-airbnb-base",
    "plugin:security/recommended",
    "plugin:jest/recommended",
    "prettier",
    project.hasAnyDep("react") ? "prettier/react" : ""
  ].filter(Boolean),
  plugins: ["security", "jest"],
  env: {
    "jest/globals": true
  }
};
