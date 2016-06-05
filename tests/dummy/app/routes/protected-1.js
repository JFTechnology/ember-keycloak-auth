/**
 *
 */
import Ember from 'ember';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak/mixins/keycloak-authenticated-route-mixin';

export default Ember.Route.extend(KeycloakAuthenticatedRouteMixin, {

  model: function (params, transition) {

    console.log(`Protected route ${Object.keys(params)}`);
  }

});
