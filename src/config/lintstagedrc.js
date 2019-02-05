const project = require("../project");

const scripts =
  project.name === project.toolkitName ? `ts-node src` : project.toolkitBin;

module.exports = {
  concurrent: false,
  linters: {
    "**/*.+(js|json|less|css|ts|md|hbs)": [
      `${scripts} format`,
      `${scripts} lint --fix`,
      `${scripts} test --findRelatedTests --passWithNoTests --no-watch`,
      "git add"
    ].filter(Boolean)
  }
};
