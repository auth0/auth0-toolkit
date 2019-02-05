import { Project, Script, ScriptKit } from "toolkit-utils";
import yargsParser from "yargs-parser";

const script: Script = function eslintScript(
  project: Project,
  rawArgs: any[],
  s: ScriptKit
) {
  let args = rawArgs;
  const parsedArgs = yargsParser(args, { boolean: ["fix"] });
  const useBuiltinConfig =
    !args.includes("--config") &&
    !project.hasAnyFile([
      ".eslintrc.js",
      ".eslintrc.json",
      ".eslintrc.yml",
      ".eslintrc.yaml"
    ]) &&
    !project.packageHas("eslintConfig");

  const config = useBuiltinConfig
    ? ["--config", project.fromConfigDir(`eslintrc.${s.extension}`)]
    : [];

  const useBuiltinIgnore =
    !args.includes("--ignore-path") &&
    !project.hasAnyFile(".eslintignore") &&
    !project.packageHas("eslintIgnore");
  const ignore = useBuiltinIgnore ? ["--ignore-path", ".gitignore"] : [];

  const cache = args.includes("--no-cache") ? [] : ["--cache"];
  const filesGiven = parsedArgs._.length > 0;
  const filesToApply = filesGiven ? [] : ["."];

  if (filesGiven) {
    // We need to take all the flag-less arguments (the files that should be linted)
    // and filter out the ones that aren't js files. Otherwise json or css files
    // may be passed through
    const filesList = parsedArgs._.filter(
      a => a.endsWith(".js") || a.endsWith(".jsx")
    );

    // If given files are not 'js' or 'jsx' and no project is given skip linting.
    if (filesList.length === 0) {
      project.logger.info("Files are given but none of them are lintable.");
      return { status: 0 };
    }

    // The remaining files are then added to the list of flags to be the final args
    args = args.filter(a => !parsedArgs._.includes(a) || filesList.includes(a));
  }

  return project.execute([
    "eslint",
    [...config, ...ignore, ...cache, ...args, ...filesToApply]
  ]);
};

export { script };
