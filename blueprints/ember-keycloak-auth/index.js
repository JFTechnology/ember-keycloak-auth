/* jshint node: true */

module.exports = {

  description: 'ember-keycloak-auth',

  normalizeEntityName: function () {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function () {

    return this.addBowerPackagesToProject([
      {name: 'keycloak'}
    ]);
  }

};
