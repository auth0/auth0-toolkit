/**
 * @module lint
 * @desc
 * Lint project using TSLint or ESLint based on project type.
 *
 * **TSLint**
 * * If project has no `tslint.json` or `--config` is given, uses builtin configuration provided by this library.
 * * If no files and `--project` argument is given, uses default TypeScript project directory provided by `tsconfig.json` in the root of the project.
 *
 * **Babel**
 * * If project has no ESLint configuration (`.eslintrc.js` or `eslintConfig` in `package.json`) or no `--config` is given, uses builtin configuration provided by this library.
 * * If no `--ignore-path` argument is provided, uses `.gitignore`.
 * * Uses `--cache` by default. (can be disabled with `--no-cache`)
 *
 * @property [...files]    A list of files to lint.
 * @property [--no-cache]  Disables ESLint's `--cache` arg.
 * @property [OTHERS]      All CLI options used by related binary. (TSLint or ESLint)
 * @example
 * $ npm run lint
 * $ npm run lint my-file.ts -- --config my-config.json
 * $ npx auth0-toolkit lint
 * $ npx auth0-toolkit lint --no-cache
 * $ npx auth0-toolkit lint my-file.ts
 */

import { Project, Script, ScriptKit } from "toolkit-utils";

export const script: Script = function lintScript(
  project: Project,
  args: any[],
  s: ScriptKit
) {
  const subScript = project.isTypeScript ? "tslint" : "eslint";
  return s.executeSubScript(subScript, args);
};
