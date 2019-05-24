import Component from '@ember/component';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-status';

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

  layout = template;

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
