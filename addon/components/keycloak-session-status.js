import Component from '@glimmer/component';

import {action} from '@ember/object';
import {inject as service} from '@ember/service';

/**
 * @class KeycloakSessionStatus
 * @public
 */
export default class KeycloakSessionStatus extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  @service()
  keycloakSession;

  @action
  refresh() {
    this.keycloakSession.updateToken().then(result => {
      console.debug(result);
    });
  }

  @action
  login() {
    this.keycloakSession.login();
  }

  @action
  logout() {
    this.keycloakSession.logout();
  }
}
