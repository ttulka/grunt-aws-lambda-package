# grunt-aws-lambda-package

> A grunt plugin for packaging functions for [AWS Lambda](http://aws.amazon.com/lambda/).

## Getting Started
This plugin requires Grunt `~0.4.5`

```shell
npm install grunt-aws-lambda-package --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-aws-lambda-package');
```
## Usage

### lambda_package

This task generates a lambda package including npm dependencies using the default npm install functionality.

In your project's Gruntfile, add a section named `lambda_package` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    lambda_package: {
        default: {
            options: {
                // Task-specific options go here.
            }
        }
    },
});
```

#### Options

##### options.include_files
Type: `Array`
Default value: `[]`

List of files to explicitly include in the package, even if they would be ignored by NPM

##### options.dist_folder
Type: `String`
Default value: `dist`

The folder where the complete zip files should be saved relative to the Gruntfile.

##### options.base_folder
Type: `String`
Default value: `./`

The folder where the package files should be found relative to the Gruntfile.  

##### options.include_time
Type: `Boolean`
Default value: `true`

Whether or not to timestamp the packages, if set to true the current date/time will be included in the zip name, if false
 then the package name will be constant and consist of just the package name and version.

##### options.include_version
Type: `Boolean`
Default value: `true`

Whether or not to include the NPM package version in the artifact package name. Set to false if you'd prefer a static
 package file name regardless of the version.

#### Examples

##### Default Options
In this example, the default options are used therefore if we have the following in our `Gruntfile.js`:

```js
grunt.initConfig({
    lambda_package: {
        default: {
            options: {
                // Task-specific options go here.
            }
        }
    },
});
```
And the following in `package.json`

```json
{
    "name": "my-lambda-function",
    "description": "An Example Lamda Function",
    "version": "0.0.1",
    "private": "true",
    "dependencies": {
        "jquery": "2.1.1"
    },
    "devDependencies": {
        "grunt": "0.4.*",
        "grunt-pack": "0.1.*",
        "grunt-aws-lambda": "0.1.*"
    }
}
```

Then we run `grunt lambda_package`, we should see a new zip file in a new folder called `dist` called something like:

`my-lambda-function_0-0-1_2014-10-30-18-29-4.zip`

If you unzip that and look inside you should see something like:
```
index.js
package.json
node_modules/
node_modules/jquery
node_modules/jquery/... etc
```

Given that by default the dist folder is inside your function folder you can easily end up bundling previous packages
 inside subsequent packages therefore it is **strongly advised that you add dist to your .npmignore**.

For example your `.npmignore` might look something like this:
```
event.json
Gruntfile.js
dist
*.iml
```
