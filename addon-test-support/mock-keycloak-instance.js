import { get } from '@ember/object';

import { AUTH_STORE } from '@jftechnology/ember-keycloak-auth/test-support';

/**
 * Mock of the Keycloak Adapter instance - installed by the Keycloak Session mock instead of a live KeycloakInstance.
 *
 * @class MockKeycloakInstance
 * @public
 */
export default class MockKeycloakInstance {

  parameters;

  options;

  _response;

  _parsedToken;

  _profile;

  get token() {
    return this._response.access_token;
  }

  get tokenParsed() {
    return this._parsedToken;
  }

  get subject() {
    return this.tokenParsed ? this.tokenParsed.sub : null;
  }

  constructor(parameters) {

    this.parameters = parameters;
  }

  init(options) {
    console.log(`MockKeycloak :: init :: ${options}`);
    this.options = options;
    this.onReady(false);
    return new MockKeycloakPromise(true, null);
  }

  login(options) {
    console.log(`MockKeycloak :: login :: ${options}`);
    this._response = AUTH_STORE.response;
    this._parsedToken = AUTH_STORE.parsedToken;
    this._profile = AUTH_STORE.profile;
    this.onAuthSuccess();
    return new MockKeycloakPromise(true, false);
  }

  logout(options) {
    console.log(`MockKeycloak :: logout :: ${options}`);
    this.onAuthLogout();
    return new MockKeycloakPromise(true, false);
  }

  updateToken(minValidity) {
    console.log(`MockKeycloak :: updateToken :: ${minValidity}`);
    return new MockKeycloakPromise(true, false);
  }

  clearToken() {
    console.log(`MockKeycloak :: clearToken`);
    this._response = null;
    this._parsedToken = null;
    this._profile = null;
  }

  loadUserProfile() {
    console.log(`MockKeycloak :: loadUserProfile`);
    return new MockKeycloakPromise(this._profile, false);
  }

  hasRealmRole(role) {
    return (get(this, '_parsedToken.realm_access.roles') || []).includes(role);
  }

  hasResourceRole(role, resource) {
    return (get(this, `tokenParsed.resource_access.${resource}.roles`) || []).includes(role);
  }
}

class MockKeycloakPromise {

  successValue;

  errorValue;

  constructor(successValue, errorValue) {
    this.successValue = successValue;
    this.errorValue = errorValue;
  }

  success(callback) {
    if (this.success) {
      callback(this.success)
    }

    return this;
  }

  error(callback) {
    if (this.error) {
      callback(this.error)
    }

    return this;
  }
}
