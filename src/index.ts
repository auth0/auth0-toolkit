#!/usr/bin/env node
import { Project } from "toolkit-utils";

// In order to have a typed import, use require
// tslint:disable-next-line:no-var-requires
const project: Project = require("./project");
export default project;

// If called from the CLI
if (require.main === module) {
  try {
    project.executeFromCLI();
  } catch (e) {
    project.logger.error(e);
    process.exit(1);
  }
}
