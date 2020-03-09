import Component from '@glimmer/component';

import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {KeycloakAdapterService} from "@jftechnology/ember-keycloak-auth";

/**
 * @class KeycloakSessionLink
 * @public
 */
export default class KeycloakSessionLink extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakAdapterService}
   */
  @service
  keycloakSession!: KeycloakAdapterService;

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
