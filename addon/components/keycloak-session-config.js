import Component from '@glimmer/component';

import {inject as service} from '@ember/service';

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

}
