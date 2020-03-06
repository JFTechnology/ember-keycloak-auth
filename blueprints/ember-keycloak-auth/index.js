/* jshint node: true */
/* eslint-disable node/no-extraneous-require */
const chalk = require('chalk');

module.exports = {

  description: '@jftechnology/ember-keycloak-auth',

  normalizeEntityName() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall() {

    this.ui.writeLine(chalk.green(`  adding keycloak-js package`));

    return this.addPackagesToProject([
      {name: 'keycloak-js'}
    ]);
  },
};
