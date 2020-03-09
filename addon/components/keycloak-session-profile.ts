import Component from '@glimmer/component';

import {action, computed} from '@ember/object';
import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import {KeycloakAdapterService} from "@jftechnology/ember-keycloak-auth";

import {KeycloakTokenParsed} from 'keycloak-js';

/**
 * @class KeycloakSessionProfile
 * @public
 */
export default class KeycloakSessionProfile extends Component {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakAdapterService}
   */
  @service
  keycloakSession!: KeycloakAdapterService;

  @alias('keycloakSession.tokenParsed')
  tokenParsed!: KeycloakTokenParsed;

  @computed('keycloakSession.timestamp')
  get resourceRoles() {

    if (this.tokenParsed) {
      return this.tokenParsed['resource_access'];
    }

    return {};
  }

  @computed('keycloakSession.timestamp')
  get realmRoles() {

    if (this.tokenParsed) {
      return this.tokenParsed['realm_access'];
    }

    return {};
  }

  @action
  loadUserProfile() {
    this.keycloakSession.loadUserProfile().then(result => {
      console.debug(result);
    });
  }
}
