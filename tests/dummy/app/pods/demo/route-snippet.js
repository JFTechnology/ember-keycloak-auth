import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {

  @service()
  keycloakSession;

  /**
   * Collect keycloak options and install the Keycloak service.
   */
  init() {

    super.init(...arguments);

    let options = {
      url: 'https://auth.myserver.com/auth',
      realm: 'my-realm',
      clientId: 'my-client-id',
    };

    this.keycloakSession.installKeycloak(options);
  }

  /**
   * Use before model hook to initiate the wrapped Keycloak service. This returns a promise that the framework will
   * resolve before the application transitions to child routes.
   */
  beforeModel() {
    return this.keycloakSession.initKeycloak();
  }
}
