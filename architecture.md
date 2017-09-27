## Scripts
* `build`: transpiles all javascript files located in the src directory and
sends the output to the lib directory. The source-maps flag tells babel to
create a mapping file between the transpiled code and the original code to aid
in future debugging, for more information see
[here](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). The
ignore flag tells babel to not bother transpiling test files.

* `lint`: runs eslint on all javascript files in the src folder

* `start`: starts the express server

* `prestart`: makes sure that the project has been built before trying to
launch the server

* `test`: runs jest using the configuration set in the jestconf configuration
file for more information see below

## Dependencies
* @inst/eslint-config-opinionated-panda to get customized linting rules
* babel-cli to enable babel command line interface
* babel-jest to allow jest to work with babel environment
* babel-preset-env to allow babel to automatically determine Babel plugins
based on environment
* eslint for basic linting utility
* jest for a testing platform
* supertest for testing HTTP

## Config files
* .babelrc: Change the target version of Node to the one used during development
so that we only include the polyfills and transforms relevant to that version
or later.
* jestconf.json: Set jest to collect coverage information, set the directory
where jest should be collecting coverage information from, set the minimum
percent of lines that need to be covered and set the default path where
test files will be run from.
* .eslintrc: Set our linting rules to draw from the opinionated-panda package
as we are of the mind that a linter should be aggressive towards catching
errors and that the developer can turn them off when that they know they are
doing the right thing.
