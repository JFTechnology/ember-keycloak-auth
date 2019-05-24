import Route from '@ember/routing/route';

import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default class ModelBRoute extends Route.extend(KeycloakAuthenticatedRouteMixin) {

  model() {
    return this.store.createRecord('model-b', { name: 'Instance of Model B' });
  }
}
