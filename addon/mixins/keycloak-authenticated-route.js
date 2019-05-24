import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';

/**
 * Ember Mixin that can be used to extend an Ember Route. It is intended to check that the keycloak session is fresh
 * before a route transition. If the keycloak session is not valid the keycloak session will redirect the browser
 * (by default) to the Keycloak login page.
 *
 * @class KeycloakAuthenticatedRoute
 * @public
 */
export default Mixin.create({

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  keycloakSession: inject(),

  /**
   * Overrides parent beforeModel() method to check transition against the injected keycloakSession.
   * The check will either silently refresh the current token or redirect the browser to the Keycloak server.
   *
   * @method beforeModel
   * @param transition {Transition} The cuurent transition.
   * @return {boolean}
   */
  beforeModel(transition) {

    this._super(...arguments);

    let keycloakSession = this.get('keycloakSession');

    return keycloakSession.checkTransition(transition);
  },
});
