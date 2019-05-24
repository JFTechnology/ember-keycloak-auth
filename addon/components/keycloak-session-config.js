import Component from '@ember/component';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-config';

/**
 * @class KeycloakSessionConfig
 * @public
 */
export default class KeycloakSessionConfig extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  @service()
  keycloakSession;

  layout = template;

}
