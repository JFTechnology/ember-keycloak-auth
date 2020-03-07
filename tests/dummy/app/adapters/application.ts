import JSONAPIAdapter from 'ember-data/adapters/json-api';

import KeycloakSession from '@jftechnology/ember-keycloak-auth/services/keycloak-session';

import {inject as service} from "@ember/service";
import RSVP from "rsvp";

export default class ApplicationAdapter extends JSONAPIAdapter {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  @service
  keycloakSession!: KeycloakSession;

  get headers(): {} {
    console.log(`ApplicationAdapter :: headers() -> ${JSON.stringify(this.keycloakSession.headers, null, 2)}`);
    return this.keycloakSession.headers;
  }

  /**
   * Wrap the adapter ajax method to ensure that the call to the secured back end is made only after the session token has been updated.
   *
   * @method ajax
   * @param url {String}
   * @param type {String}
   * @param hash {Object}
   * @return {Promise}
   * @private
   */
  ajax(url: string, type: string, hash: {}): RSVP.Promise<any> {
    console.log(`ApplicationAdapter :: ajax(${url} / ${type} / ${JSON.stringify(hash, null, 2)})`);
    return this.keycloakSession.wrappedCall(() => super.ajax(url, type, hash));
  }
}
