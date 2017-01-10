'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({
  prompting: function () {
    var prompts = [

    {
      type    : 'input',
      name    : 'projectName',
      message : 'Your project name',
      default : this.appname.replace(/ /g, '-')
    },
    {
      type    : 'input',
      name    : 'awsRegion',
      message : 'AWS Region',
      default : 'ap-southeast-1'
    },
    {
      type    : 'input',
      name    : 'awsAccountId',
      message : 'AWS Account Id',
      default : 'xxxxxxxxxxxxxx'
    },
  ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {

    const files = {
      'common/**':'common',
      'ingest/**':'ingest',
      'validation/**':'validation',
      'config.js':'config.js',
    }

    const templates = {
      'serverless.yml': '',
      'package.json': ''
    };

    const normalCopy = (path, dest) => this.fs.copy(path, dest);
    const templateCopy = (path, dest) => this.fs.copyTpl(path, dest, this.props);

    const iterateFiles = ((files, action) => {
      Object.keys(files).forEach((function(path) {
        const dest = files[path] || path;
        action(this.templatePath(path), this.destinationPath(dest));
      }).bind(this));
    }).bind(this);

    iterateFiles(files, normalCopy);
    iterateFiles(templates, templateCopy);
  },

  install: function () {
    this.installDependencies({bower:true, npm:false});
  }
});
