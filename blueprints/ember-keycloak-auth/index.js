/* jshint node: true */

module.exports = {

  description: 'ember-keycloak-auth',

  afterInstall: function () {

    return this.addBowerPackagesToProject([
      { name: 'keycloak' }
    ]);

  }

};
