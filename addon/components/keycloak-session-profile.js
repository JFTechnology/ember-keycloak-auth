import Component from '@glimmer/component';

import {action, computed, get} from '@ember/object';
import {inject as service} from '@ember/service';

/**
 * @class KeycloakSessionProfile
 * @public
 */
export default class KeycloakSessionProfile extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  @service()
  keycloakSession;

  @computed('keycloakSession.timestamp')
  get resourceRoles() {

    const token = get(this, 'keycloakSession.tokenParsed');

    if (token) {
      return token['resource_access'];
    }

    return {};
  }

  @computed('keycloakSession.timestamp')
  get realmRoles() {

    const token = get(this, 'keycloakSession.tokenParsed');

    if (token) {
      return token['realm_access'];
    }

    return {};
  }

  @action
  loadUserProfile() {
    this.keycloakSession.loadUserProfile();
  }
}
