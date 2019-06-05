import RouteHandler from 'ember-cli-mirage/route-handler';
import { assert } from '@ember/debug';

export function setupKeycloakMirageAuth(hooks) {

  hooks.beforeEach(function() {

    let session = this.owner.lookup('service:keycloak-session');

    this.__originalMirageRouteHandlerHandle__ = RouteHandler.prototype.handle;

    RouteHandler.prototype.handle = function(request) {

      assert(`Unauthorized request ${request.requestHeaders.authorization} != Bearer ${session.token}`, request.requestHeaders.authorization === `Bearer ${session.token}`);

      return this._getMirageResponseForRequest(request)
        .then((mirageResponse) => this.serialize(mirageResponse, request))
        .then((serializedMirageResponse) => serializedMirageResponse.toRackResponse());
    };
  });

  hooks.afterEach(function() {
    RouteHandler.prototype.handle = this.__originalMirageRouteHandlerHandle__;
    delete this.__originalMirageRouteHandlerHandle__;
  });
}
