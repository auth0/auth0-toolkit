/**
 * @module doc
 * @desc
 * Generates documentation files.
 *
 * * Generates `README.md` from the `README.hbs` [handlebars](https://handlebarsjs.com/) template file and
 * from [JSDoc](http://usejsdoc.org/) comments in source files.
 * * Generates a table of contents.
 * * If no `--configure` parameter is present and no configuration file is available, uses the builtin configuration provided by this library.
 * * If no `--files` parameter given, uses all files recursively in `src` directory.
 * * If no `--template` parameter given, uses README.hbs` in project root.
 *
 * @property [OTHERS]     All CLI options used by related binary. (`jsdoc2md`)
 * @example
 * $ npm run build:doc
 * $ npx auth0-toolkit doc
 */

import fs from "fs";
import { Project, Script, ScriptKit } from "toolkit-utils";

export const script: Script = function docScript(
  project: Project,
  args: string[],
  s: ScriptKit
) {
  const dir = project.isCompiled ? "src" : "lib";
  const extension = project.isTypeScript ? "ts" : "js";
  const useBuiltinConfig =
    !args.includes("--configure") &&
    !project.hasAnyFile(".jsdoc2md.json") &&
    !project.packageHas("jsdoc2md");
  const builtinConfigFile = project.fromConfigDir(`jsdoc2md/${extension}.json`);

  const files = !args.includes("--files")
    ? ["--files", `${dir}/**/*.${extension}`]
    : [];
  const config = useBuiltinConfig ? ["--configure", builtinConfigFile] : [];
  const template =
    !args.includes("--template") || project.hasAnyFile("README.hbs")
      ? ["--template", "README.hbs"]
      : [];

  const outputFile = fs.openSync("README.md", "w");

  return project.execute(
    [
      "jsdoc2md",
      [...config, ...template, ...files].concat(args),
      {
        encoding: "utf-8",
        stdio: ["inherit", outputFile, "inherit"]
      }
    ],
    ["doctoc", ["README.md"]]
  );
};
