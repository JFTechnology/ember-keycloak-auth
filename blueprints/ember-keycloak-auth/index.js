/* jshint node: true */
const RSVP = require('rsvp');
const chalk = require('chalk');
const fs = require('fs-extra');

module.exports = {

  description: 'ember-keycloak-auth',

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function () {
    let bowerDependencies = this.project.bowerDependencies();
    let removal;
    if ('keycloak' in bowerDependencies) {
      removal = this.removePackageFromBowerJSON('keycloak');
    } else {
      removal = Promise.resolve();
    }
    return removal.then(() => this.addPackagesToProject([
      {name: 'keycloak-js'}
    ]));
  },

  removePackageFromBowerJSON(dependency) {
    this.ui.writeLine(chalk.green(`  uninstall bower package ${chalk.white(dependency)}`));
    return new RSVP.Promise(function (resolve, reject) {
      try {
        let bowerJSONPath = 'bower.json';
        let bowerJSON = fs.readJsonSync(bowerJSONPath);

        delete bowerJSON.dependencies[dependency];

        fs.writeJsonSync(bowerJSONPath, bowerJSON);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

};
