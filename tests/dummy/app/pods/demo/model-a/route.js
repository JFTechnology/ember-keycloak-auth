import Route from '@ember/routing/route';

import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default class ModelARoute extends Route.extend(KeycloakAuthenticatedRouteMixin) {

  model() {
    return this.store.createRecord('model-a', { name: 'Instance of Model A' });
  }
}
