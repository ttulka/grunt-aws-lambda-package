'use strict';

var packageTask = require('../utils/package_task');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('lambda_package', 'Creates a package with the lambda', packageTask.getHandler(grunt));

};
