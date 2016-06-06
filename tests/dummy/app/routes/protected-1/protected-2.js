/**
 *
 */
import Ember from 'ember';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak/mixins/keycloak-authenticated-route-mixin';

export default Ember.Route.extend(KeycloakAuthenticatedRouteMixin, {

  model: function (params) {

    console.log(`Protected 2 route ${Object.keys(params)}`);
  }

});
