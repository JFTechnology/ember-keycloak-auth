import {
  CompatPromise,
  KeycloakConfig,
  KeycloakError,
  KeycloakInitOptions,
  KeycloakInstance,
  KeycloakProfile,
  KeycloakTokenParsed
} from 'keycloak-js';

import {AUTH_STORE} from '@jftechnology/ember-keycloak-auth/test-support';

/**
 * Mock of the Keycloak Adapter instance - installed by the Keycloak Session mock instead of a live KeycloakInstance.
 *
 * @class MockKeycloakInstance
 * @public
 */
export default class MockKeycloakInstance implements KeycloakInstance<"native"> {

  parameters?: KeycloakConfig;

  options?: KeycloakInitOptions;

  _response: any;

  _parsedToken?: KeycloakTokenParsed;

  _profile?: KeycloakProfile;

  get token() {
    return this._response.access_token;
  }

  get tokenParsed(): KeycloakTokenParsed | undefined {
    return this._parsedToken;
  }

  get subject(): string | undefined {
    return this.tokenParsed ? this.tokenParsed.sub : undefined;
  }

  constructor(parameters: KeycloakConfig) {

    this.parameters = parameters;
  }

  init(options: KeycloakInitOptions): CompatPromise<"native", boolean, KeycloakError> {
    console.log(`MockKeycloak :: init :: ${options}`);
    this.options = options;
    this.onReady(false);
    return new MockPromise(true, null);
  }

  login(options: any): Promise<void> {
    console.log(`MockKeycloak :: login :: ${options}`);
    this._response = AUTH_STORE.response;
    this._parsedToken = AUTH_STORE.parsedToken;
    this._profile = AUTH_STORE.profile;
    this.onAuthSuccess();
    return new MockPromise(true, false);
  }

  logout(options: any): Promise<void> {
    console.log(`MockKeycloak :: logout :: ${options}`);
    this.onAuthLogout();
    return new MockPromise(true, false);
  }

  updateToken(minValidity: number): CompatPromise<"native", boolean, boolean> {
    console.log(`MockKeycloak :: updateToken :: ${minValidity}`);
    return new MockPromise(true, false);
  }

  clearToken(): void {
    console.log(`MockKeycloak :: clearToken`);
    this._response = null;
    this._parsedToken = undefined;
    this._profile = undefined;
  }

  loadUserProfile(): CompatPromise<"native", KeycloakProfile, void> {
    console.log(`MockKeycloak :: loadUserProfile`);
    return new MockPromise(this._profile, false);
  }

  hasRealmRole(role: string): boolean {

    if (this.tokenParsed && this.tokenParsed.realm_access) {
      return (this.tokenParsed.realm_access.roles || []).includes(role);
    }

    return false;
  }

  hasResourceRole(role: string, resource: string): boolean {

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
  register(): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Redirects to the Account Management Console.
   * @method {accountManagement}
   */
  accountManagement(): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Returns the URL to login form.
   * @method {createLoginUrl}
   * @param options {object} Supports same options as Keycloak#login.
   */
  createLoginUrl(): string {
    throw new Error("not implemented");
  }

  /**
   *
   * Returns the URL to logout the user.
   * @method {createLogoutUrl}
   * @param options {object} Logout options.
   * @param options.redirectUri {string} Specifies the uri to redirect to after logout.
   */
  createLogoutUrl(): string {
    throw new Error("not implemented");
  }

  /**
   * Returns the URL to registration page.
   * @method {createRegisterUrl}
   * @param options {object} Supports same options as Keycloak#createLoginUrl but
   *                `action` is set to `'register'`.
   */
  createRegisterUrl(): string {
    throw new Error("not implemented");
  }

  /**
   * Returns the URL to the Account Management Console.
   * @method {createAccountUrl}
   */
  createAccountUrl(): string {
    throw new Error("not implemented");
  }

  /**
   * Returns true if the token has less than `minValidity` seconds left before
   * it expires.
   * @method {isTokenExpired}
   * @param minValidity {number} If not specified, `0` is used.
   */
  isTokenExpired(): boolean {
    throw new Error("not implemented");
  }

  /**
   * @private Undocumented.
   * @method {loadUserInfo}
   */
  loadUserInfo(): Promise<{}> {
    throw new Error("not implemented");
  }

  /**
   * Called when the adapter is initialized.
   * @method {onReady}
   */
  onReady(authenticated?: boolean): void {
    console.log(`on ready ${authenticated}`);
  }

  /**
   * Called when a user is successfully authenticated.
   * @method {onAuthSuccess}
   */
  onAuthSuccess(): void {

  }

  /**
   * Called if the user is logged out (will only be called if the session
   * status iframe is enabled, or in Cordova mode).
   * @method {onAuthLogout}
   */
  onAuthLogout(): void {

  }
}

class MockPromise extends Promise<any> {

  successValue: any;

  errorValue: any;

  resolve: any;

  reject: any;

  constructor(successValue: any, errorValue: any) {
    super((/*resolve, reject*/) => {
      // this.resolve = resolve;
      // this.reject = reject;
    });
    this.successValue = successValue;
    this.errorValue = errorValue;
  }

  then<TResult1 = any, TResult2 = never>(onfulfilled?: (value: any) => TResult1, onrejected?: (reason: any) => TResult2) {

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
