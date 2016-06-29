/**
 *
 */
import Ember from 'ember';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default Ember.Route.extend(KeycloakAuthenticatedRouteMixin, {

  model: function (params) {

    console.log(`Protected 2 route ${Object.keys(params)}`);
  }

});
