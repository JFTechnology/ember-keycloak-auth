import {AUTH_STORE} from '@jftechnology/ember-keycloak-auth/test-support';

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
    return this.tokenParsed ? this.tokenParsed.sub : undefined;
  }

  constructor(parameters) {

    this.parameters = parameters;
  }

  init(options) {
    console.log(`MockKeycloak :: init :: ${options}`);
    this.options = options;
    this.onReady(false);
    return new MockPromise(true, null);
  }

  login(options) {
    console.log(`MockKeycloak :: login :: ${options}`);
    this._response = AUTH_STORE.response;
    this._parsedToken = AUTH_STORE.parsedToken;
    this._profile = AUTH_STORE.profile;
    this.onAuthSuccess();
    return new MockPromise(true, false);
  }

  logout(options) {
    console.log(`MockKeycloak :: logout :: ${options}`);
    this.onAuthLogout();
    return new MockPromise(true, false);
  }

  updateToken(minValidity) {
    console.log(`MockKeycloak :: updateToken :: ${minValidity}`);
    return new MockPromise(true, false);
  }

  clearToken() {
    console.log(`MockKeycloak :: clearToken`);
    this._response = null;
    this._parsedToken = undefined;
    this._profile = undefined;
  }

  loadUserProfile() {
    console.log(`MockKeycloak :: loadUserProfile`);
    return new MockPromise(this._profile, false);
  }

  hasRealmRole(role) {

    if (this.tokenParsed && this.tokenParsed.realm_access) {
      return (this.tokenParsed.realm_access.roles || []).includes(role);
    }

    return false;
  }

  hasResourceRole(role, resource) {

    if (this.tokenParsed && this.tokenParsed.resource_access && this.tokenParsed.resource_access[resource]) {
      return (this.tokenParsed.resource_access[resource].roles || []).includes(role);
    }

    return false;
  }

  /**
   * Redirects to registration form.
   * @method {register}
   * @param options {object} Supports same options as Keycloak#login but `action` is
   *                set to `'register'`.
   */
  register() {
    throw new Error("not implemented");
  }

  /**
   * Redirects to the Account Management Console.
   * @method {accountManagement}
   */
  accountManagement() {
    throw new Error("not implemented");
  }

  /**
   * Returns the URL to login form.
   * @method {createLoginUrl}
   * @param options {object} Supports same options as Keycloak#login.
   */
  createLoginUrl() {
    throw new Error("not implemented");
  }

  /**
   *
   * Returns the URL to logout the user.
   * @method {createLogoutUrl}
   * @param options {object} Logout options.
   * @param options.redirectUri {string} Specifies the uri to redirect to after logout.
   */
  createLogoutUrl() {
    throw new Error("not implemented");
  }

  /**
   * Returns the URL to registration page.
   * @method {createRegisterUrl}
   * @param options {object} Supports same options as Keycloak#createLoginUrl but
   *                `action` is set to `'register'`.
   */
  createRegisterUrl() {
    throw new Error("not implemented");
  }

  /**
   * Returns the URL to the Account Management Console.
   * @method {createAccountUrl}
   */
  createAccountUrl() {
    throw new Error("not implemented");
  }

  /**
   * Returns true if the token has less than `minValidity` seconds left before
   * it expires.
   * @method {isTokenExpired}
   * @param minValidity {number} If not specified, `0` is used.
   */
  isTokenExpired() {
    throw new Error("not implemented");
  }

  /**
   * @private Undocumented.
   * @method {loadUserInfo}
   */
  loadUserInfo() {
    throw new Error("not implemented");
  }

  /**
   * Called when the adapter is initialized.
   * @method {onReady}
   */
  onReady(authenticated) {
    console.log(`on ready ${authenticated}`);
  }

  /**
   * Called when a user is successfully authenticated.
   * @method {onAuthSuccess}
   */
  onAuthSuccess() {

  }

  /**
   * Called if the user is logged out (will only be called if the session
   * status iframe is enabled, or in Cordova mode).
   * @method {onAuthLogout}
   */
  onAuthLogout() {

  }
}

class MockPromise extends Promise {

  successValue;

  errorValue;

  resolve;

  reject;

  constructor(successValue, errorValue) {
    super((/*resolve, reject*/) => {
      // this.resolve = resolve;
      // this.reject = reject;
    });
    this.successValue = successValue;
    this.errorValue = errorValue;
  }

  then(onfulfilled, onrejected) {

    if (this.successValue) {
      if (onfulfilled) {
        onfulfilled(this.successValue);
      }
    }

    if (this.errorValue) {
      if (onrejected) {
        onrejected(this.errorValue);
      }
    }

    return this;
  }
}
