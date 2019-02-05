/**
 * @module test
 * @desc
 * Test project using [Jest](https://jestjs.io/)
 *
 * * Sets `BABEL_ENV` and `NODE_ENV` to `test`.
 * * If not in CI, precommit stage, or following arguments are not present `--no-watch`, `--coverage`, `--updateSnapshot` or `--watchAll`, watches changes.
 * * If no config is provided (`--config`, `jest.config.js` etc.) uses builtin configuration provided by this library.
 *
 * @property [--no-watch]  If provided, tests run once. (Default is watch mode)
 * @property [OTHERS]      All CLI options used by the related binary. (`jest`)
 * @example
 * $ npm run test
 * $ npx auth0-toolkit test
 */
import isCI from "is-ci";
import { Project, Script, ScriptKit } from "toolkit-utils";

process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

export const script: Script = function testScript(
  project: Project,
  args: string[],
  s: ScriptKit
) {
  const watch =
    !isCI &&
    !project.parseEnv("SCRIPTS_PRECOMMIT", false) &&
    !args.includes("--no-watch") &&
    !args.includes("--coverage") &&
    !args.includes("--updateSnapshot") &&
    !args.includes("--watchAll")
      ? ["--watch"]
      : [];

  const config =
    !args.includes("--config") &&
    !project.hasAnyFile("jest.config.js") &&
    !project.packageHas("jest")
      ? ["--config", JSON.stringify(require("../config/jest.config"))]
      : [];

  return project.execute(["jest", [...config, ...watch, ...args]]);
};
