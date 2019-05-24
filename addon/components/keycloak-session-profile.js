import Component from '@ember/component';

import { action, computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-status';

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

  layout = template;

  token = null;

  @computed('token')
  get roles() {

    const token = get(this, 'keycloakSession.tokenParsed');

    const array = [];

    if (token) {
      const access = token['resource_access'];
      Object.keys(access).forEach(k => {
        const roles = access[k]['roles'];
        roles.forEach(r => array.push(`${k}/${r}`));
      })
    }

    return array;
  }

  @action
  loadUserProfile() {
    this.keycloakSession.loadUserProfile();
  }
}
