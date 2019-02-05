import { Project, Script, ScriptKit } from "toolkit-utils";

export const script: Script = function babelScript(
  project: Project,
  args: any[],
  s: ScriptKit
) {
  throw new Error("A Babel build script has not yet been implemented");
};
