import Component from '@ember/component';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-link';

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

  layout = template;

  @action
  login() {
    this.keycloakSession.login();
  }

  @action
  logout() {
    this.keycloakSession.logout();
  }
}
