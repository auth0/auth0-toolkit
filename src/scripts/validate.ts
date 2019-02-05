/**
 * @module validate
 * @desc
 * Runs all relevant validation steps on the project
 *
 * Executes all the validation tasks that are relevent to the project from this list:
 * - `lint`
 * - `test`
 * - `typescript`
 *
 * If the event that triggers the validation script running is the `precommit` script,
 * `lint` and `test` will be skipped since they are already ran separately.
 *
 * @property [...scripts] A list of scripts to specifically run.
 * @example
 * $ npm run validate custom-validator
 * $ npx auth0-toolkit validate
 * $ npx auth0-toolkit validate custom-validator,another-validator
 */
import { Project, Script, ScriptKit } from "toolkit-utils";

export const script: Script = function validateScript(
  project: Project,
  args: string[],
  s: ScriptKit
) {
  // precommit runs linting and tests on the relevant files
  // so those scripts don't need to be run if we're running
  // this in the context of a precommit hook.
  const precommit = project.parseEnv("SCRIPTS_PRECOMMIT", false);
  const validateScripts = args[0];
  const useDefaultScripts = typeof validateScripts !== "string";

  const scripts = useDefaultScripts
    ? {
        lint:
          !precommit && project.packageHas("scripts.lint")
            ? "npm run lint --silent"
            : null,
        test:
          !precommit && project.packageHas("scripts.test")
            ? "npm run test --silent -- --coverage"
            : null,
        typescript: project.isTypeScript
          ? `${project.bin("tsc")} --noemit`
          : null
      }
    : validateScripts
        .split(",")
        .reduce((scriptsToRun: { [key: string]: string }, name: string) => {
          scriptsToRun[name] = `npm run ${name} --silent`;
          return scriptsToRun;
        }, {});

  return project.execute(scripts);
};
