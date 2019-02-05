/**
 * @module init
 * @desc
 * Initializes the project
 *
 * The `init` script generates necessary files and updates `package.json`. This script is executed automatically during `preinstall` and `postinstall` stages.
 * It can also be manually executed.
 *
 * The following entries added to `package.json`:
 *    * scripts.build
 *    * scripts.test
 *    * scripts.watch
 *    * scripts.lint
 *    * scripts.format
 *    * scripts.validate
 *    * scripts.prepublishOnly
 *
 * The following files are created:
 *    * .prettierrc.js
 *    * .prettierignore
 *    * .huskyrc.js
 *    * .eslintrc.js
 *    * tslint.json
 *    * tsconfig.json
 *
 * @property [...files] Files to lint
 * @property [--no-cache] Disables ESLint `--cache` arg which is added by this script.
 * @property [OTHERS] All CLI options used by the related binary. (`eslint` or `tslint`)
 * @example
 * $ npx auth0-toolkit init
 */

import { Project, Script, ScriptKit } from "toolkit-utils";

export const script: Script = function initScript(
  project: Project,
  rawArgs: any[],
  s: ScriptKit
) {
  // If the toolkit called its own init script, early return.
  if (project.name === project.toolkitName) {
    project.logger.warn(
      `init script is skipped because the project and the toolkit are the same: "${
        project.name
      }"`
    );

    return { status: 0 };
  }

  const scripts = {
    watch: project.isCompiled
      ? "concurrently 'npm run build -- --watch' 'npm run test -- --watch'"
      : "npm run test -- --watch"
  };

  // License and author details
  // const author = project.package.get("author");
  // const authorName = typeof author === "string" ? author : author.name;
  // const licenseType = project.packageGet("license").toLowerCase();
  // const licenseText = getLicense(licenseType, authorName);

  // Package scripts
  project.packageSet("scripts.test", `${project.toolkitBin} test`);
  project.packageSet(
    "scripts.test:update",
    `${project.toolkitBin} test --updateSnapshot`
  );
  project.packageSet("scripts.watch", scripts.watch);
  project.packageSet("scripts.lint", `${project.toolkitBin} lint`);
  project.packageSet("scripts.format", `${project.toolkitBin} format`);
  project.packageSet("scripts.validate", `${project.toolkitBin} validate`);

  if (project.isCompiled) {
    project.packageSet("scripts.build", `${project.toolkitBin} build`);
    project.packageSet("scripts.prepublishOnly", "npm run build");
  }

  // Project files
  project.writeFile(
    ".prettierrc.js",
    `module.exports = require("${project.toolkitName}/config").prettier;`
  );
  project.writeFile(
    ".huskyrc.js",
    `module.exports = require("${project.toolkitName}/config").husky;`
  );
  project.writeFile(
    "jest.config.js",
    `module.exports = require("${project.toolkitName}/config").jest;`
  );

  // Linter
  if (project.isTypeScript) {
    project.writeFile("tslint.json", {
      extends: `${project.toolkitName}/tslint.json`
    });
  } else {
    project.writeFile(
      ".eslintrc.js",
      `module.exports = require("${project.toolkitName}/config").eslint;`
    );
  }

  // Compiler
  if (project.isTypeScript) {
    project.copyFile("tsconfig.json", "tsconfig.json");
  }

  return { status: 0 };
};
