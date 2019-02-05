/**
 * @module format
 * @desc
 * Formats project files using `prettier`.
 *
 * * If no config is provided (`--config`, `prettier.config.js`, or `prettierrc` in package.json), the default Prettier configuration will be used.
 * * If no `--ignore-path` flag is provided or no `.prettierignore` file is present, the ignore file provided by the library will be used.
 *
 * @property [--no-write]  If provided, files will not be written to disk. (Defaults to writing to disk)
 * @property [OTHERS]      All CLI options used by the related binary. (`prettier`)
 * @example
 * $ npm run format
 * $ npx auth0-scripts format
 */

import { Project, Script, ScriptKit } from "toolkit-utils";
import yargsParser from "yargs-parser";

export const script: Script = function formatScript(
  project: Project,
  args: string[],
  s: ScriptKit
) {
  const parsedArgs = yargsParser(args);
  const prettierConfigFiles = [
    ".prettierrc",
    ".prettierrc.yaml",
    ".prettierrc.yml",
    ".prettierrc.json",
    ".prettierrc.js",
    ".prettierrc.toml",
    "prettier.config.js"
  ];
  const useBuiltinConfig =
    !args.includes("--config") &&
    !project.hasAnyFile(prettierConfigFiles) &&
    !project.packageHas("prettier");

  const config = useBuiltinConfig
    ? ["--config", project.fromConfigDir(`prettierrc.js`)]
    : [];

  const useBuiltinIgnore =
    !args.includes("--ignore-path") && !project.hasAnyFile(".prettierignore");

  const ignore = useBuiltinIgnore
    ? project.hasAnyFile(".gitignore")
      ? ["--ignore-path", project.fromRoot(".gitignore")]
      : ["--ignore-path", project.fromConfigDir(".prettierignore")]
    : [];

  const write = args.includes("--no-write") ? [] : ["--write"];

  // Convert absolute paths provided by the pre-commit hook into relative paths.
  // This ensures that the paths are treated as globs, so prettierignore will be applied.
  const relativeArgs = args.map(a => a.replace(`${process.cwd()}/`, ""));
  const filesToApply = parsedArgs._.length
    ? []
    : ["**/*.+(js|jsx|json|less|css|ts|tsx|md)"];
  return project.execute([
    "prettier",
    [...config, ...ignore, ...write, ...filesToApply].concat(relativeArgs)
  ]);
};
