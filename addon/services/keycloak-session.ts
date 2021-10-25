/*eslint no-undef: "error"*/
import Service, {inject as service} from '@ember/service';
import {KeycloakAdapterService} from '@jftechnology/ember-keycloak-auth';

import Keycloak, {
  KeycloakConfig,
  KeycloakError,
  KeycloakFlow,
  KeycloakInitOptions,
  KeycloakInstance,
  KeycloakLoginOptions,
  KeycloakOnLoad,
  KeycloakProfile,
  KeycloakResponseMode,
  KeycloakTokenParsed
} from 'keycloak-js';

import RSVP from 'rsvp';
import {computed, set} from '@ember/object';
import RouterService from "ember__routing/router-service";

const {Promise} = RSVP;

/**
 * Injectable Ember service that wraps an application wide Keycloak js instance.
 *
 * @class KeycloakSessionService
 * @public
 */
export default class KeycloakSessionService extends Service implements KeycloakAdapterService {

  /**
   * The injected Ember router service.
   *
   * @property router
   * @type {RouterService}
   */
  @service
  router!: RouterService;

  _keycloak?: KeycloakInstance<"native">;

  profile?: KeycloakProfile;

  /**
   * Value in seconds used in calls to KeyCloak.updateToken(minValidity). Default 30.
   *
   * @property minValidity
   * @type {number}
   */
  minValidity: number = 30;

  /**
   * Bound property to track session state. Indicates that a keycloak session has been successfully created. Default false.
   *
   * @property ready
   * @type {boolean}
   */
  ready: boolean = false;

  /**
   * Bound property to track session state. Indicates that the session has authenticated. Default false.
   *
   * @property authenticated
   * @type {boolean}
   */
  authenticated: boolean = false;

  /**
   * Bound property to track session state. Track last activity time.
   *
   * @property timestamp
   * @type {Date}
   */
  timestamp?: Date;

  /**
   * Keycloak.init() option. Should be one of 'check-sso' or 'login-required'. Default 'login-required'.
   * See http://www.keycloak.org/documentation.html for complete details.
   *
   * @property onLoad
   * @type {String}
   */
  onLoad: KeycloakOnLoad = 'login-required';

  /**
   * Keycloak.init() option. Should be one of 'query' or 'fragment'. Default 'fragment'.
   * See http://www.keycloak.org/documentation.html for complete details.
   *
   * @property responseMode
   * @type {String}
   */
  responseMode: KeycloakResponseMode = 'fragment';

  /**
   * Keycloak.init() option. Should be one of 'standard', 'implicit' or 'hybrid'. Default 'standard'.
   * See http://www.keycloak.org/documentation.html for complete details.
   *
   * @property flow
   * @type {String}
   */
  flow: KeycloakFlow = 'standard';

  /**
   * Keycloak.init() option. Default 'false'.
   *
   * @property checkLoginIframe
   * @type {boolean}
   */
  checkLoginIframe: boolean = false;

  /**
   * Keycloak.init() option. Default '5'.
   *
   * @property checkLoginIframeInterval
   * @type {number}
   */
  checkLoginIframeInterval: number = 5;

  /**
   * Keycloak.init() option.
   *
   * @property silentCheckSsoRedirectUri
   * @type {String}
   */
  silentCheckSsoRedirectUri?: string;
  
    /**
   * Keycloak.init() option.
   *
   * @property enableLogging
   * @type {boolean}
   */
  enableLogging?: boolean;

  /**
   * Keycloak.login() option.
   *
   * @property idpHint
   * @type {String}
   */
  idpHint?: string;

  /**
   * Keycloak.login() option.
   *
   * @property idpHint
   * @type {String}
   */
  verbose: boolean = false;

  /**
   * @method installKeycloak
   * @param {*[]} parameters Constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
   */
  installKeycloak(parameters: KeycloakConfig | string) {

    if (this.verbose) {
      console.debug('KeycloakSessionService :: install');
    }

    let keycloak: KeycloakInstance<"native"> = Keycloak<"native">(parameters);

    this._installKeycloak(keycloak);
  }

  _installKeycloak(keycloak: KeycloakInstance<"native">) {

    keycloak.onReady = this.onReady;
    keycloak.onAuthSuccess = this.onAuthSuccess;
    keycloak.onAuthError = this.onAuthError;
    keycloak.onAuthRefreshSuccess = this.onAuthRefreshSuccess;
    keycloak.onAuthRefreshError = this.onAuthRefreshError;
    keycloak.onTokenExpired = this.onTokenExpired;
    keycloak.onAuthLogout = this.onAuthLogout;

    set(this, '_keycloak', keycloak);
    set(this, 'timestamp', new Date());

    if (this.verbose) {
      console.debug('KeycloakSessionService :: install :: completed');
    }
  }

  /**
   * @method initKeycloak
   */
  initKeycloak(): Promise<any> | void {

    if (this.verbose) {
      console.debug('KeycloakSessionService :: init');
    }

    let options: KeycloakInitOptions = this.getProperties('onLoad', 'responseMode', 'checkLoginIframe', 'checkLoginIframeInterval', 'flow', 'silentCheckSsoRedirectUri', 'enableLogging');

    options.promiseType = "native";

    if (this.keycloak) {
      let keycloak = this.keycloak;
      return new Promise((resolve, reject) => {
        keycloak.init(options)
          .then(
            authenticated => {
              console.info('KeycloakSessionService :: init complete');
              resolve(authenticated);
            },
            reason => {
              console.warn('KeycloakSessionService :: init failed');
              reject(reason);
            });
      });
    }
  }

  /**
   * The wrapped Keycloak instance.
   *
   * @property keycloak
   * @type {Keycloak}
   */
  @computed('_keycloak', 'timestamp')
  get keycloak(): KeycloakInstance<"native"> | undefined {
    return this._keycloak;
  }

  /**
   * The current Keycloak subject.
   *
   * @property subject
   * @type {string | undefined}
   */
  get subject(): string | undefined {
    return this.keycloak ? this.keycloak.subject : undefined;
  }

  /**
   * The current Keycloak refreshToken.
   *
   * @property refreshToken
   * @type {string}
   */
  get refreshToken(): string | undefined {
    return this.keycloak ? this.keycloak.refreshToken : undefined;
  }

  /**
   * The current Keycloak token.
   *
   * @property token
   * @type {string}
   */
  get token(): string | undefined {
    return this.keycloak ? this.keycloak.token : undefined;
  }

  /**
   * The current Keycloak tokenParsed.
   *
   * @property tokenParsed
   * @type {string}
   */
  get tokenParsed(): KeycloakTokenParsed | undefined {
    return this.keycloak ? this.keycloak.tokenParsed : undefined;
  }

  /**
   * Convenience property presents the current token as the Authorization header typically required by calls to a back end service.
   * @property headers
   * @type {Object}
   */
  get headers(): {} {

    return {
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method hasRealmRole
   * @param role {string} The role to check
   * @return {boolean} True if user in role.
   */
  hasRealmRole(role: string): boolean {
    return !!(this.keycloak && this.keycloak.hasRealmRole(role));
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method hasResourceRole
   * @param role {string} The role to check
   * @param resource {string} The resource to check
   * @return {boolean} True if user in role.
   */
  hasResourceRole(role: string, resource: string): boolean {
    return !!(this.keycloak && this.keycloak.hasResourceRole(role, resource));
  }

  inRole(role: string, resource: string): boolean {

    if (role && resource) {
      return this.hasResourceRole(role, resource);
    }

    if (role) {
      return this.hasRealmRole(role);
    }

    return false;
  }

  /**
   * Delegates to the wrapped Keycloak instance's method using the minValidity property.
   *
   * @method updateToken
   * @return {Promise} Wrapped promise.
   */
  updateToken(): RSVP.Promise<boolean> {

    return new RSVP.Promise((resolve, reject) => {

      if (this.keycloak) {
        this.keycloak.updateToken(this.minValidity)
          .then(
            refreshed => {
              resolve(refreshed);
            },
            () => {
              console.debug('update token resolved as error');
              reject(new Error('authentication token update failed'));
            });
      } else {
        reject(new Error("No installed keycloak instance"));
      }
    });
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method clearToken
   * @return {Promise} Wrapped promise.
   */
  clearToken() {
    if (this.keycloak) {
      this.keycloak.clearToken();
    }
  }

  /**
   * Parses the redirect url from the intended 'to' route of a transition.
   *
   * @method _parseRedirectUrl
   * @param {RouterService} router The ember router service.
   * @param {Transition} transition The transition in progress.
   * @return {String} URL to include as the Keycloak redirect
   * @private
   */
  _parseRedirectUrl() {

    // @ts-ignore
    console.debug(`KeycloakSessionService :: _parseRedirectUrl :: ${window.location.origin} + ${this.router.rootURL} + ${this.router.currentURL}`);

    let redirect = '/';

    // @ts-ignore
    if (this.router.rootURL) {
      // @ts-ignore
      redirect = redirect + this.router.rootURL;
    }

    if (this.router.currentURL) {
      redirect = redirect + this.router.currentURL;
    }

    redirect = window.location.origin + redirect.replace(new RegExp('//', 'g'), '/');

    console.debug(`KeycloakSessionService :: _parseRedirectUrl :: ${redirect}`);

    return redirect;
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method loadUserProfile
   * @return {RSVP.Promise} Resolves on server response
   */
  loadUserProfile(): RSVP.Promise<any> {

    return new RSVP.Promise((resolve, reject) => {

      if (this.keycloak) {
        this.keycloak.loadUserProfile()
          .then(
            profile => {
              console.debug(`Loaded profile for ${profile.id}`);
              set(this, 'profile', profile);
              resolve(profile);
            },
            error => {
              reject(error);
            });
      } else {
        reject(new Error("KeycloakSessionService :: no installed keycloak instance"));
      }
    });
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method login
   * @param {String} redirectUri Optional redirect url
   * @return {Promise} Resolves on server response
   */
  login(redirectUri: string): RSVP.Promise<any> {

    let options: KeycloakLoginOptions = {redirectUri};

    // Add idpHint to options, if it is populated
    if (this.idpHint) {
      options.idpHint = this.get('idpHint');
    }

    return new RSVP.Promise((resolve, reject) => {

      if (this.keycloak) {
        this.keycloak.login(options)
          .then(
            () => {
              console.debug('KeycloakSessionService :: login :: success');
              resolve('login OK');
            },
            () => {
              console.debug('KeycloakSessionService :: login error');
              reject(new Error('login failed'));
            });
      } else {
        reject(new Error("KeycloakSessionService :: no installed keycloak instance"));
      }
    });
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method logout
   * @param {String} redirectUri Optional redirect url
   * @return {RSVP.Promise} Resolves on server response.
   */
  logout(redirectUri: string): RSVP.Promise<any> {

    let options = {redirectUri};

    return new RSVP.Promise((resolve, reject) => {

      if (this.keycloak) {
        let keycloak = this.keycloak;
        keycloak.logout(options)
          .then(
            () => {
              console.debug('KeycloakSessionService :: logout :: success');
              keycloak.clearToken();
              resolve('logout OK');
            });
      } else {
        reject(new Error("KeycloakSessionService :: no installed keycloak instance"));
      }
    });
  }

  wrappedCall(call: () => {}): RSVP.Promise<any> {

    return this.updateToken()
      .then(result => {
        if (result && this.verbose) {
          console.debug(`KeycloakSessionService :: token was refreshed prior to wrapped call`);
        }
        return true;
      })
      .then(
        call,
        (reason: any) => {
          console.warn(`KeycloakSessionService :: update token :: rejected :: ${reason}`);
          let url = this._parseRedirectUrl();
          this.login(url);
          throw reason;
        });
  }

  /**
   * Keycloak callback function.
   *
   * @property onReady
   * @type {Function}
   */
  onReady = (authenticated: boolean) => {
    set(this, 'ready', true);
    set(this, 'authenticated', authenticated);
    set(this, 'timestamp', new Date());
    console.info(`KeycloakSessionService :: onReady -> ${authenticated}`);
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthSuccess
   * @type {Function}
   */
  onAuthSuccess = () => {
    set(this, 'authenticated', true);
    set(this, 'timestamp', new Date());

    if (this.verbose) {
      console.debug(`KeycloakSessionService :: onAuthSuccess :: token -> ${this.token}`);
    }
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthError
   * @type {Function}
   */
  onAuthError = (errorData: KeycloakError) => {
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());

    console.warn(`KeycloakSessionService :: onAuthError :: error -> ${errorData.error}, description -> ${errorData.error_description}`);
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthRefreshSuccess
   * @type {Function}
   */
  onAuthRefreshSuccess = () => {
    set(this, 'authenticated', true);
    set(this, 'timestamp', new Date());

    if (this.verbose) {
      console.debug(`KeycloakSessionService :: onAuthRefreshSuccess :: token -> ${this.token}`);
    }
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthRefreshError
   * @type {Function}
   */
  onAuthRefreshError = () => {
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
    this.clearToken();
    console.warn('KeycloakSessionService :: onAuthRefreshError');
  };

  /**
   * Keycloak callback function.
   *
   * @property onTokenExpired
   * @type {Function}
   */
  onTokenExpired = () => {
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
    console.info('KeycloakSessionService :: onTokenExpired');
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthLogout
   * @type {Function}
   */
  onAuthLogout = () => {
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
    console.info('KeycloakSessionService :: onAuthLogout');
  };
}

