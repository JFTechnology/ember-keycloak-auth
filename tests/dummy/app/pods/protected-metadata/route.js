import Route from '@ember/routing/route';

export default class ProtectedRoute extends Route {

  buildRouteInfoMetadata() {
    return {
      updateKeycloakToken: true,
    }
  }
}
