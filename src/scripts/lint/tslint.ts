import { Project, Script, ScriptKit } from "toolkit-utils";
import yargsParser from "yargs-parser";

export const script: Script = function tslintScript(
  project: Project,
  rawArgs: any[],
  s: ScriptKit
) {
  let args = rawArgs;
  const parsedArgs = yargsParser(args, { boolean: ["fix"] });
  const useBuiltinConfig =
    !args.includes("--config") && !project.hasAnyFile("tslint.json");

  const config = useBuiltinConfig
    ? ["--config", project.fromToolkitRoot("tslint.json")]
    : [];

  const format = !args.includes("--format") ? ["--format", "stylish"] : [];

  const filesGiven = parsedArgs._.length > 0;

  if (filesGiven) {
    // we need to take all the flag-less arguments (the files that should be linted)
    // and filter out the ones that aren't ts files.
    const filesList = parsedArgs._.filter(
      a => a.endsWith(".ts") || a.endsWith(".tsx")
    );

    // If given files are not 'ts' or 'tsx' and no project is given skip linting.
    if (filesList.length === 0 && !args.includes("--project")) {
      project.logger.info("Files are provided but none of them are lintable.");
      return { status: 0 };
    }

    // The remaining files are then added to the list of flags to be the final args
    args = args.filter(a => !parsedArgs._.includes(a) || filesList.includes(a));
  }

  const useDefaultProject = !filesGiven && !args.includes("--project");
  const projectArgs = useDefaultProject ? ["--project", "./tsconfig.json"] : [];
  return project.execute([
    "tslint",
    [...config, ...format, ...args, ...projectArgs]
  ]);
};
