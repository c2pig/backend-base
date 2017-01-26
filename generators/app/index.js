'use strict';
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  configuring() {
    let YAML = require('js-yaml');

	/*
	* current path looks like : <generator-path>\node_modules\review-service-baseline\generators\app\templates
	*/
	var cwd = this.sourceRoot();
	/*
	* move the path to src/
	*/
    this.sourceRoot(cwd + '/../../../src')
	const copies = {
	  'examples/**/*.js': this.options.codeDir,
    'examples/**/*.tmp': 'tmp',    
    '../package.import.json': 'package.json'
  };

	const templateCopy = (path, dest) => this.fs.copyTpl(this.templatePath(path), this.destinationPath(dest), this.options);

    const fileOps = ((action, files) => {
      Object.keys(files).forEach((function(path) {
        const dest = files[path] || path;
        action(path, dest);
      }).bind(this));
    }).bind(this);

	   fileOps(templateCopy, copies);
  }
};
