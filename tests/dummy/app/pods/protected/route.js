import Route from '@ember/routing/route';

import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default class ProtectedRoute extends Route.extend(KeycloakAuthenticatedRouteMixin) {
}
