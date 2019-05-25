import Route from '@ember/routing/route';

export default class ProtectedMetadataRoute extends Route {

  /*
   * Implements the RouteInfo Metadata API
   */
  buildRouteInfoMetadata() {
    return {
      updateKeycloakToken: true,
    }
  }
}
