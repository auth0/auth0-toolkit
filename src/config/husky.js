const project = require("../project");

const scripts =
  project.name === project.toolkitName ? `ts-node src` : project.toolkitBin;

module.exports = {
  hooks: {
    "pre-commit": `${project.toolkitBin} precommit`
  }
};
