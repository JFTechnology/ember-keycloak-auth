import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {

  @service()
  keycloakSession;

  @service()
  cookies;

  init() {

    super.init(...arguments);

    // if required constructor parameters are available as cookies go ahead in init the service.
    // this should be replaced by initialization code when used in an application
    let cookies = this.cookies;

    let url = cookies.read('keycloak-url');
    let realm = cookies.read('keycloak-realm');
    let clientId = cookies.read('keycloak-clientId');

    if (url && realm && clientId) {

      let options = {
        url,
        realm,
        clientId,
      };

      this.keycloakSession.installKeycloak(options);
    }
  }

  beforeModel() {
    return this.keycloakSession.initKeycloak();
  }
}
