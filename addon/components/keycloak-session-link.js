import Component from '@glimmer/component';

import {action} from '@ember/object';
import {inject as service} from '@ember/service';

/**
 * @class KeycloakSessionLink
 * @public
 */
export default class KeycloakSessionLink extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  @service()
  keycloakSession;

  @action
  login() {
    this.keycloakSession.login();
  }

  @action
  logout() {
    this.keycloakSession.logout();
  }
}
