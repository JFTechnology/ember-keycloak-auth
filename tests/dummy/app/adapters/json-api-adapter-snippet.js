import JSONAPIAdapter from '@ember-data/adapter/json-api';

import {inject as service} from "@ember/service";

export default class ApplicationAdapter extends JSONAPIAdapter {

  /**
   * An injected keycloak session.
   *
   * @property keycloakSession
   * @type {KeycloakSession}
   */
  @service
  keycloakSession;

  /**
   * Keycloak session will present the current token as Authentication headers.
   * @return {Object}
   */
  get headers() {
    return this.keycloakSession.headers;
  }

  /**
   * Wrap the JSONAPIAdapter ajax method to ensure that calls to a secured back end is made only after the session token has been updated.
   *
   * @method ajax
   * @param url {String}
   * @param type {String}
   * @param hash {Object}
   * @return {Promise}
   */
  ajax(url, type, hash) {
    return this.keycloakSession.wrappedCall(() => super.ajax(url, type, hash));
  }
}
