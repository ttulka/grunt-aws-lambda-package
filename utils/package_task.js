'use strict';

var path = require('path');
var npm = require("npm");
var archive = require('archiver');
var fs = require('fs');
var tmp = require('temporary');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var dateFacade = require('./date_facade');

var packageTask = {};

packageTask.getHandler = function (grunt) {

    return function () {
        var task = this;

        var options = this.options({
            'dist_folder': 'dist',
            'include_time': false,
            'include_version': false,
            'include_files': [],
            'base_folder': './',
            'exclude_aws_sdk': true
        });

        var pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), "utf8"));
        
        var dir = new tmp.Dir();
        var done = this.async();

        var archive_name = pkg.name;

        if (options.include_time) {
            archive_name += '-' + dateFacade.getFormattedTimestamp(new Date());
        }

        if (options.include_version) {
            archive_name += '-' + pkg.version.replace(/\./g, '_');
        }
       
        npm.load([], function (err, npm) {

            npm.config.set('loglevel', 'silent');
            npm.config.set('production', true);
            npm.config.get('global', false)

            var install_location = dir.path;
            var zip_path = install_location + '/' + archive_name + '.zip';
            
            fs.copyFileSync('./package.json', install_location + '/package.json');
            
            try {
                fs.copyFileSync('./package-lock.json', install_location + '/package-lock.json');
            } catch (err) { }                 
                  
            npm.commands.install(install_location, [], function () {

                var output = fs.createWriteStream(zip_path);
                var zipArchive = archive('zip');

                /*
                 * Monkey patch to ensure permissions are always 777
                 * Prevents issues on Windows for directories that don't have execute permissions
                 */
                var old_normalizeEntryData = zipArchive._normalizeEntryData;
                zipArchive._normalizeEntryData = function (data, stats) {
                    // 0777 file permission
                    data.mode = 511;
                    return old_normalizeEntryData.apply(zipArchive, [data, stats]);
                };

                zipArchive.pipe(output);

                function packZip() {
                    zipArchive.bulk([
                        {
                            src: ['./package.json', './README.md'],
                            dot: true,
                            expand: true,
                            cwd: './'
                        }
                    ]);
                    
                    zipArchive.bulk([
                        {
                            src: ['./node_modules/**'],
                            dot: true,
                            expand: true,
                            cwd: install_location
                        }
                    ]);

                    zipArchive.bulk([
                        {
                            src: options.include_files.length ? options.include_files : ['./**'],
                            dot: true,
                            expand: true,
                            cwd: options.base_folder
                        }
                    ]);

                    zipArchive.finalize();

                    output.on('close', function () {
                        mkdirp('./' + options.dist_folder, function (err) {
                            var dist_path = './' + options.dist_folder + '/' + archive_name + '.zip';
                            var dist_zip = fs.createWriteStream(dist_path);
                            fs.createReadStream(zip_path).pipe(dist_zip);

                            dist_zip.on('close', function () {
                                rimraf(install_location, function () {
                                    grunt.log.writeln('Created package at ' + dist_path);
                                    done(true);
                                });
                            });
                        });
                    });
                }     
                      
                if (options.exclude_aws_sdk) {
                    var prefix = npm.prefix;
                    npm.prefix = install_location;
                    npm.commands.uninstall([install_location, 'aws-sdk'], function () {
                        npm.prefix = prefix;
                        packZip();                 
                    });
                } else {
                    packZip();
                }
            });
        });
    };
};

module.exports = packageTask;