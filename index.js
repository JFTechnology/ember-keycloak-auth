/* jshint node: true */
'use strict';

module.exports = {

  name: 'ember-keycloak-auth',

  included: function (app) {
    this._super.included(app);
    app.import('bower_components/keycloak/dist/keycloak.js');
  }

};
