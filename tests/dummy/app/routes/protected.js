/**
 *
 */
import Ember from 'ember';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak/mixins/keycloak-authenticated-route-mixin';

export default Ember.Route.extend(KeycloakAuthenticatedRouteMixin, {

  model: function (params) {

    console.log(`Protected route ${Object.keys(params)}`);
  }

});
