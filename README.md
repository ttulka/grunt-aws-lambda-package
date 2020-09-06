# grunt-aws-lambda-package

> A grunt plugin for packaging functions for [AWS Lambda](http://aws.amazon.com/lambda/).

Node >= 8 is required.

## Getting Started

```shell
npm install grunt-aws-lambda-package --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile:

```js
grunt.loadNpmTasks('grunt-aws-lambda-package');
```
## Usage

The task `lambda_package` generates a zip including npm production dependencies.

In the Gruntfile, add a section named `lambda_package` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    lambda_package: {
        default: {
            options: {
                // Options go here.
            }
        }
    },
});
```

### Options

#### options.include_files
Type: `Array`
Default value: `**/*`

Files to explicitly include in the package, even if they would be ignored by npm.

#### options.dist_folder
Type: `String`
Default value: `dist`

The folder where the complete zip files should be saved relative to the Gruntfile.

#### options.base_folder
Type: `String`
Default value: `./`

The folder where the package files should be found relative to the Gruntfile.  

#### options.include_time
Type: `Boolean`
Default value: `false`

Whether or not to timestamp the packages, if set to true the current date/time will be included in the zip name.

#### options.include_version
Type: `Boolean`
Default value: `false`

Whether or not to include the npm package version in the artifact package name.
 
#### options.exclude_aws_sdk
Type: `Boolean`
Default value: `true`

Whether or not to exclude the AWS-SDK module from the package.

## Example

### Default Options
In this example, the default options are used therefore if we have the following `Gruntfile.js`:

```js
module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    lambda_package: {
        default: {
        }
    },
  });
  
  grunt.loadNpmTasks('grunt-aws-lambda-package');

  grunt.registerTask('package', ['lambda_package']); 
};
```
And the following in `package.json`

```json
{
    "name": "my-lambda-function",
    "version": "1.0.0",
    "scripts": {
      "package": "grunt package"
    },
    "dependencies": {
        "aws-sdk": "^2.243.1",
        "jquery": "^3.3.1"
    },
    "devDependencies": {
        "jasmine": "^3.1.0",
        "grunt": "^1.0.2",
        "grunt-cli": "^1.2.0",
        "grunt-aws-lambda-package": "0.0.7",        
    }
}
```

Then we run `npm run package`, we should see a new zip file in a new folder called `dist` called:

`my-lambda-function.zip`

If you unzip that and look inside you should see something like:
```
index.js
package.json
node_modules/
node_modules/jquery
node_modules/jquery/... etc
```

No development dependencies, no AWS SDK.
