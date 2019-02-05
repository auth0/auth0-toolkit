/**
 * @module precommit
 * @desc
 * The script that is automatically executed before a commit using `lintstaged`
 *
 * * If no config is provided (`--config`, `lint-staged.config.js`, or `lint-staged` in package.json), uses builtin configuration.
 * * Executes `lint-staged`.
 *    * doc (if there's a build:doc script in package.json)
 *    * format and add to git
 *    * lint
 *    * test (executes test related to changed files)
 *
 * @property [OTHERS]   All CLI options used by the related binary. (`lint-staged`)
 */

import { Executable, Project, Script, ScriptKit } from "toolkit-utils";

export const script: Script = function precommitScript(
  project: Project,
  args: string[],
  s: ScriptKit
) {
  process.env.SCRIPTS_PRECOMMIT = "true";
  const useBuiltinConfig =
    !args.includes("--config") &&
    !project.hasAnyFile(".lintstagedrc") &&
    !project.hasAnyFile("lint-staged.config.js") &&
    !project.packageHas("lint-staged");

  const config = useBuiltinConfig
    ? ["--config", project.fromConfigDir(`lintstagedrc.js`)]
    : [];

  const buildDocScripts: Executable[] = project.packageHas("scripts.build:doc")
    ? [
        ["echo", ["Building doc and adding it to git..."]],
        ["npm", ["run", "build:doc"]],
        ["git", ["add", "README.md"]]
      ]
    : [];

  return project.execute(
    ...buildDocScripts,
    ["lint-staged", [...config, ...args]],
    ["npm", ["run", "validate"]]
  );
};
