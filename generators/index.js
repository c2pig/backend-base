'use strict';
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  prompting: function () {
    var prompts = [

    {
      type    : 'input',
      name    : 'projectName',
      message : 'Your project brand',
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
    let YAML = require('js-yaml');
    let basePath = 'base';
    this.props.basePath = basePath;

    const files = {
      'common/**':'common',
      'ingest/**':'ingest',
      'validation/**':'validation',
      'moderation/**':'moderation',
      'config.js':'config.js',
    };

    const templates = {
      'serverless.yml': '../serverless.yml',
      'package.json': '../package.json',
      '.gitignore':'../.gitignore',
      'ingest/functions.yml': '../tmp/ingest.func.tmp',
      'validation/functions.yml': '../tmp/validation.func.tmp',
      'moderation/functions.yml': '../tmp/moderation.func.tmp'
    };

    const partials = {
      'tmp/ingest.func.tmp' : '../serverless.yml',
      'tmp/validation.func.tmp' : '../serverless.yml',
      'tmp/moderation.func.tmp' : '../serverless.yml'
    };

    const normalCopy = (path, dest) => {
      this.fs.copy(this.templatePath(path), this.destinationPath(dest));
    }

    const templateCopy = (path, dest) => this.fs.copyTpl(this.templatePath(path), this.destinationPath(dest), this.props);

    const contentMerge = (fromFile, toFile) => {

      let partialCfg = YAML.safeLoad(this.fs.read(fromFile));

      if(! this.mainCfg) {
        this.mainCfg = YAML.safeLoad(this.fs.read(toFile));
      }

      if(! this.mainCfg.functions) {
        this.mainCfg.functions = {};
      }
      this.mainCfg.functions = Object.assign(this.mainCfg.functions, partialCfg);
      this.fs.write(toFile, YAML.safeDump(this.mainCfg));
    }

    const translatedTemplateMerge = (fromFile, toFile) => {
      return contentMerge(this.destinationPath(fromFile), this.destinationPath(toFile));
    }

    const fileOps = ((action, files) => {
      Object.keys(files).forEach((function(path) {
        const dest = basePath + '/' + files[path] || path;
        action(path, dest);
      }).bind(this));
    }).bind(this);

    fileOps(normalCopy, files);
    fileOps(templateCopy, templates);
    fileOps(translatedTemplateMerge, partials);
  },

  install: function () {
    this.installDependencies({bower:true, npm:false});
  }
});
