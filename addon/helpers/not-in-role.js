import Helper from '@ember/component/helper';

import { inject as service } from '@ember/service';

/**
 * Helper that checks a keycloak session for realm or resource roles.
 *
 * Usage @disabled = {{not-in-role 'my-role'}}
 * Usage @disabled = {{not-in-role 'my-role' 'my-resource'}}
 *
 * @class HasRoleHelper
 * @public
 */
export default class NotInRoleHelper extends Helper {

  @service
  keycloakSession;

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method hasResourceRole
   * @param role {string} The role to check
   * @param resource {string} The resource to check
   * @return {boolean} True if user in role, else false.
   */
  compute([role, resource]) {

    if (role && resource) {
      return !this.keycloakSession.hasResourceRole(role, resource);
    }

    if (role) {
      return !this.keycloakSession.hasRealmRole(role);
    }

    return true;
  }
}
