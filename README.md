<h3 align="center">auth0-toolkit</h3>
<p align="center">CLI toolkit for common scripts for JS/TS Auth0 projects</p>

---

Inspired by ["Tools without config"](https://blog.kentcdodds.com/automation-without-config-412ab5e47229), ["The Melting Pot of JavaScript"](https://youtu.be/G39lKaONAlA), and [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Configuration](#configuration)
  - [Overriding Configuration](#overriding-configuration)
- [API](#api)
  - [Modules](#modules)
  - [build](#build)
  - [doc](#doc)
  - [format](#format)
  - [init](#init)
  - [lint](#lint)
  - [precommit](#precommit)
  - [test](#test)
  - [validate](#validate)
- [Author](#author)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

1. Create a project:
   - `npm init new-auth0-project`
   - If it's a TypeScript project: add `types` into `package.json`. For example:
     - `{ "types": "lib/index" }`
1. Install auth-toolkit:
   - `npm install --save-dev auth0-toolkit`
1. Run the initialization script:
   - `npx auth0-toolkit init`
1. Use included scripts:
   - `npm run build -- --watch`
   - `npm run build:doc`
   - `npm run validate`
   - `npm run format`
   - `npm run lint`
   - ... etc.

# Configuration

This toolkit exposes a bin called `auth0-toolkit`. All scripts are stored in `lib/scripts` and all configuration files are stored in `lib/config`.

The toolkit determines whether a project is a TypeScript project or JavaScript project depending on whether the `types`
property exists in `package.json`.

All included tools can have their configuration overwritten by adding flags to the command or by including configuration files in the root of your project. For example: running `auth0-toolkit format` will run Prettier with the included configuration, but having a `.prettierrc` in your project will cause the toolkit to use that configuration instead.

## Overriding Configuration

During the toolkit setup process, configuration files for the libraries used by the toolkit are created in the project root. Libraries natively supporting an "extend" feature will use those by default to allow for toolkit configuration to be used as a starting point.

All configuration can be overridden with configuration files, `package.json` properties, or arguments passed to the toolkit binary.

# API

## Modules

<dl>
<dt><a href="#module_build">build</a></dt>
<dd><p>Build project using TypeScript or Babel based on project type.</p>
<p><strong>TypeScript</strong></p>
<ul>
<li>Copies js and d.ts files from src to lib using <code>rsync</code>, because <code>tsc</code> does not allow <code>--allowJs</code> and <code>--declaration</code> parameters at the same time.</li>
<li>Cleans target directory before build.</li>
</ul>
<p><strong>Babel</strong></p>
<ul>
<li>If no <code>--ignore</code> parameter presents, ignores by default: <code>__tests__</code>, <code>__mocks__</code>, <code>__test_supplements__</code>, <code>__test_helpers__</code>, <code>*.(test|spec).(js|ts|jsx|tsx)</code></li>
</ul></dd>
<dt><a href="#module_doc">doc</a></dt>
<dd><p>Generates documentation files.</p>
<ul>
<li>Generates <code>README.md</code> from the <code>README.hbs</code> <a href="https://handlebarsjs.com/">handlebars</a> template file and
from <a href="http://usejsdoc.org/">JSDoc</a> comments in source files.</li>
<li>Generates a table of contents.</li>
<li>If no <code>--configure</code> parameter is present and no configuration file is available, uses the builtin configuration provided by this library.</li>
<li>If no <code>--files</code> parameter given, uses all files recursively in <code>src</code> directory.</li>
<li>If no <code>--template</code> parameter given, uses README.hbs` in project root.</li>
</ul></dd>
<dt><a href="#module_format">format</a></dt>
<dd><p>Formats project files using <code>prettier</code>.</p>
<ul>
<li>If no config is provided (<code>--config</code>, <code>prettier.config.js</code>, or <code>prettierrc</code> in package.json), the default Prettier configuration will be used.</li>
<li>If no <code>--ignore-path</code> flag is provided or no <code>.prettierignore</code> file is present, the ignore file provided by the library will be used.</li>
</ul></dd>
<dt><a href="#module_init">init</a></dt>
<dd><p>Initializes the project</p>
<p>The <code>init</code> script generates necessary files and updates <code>package.json</code>. This script is executed automatically during <code>preinstall</code> and <code>postinstall</code> stages.
It can also be manually executed.</p>
<p>The following entries added to <code>package.json</code>:</p>
<ul>
<li>scripts.build</li>
<li>scripts.test</li>
<li>scripts.watch</li>
<li>scripts.lint</li>
<li>scripts.format</li>
<li>scripts.validate</li>
<li>scripts.prepublishOnly</li>
</ul>
<p>The following files are created:</p>
<ul>
<li>.prettierrc.js</li>
<li>.prettierignore</li>
<li>.huskyrc.js</li>
<li>.eslintrc.js</li>
<li>tslint.json</li>
<li>tsconfig.json</li>
</ul></dd>
<dt><a href="#module_lint">lint</a></dt>
<dd><p>Lint project using TSLint or ESLint based on project type.</p>
<p><strong>TSLint</strong></p>
<ul>
<li>If project has no <code>tslint.json</code> or <code>--config</code> is given, uses builtin configuration provided by this library.</li>
<li>If no files and <code>--project</code> argument is given, uses default TypeScript project directory provided by <code>tsconfig.json</code> in the root of the project.</li>
</ul>
<p><strong>Babel</strong></p>
<ul>
<li>If project has no ESLint configuration (<code>.eslintrc.js</code> or <code>eslintConfig</code> in <code>package.json</code>) or no <code>--config</code> is given, uses builtin configuration provided by this library.</li>
<li>If no <code>--ignore-path</code> argument is provided, uses <code>.gitignore</code>.</li>
<li>Uses <code>--cache</code> by default. (can be disabled with <code>--no-cache</code>)</li>
</ul></dd>
<dt><a href="#module_precommit">precommit</a></dt>
<dd><p>The script that is automatically executed before a commit using <code>lintstaged</code></p>
<ul>
<li>If no config is provided (<code>--config</code>, <code>lint-staged.config.js</code>, or <code>lint-staged</code> in package.json), uses builtin configuration.</li>
<li>Executes <code>lint-staged</code>.<ul>
<li>doc (if there's a build:doc script in package.json)</li>
<li>format and add to git</li>
<li>lint</li>
<li>test (executes test related to changed files)</li>
</ul>
</li>
</ul></dd>
<dt><a href="#module_test">test</a></dt>
<dd><p>Test project using <a href="https://jestjs.io/">Jest</a></p>
<ul>
<li>Sets <code>BABEL_ENV</code> and <code>NODE_ENV</code> to <code>test</code>.</li>
<li>If not in CI, precommit stage, or following arguments are not present <code>--no-watch</code>, <code>--coverage</code>, <code>--updateSnapshot</code> or <code>--watchAll</code>, watches changes.</li>
<li>If no config is provided (<code>--config</code>, <code>jest.config.js</code> etc.) uses builtin configuration provided by this library.</li>
</ul></dd>
<dt><a href="#module_validate">validate</a></dt>
<dd><p>Runs all relevant validation steps on the project</p>
<p>Executes all the validation tasks that are relevent to the project from this list:</p>
<ul>
<li><code>lint</code></li>
<li><code>test</code></li>
<li><code>typescript</code></li>
</ul>
<p>If the event that triggers the validation script running is the <code>precommit</code> script,
<code>lint</code> and <code>test</code> will be skipped since they are already ran separately.</p></dd>
</dl>

<a name="module_build"></a>

## build

<p>Build project using TypeScript or Babel based on project type.</p>
<p><strong>TypeScript</strong></p>
<ul>
<li>Copies js and d.ts files from src to lib using <code>rsync</code>, because <code>tsc</code> does not allow <code>--allowJs</code> and <code>--declaration</code> parameters at the same time.</li>
<li>Cleans target directory before build.</li>
</ul>
<p><strong>Babel</strong></p>
<ul>
<li>If no <code>--ignore</code> parameter presents, ignores by default: <code>__tests__</code>, <code>__mocks__</code>, <code>__test_supplements__</code>, <code>__test_helpers__</code>, <code>*.(test|spec).(js|ts|jsx|tsx)</code></li>
</ul>

**Properties**

| Name         | Default          | Description                                                                             |
| ------------ | ---------------- | --------------------------------------------------------------------------------------- |
| [--out-dir]  | <code>lib</code> | <p>Output destination for built files. (Babel)</p>                                      |
| [--outDir]   | <code>lib</code> | <p>Output destination for built files. (Typescript)</p>                                 |
| [--no-clean] |                  | <p>If present, does not clean target directory.</p>                                     |
| [OTHERS]     |                  | <p>All CLI options used by related binary. (<code>tsc</code> or <code>babel</code>)</p> |

**Example**

```js
$ npm run build -- --watch --preserveWatchOutput
$ npx auth0-toolkit build
$ npx auth0-toolkit build --watch --preserveWatchOutput
```

<a name="module_doc"></a>

## doc

<p>Generates documentation files.</p>
<ul>
<li>Generates <code>README.md</code> from the <code>README.hbs</code> <a href="https://handlebarsjs.com/">handlebars</a> template file and
from <a href="http://usejsdoc.org/">JSDoc</a> comments in source files.</li>
<li>Generates a table of contents.</li>
<li>If no <code>--configure</code> parameter is present and no configuration file is available, uses the builtin configuration provided by this library.</li>
<li>If no <code>--files</code> parameter given, uses all files recursively in <code>src</code> directory.</li>
<li>If no <code>--template</code> parameter given, uses README.hbs` in project root.</li>
</ul>

**Properties**

| Name     | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| [OTHERS] | <p>All CLI options used by related binary. (<code>jsdoc2md</code>)</p> |

**Example**

```js
$ npm run build:doc
$ npx auth0-toolkit doc
```

<a name="module_format"></a>

## format

<p>Formats project files using <code>prettier</code>.</p>
<ul>
<li>If no config is provided (<code>--config</code>, <code>prettier.config.js</code>, or <code>prettierrc</code> in package.json), the default Prettier configuration will be used.</li>
<li>If no <code>--ignore-path</code> flag is provided or no <code>.prettierignore</code> file is present, the ignore file provided by the library will be used.</li>
</ul>

**Properties**

| Name         | Description                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| [--no-write] | <p>If provided, files will not be written to disk. (Defaults to writing to disk)</p> |
| [OTHERS]     | <p>All CLI options used by the related binary. (<code>prettier</code>)</p>           |

**Example**

```js
$ npm run format
$ npx auth0-scripts format
```

<a name="module_init"></a>

## init

<p>Initializes the project</p>
<p>The <code>init</code> script generates necessary files and updates <code>package.json</code>. This script is executed automatically during <code>preinstall</code> and <code>postinstall</code> stages.
It can also be manually executed.</p>
<p>The following entries added to <code>package.json</code>:</p>
<ul>
<li>scripts.build</li>
<li>scripts.test</li>
<li>scripts.watch</li>
<li>scripts.lint</li>
<li>scripts.format</li>
<li>scripts.validate</li>
<li>scripts.prepublishOnly</li>
</ul>
<p>The following files are created:</p>
<ul>
<li>.prettierrc.js</li>
<li>.prettierignore</li>
<li>.huskyrc.js</li>
<li>.eslintrc.js</li>
<li>tslint.json</li>
<li>tsconfig.json</li>
</ul>

**Properties**

| Name         | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| [...files]   | <p>Files to lint</p>                                                                            |
| [--no-cache] | <p>Disables ESLint <code>--cache</code> arg which is added by this script.</p>                  |
| [OTHERS]     | <p>All CLI options used by the related binary. (<code>eslint</code> or <code>tslint</code>)</p> |

**Example**

```js
$ npx auth0-toolkit init
```

<a name="module_lint"></a>

## lint

<p>Lint project using TSLint or ESLint based on project type.</p>
<p><strong>TSLint</strong></p>
<ul>
<li>If project has no <code>tslint.json</code> or <code>--config</code> is given, uses builtin configuration provided by this library.</li>
<li>If no files and <code>--project</code> argument is given, uses default TypeScript project directory provided by <code>tsconfig.json</code> in the root of the project.</li>
</ul>
<p><strong>Babel</strong></p>
<ul>
<li>If project has no ESLint configuration (<code>.eslintrc.js</code> or <code>eslintConfig</code> in <code>package.json</code>) or no <code>--config</code> is given, uses builtin configuration provided by this library.</li>
<li>If no <code>--ignore-path</code> argument is provided, uses <code>.gitignore</code>.</li>
<li>Uses <code>--cache</code> by default. (can be disabled with <code>--no-cache</code>)</li>
</ul>

**Properties**

| Name         | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| [...files]   | <p>A list of files to lint.</p>                                   |
| [--no-cache] | <p>Disables ESLint's <code>--cache</code> arg.</p>                |
| [OTHERS]     | <p>All CLI options used by related binary. (TSLint or ESLint)</p> |

**Example**

```js
$ npm run lint
$ npm run lint my-file.ts -- --config my-config.json
$ npx auth0-toolkit lint
$ npx auth0-toolkit lint --no-cache
$ npx auth0-toolkit lint my-file.ts
```

<a name="module_precommit"></a>

## precommit

<p>The script that is automatically executed before a commit using <code>lintstaged</code></p>
<ul>
<li>If no config is provided (<code>--config</code>, <code>lint-staged.config.js</code>, or <code>lint-staged</code> in package.json), uses builtin configuration.</li>
<li>Executes <code>lint-staged</code>.<ul>
<li>doc (if there's a build:doc script in package.json)</li>
<li>format and add to git</li>
<li>lint</li>
<li>test (executes test related to changed files)</li>
</ul>
</li>
</ul>

**Properties**

| Name     | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| [OTHERS] | <p>All CLI options used by the related binary. (<code>lint-staged</code>)</p> |

<a name="module_test"></a>

## test

<p>Test project using <a href="https://jestjs.io/">Jest</a></p>
<ul>
<li>Sets <code>BABEL_ENV</code> and <code>NODE_ENV</code> to <code>test</code>.</li>
<li>If not in CI, precommit stage, or following arguments are not present <code>--no-watch</code>, <code>--coverage</code>, <code>--updateSnapshot</code> or <code>--watchAll</code>, watches changes.</li>
<li>If no config is provided (<code>--config</code>, <code>jest.config.js</code> etc.) uses builtin configuration provided by this library.</li>
</ul>

**Properties**

| Name         | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| [--no-watch] | <p>If provided, tests run once. (Default is watch mode)</p>            |
| [OTHERS]     | <p>All CLI options used by the related binary. (<code>jest</code>)</p> |

**Example**

```js
$ npm run test
$ npx auth0-toolkit test
```

<a name="module_validate"></a>

## validate

<p>Runs all relevant validation steps on the project</p>
<p>Executes all the validation tasks that are relevent to the project from this list:</p>
<ul>
<li><code>lint</code></li>
<li><code>test</code></li>
<li><code>typescript</code></li>
</ul>
<p>If the event that triggers the validation script running is the <code>precommit</code> script,
<code>lint</code> and <code>test</code> will be skipped since they are already ran separately.</p>

**Properties**

| Name         | Description                                   |
| ------------ | --------------------------------------------- |
| [...scripts] | <p>A list of scripts to specifically run.</p> |

**Example**

```js
$ npm run validate custom-validator
$ npx auth0-toolkit validate
$ npx auth0-toolkit validate custom-validator,another-validator
```

# Author

[Auth0](auth0.com)

# License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
