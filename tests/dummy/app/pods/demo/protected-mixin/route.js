import Route from '@ember/routing/route';

import KeycloakAuthenticatedRouteMixin from '@jftechnology/ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default class ProtectedRoute extends Route.extend(KeycloakAuthenticatedRouteMixin) {
}
