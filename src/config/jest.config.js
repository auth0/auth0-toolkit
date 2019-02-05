const project = require("../project");

const dir = project.isCompiled ? "src" : "lib";

const jestConfig = {
  roots: project.isCompiled ? ["src"] : ["src", "lib"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverageFrom: [`${dir}/**/*.+(js|jsx|ts|tsx)`],
  testMatch: [
    "**/__tests__/**/*.+(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)"
  ]
};

module.exports = jestConfig;
