import Route from '@ember/routing/route';

export default class ModelBRoute extends Route {

  /*
   * Implements the RouteInfo Metadata API
   */
  buildRouteInfoMetadata() {
    return {
      updateKeycloakToken: true,
    }
  }
}
