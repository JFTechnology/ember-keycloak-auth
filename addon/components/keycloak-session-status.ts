import Component from '@glimmer/component';

import {action} from '@ember/object';
import {inject as service} from '@ember/service';

import {KeycloakAdapterService} from '@jftechnology/ember-keycloak-auth';

/**
 * @class KeycloakSessionStatus
 * @public
 */
export default class KeycloakSessionStatus extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakAdapterService}
   */
  @service
  keycloakSession!: KeycloakAdapterService;

  @action
  refresh() {
    this.keycloakSession.updateToken().then(result => {
      console.debug(result);
    });
  }

  @action
  login() {
    this.keycloakSession.login().then(result => {
      console.debug(result);
    });
  }

  @action
  logout() {
    this.keycloakSession.logout().then(result => {
      console.debug(result);
    });
  }
}
