'use strict';

module.exports = {

  name: 'ember-keycloak-auth',

  included: function (app) {
    this._super.included(app);
    app.import('node_modules/keycloak-js/dist/keycloak.js');
  }

};
