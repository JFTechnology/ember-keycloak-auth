/*global Keycloak*/
/*eslint no-undef: "error"*/
import Service, { inject as service } from '@ember/service';

import RSVP from 'rsvp';
import { computed, get, set } from '@ember/object';

const { Promise } = RSVP;

/**
 * Ember service that wraps a Keycloak js instance.
 *
 * @class KeycloakSession
 * @public
 */
export default class KeycloakSession extends Service {

  /**
   * The injected Ember router service.
   *
   * @property router
   * @type {RouterService}
   */
  @service('router')
  router;

  name = 'keycloak session';

  /**
   * Value in seconds used in calls to KeyCloak.updateToken(minValidity). Default 30.
   *
   * @property minValidity
   * @type {number}
   */
  minValidity = 30;

  /**
   * Bound property to track session state. Indicates that a keycloak session has been successfully created. Default false.
   *
   * @property ready
   * @type {boolean}
   */
  ready = false;

  /**
   * Bound property to track session state. Indicates that the session has authenticated. Default false.
   *
   * @property authenticated
   * @type {boolean}
   */
  authenticated = false;

  /**
   * Bound property to track session state. Track last activity time.
   *
   * @property timestamp
   * @type {Date}
   */
  timestamp = null;

  /**
   * Keycloak.init() option. Should be one of 'check-sso' or 'login-required'. Default 'login-required'.
   * See http://www.keycloak.org/documentation.html for complete details.
   *
   * @property onLoad
   * @type {String}
   */
  onLoad = 'login-required';

  /**
   * Keycloak.init() option. Should be one of 'query' or 'fragment'. Default 'fragment'.
   * See http://www.keycloak.org/documentation.html for complete details.
   *
   * @property responseMode
   * @type {String}
   */
  responseMode = 'fragment';

  /**
   * Keycloak.init() option. Should be one of 'standard', 'implicit' or 'hybrid'. Default 'standard'.
   * See http://www.keycloak.org/documentation.html for complete details.
   *
   * @property flow
   * @type {String}
   */
  flow = 'standard';

  /**
   * Keycloak.init() option. Default 'true'.
   *
   * @property checkLoginIframe
   * @type {boolean}
   */
  checkLoginIframe = true;

  /**
   * Keycloak.init() option. Default '5'.
   *
   * @property checkLoginIframeInterval
   * @type {number}
   */
  checkLoginIframeInterval = 5;

  /**
   * Keycloak.login() option.
   *
   * @property idpHint
   * @type {String}
   */
  idpHint = null;

  init() {

    super.init(...arguments);

    this.router.on('routeWillChange', this, 'routeWillChange');
  }

  routeWillChange(transition) {

    let routeInfo = transition.to;

    if (routeInfo) {

      let info = routeInfo.find(info => get(info, 'metadata.updateKeycloakToken'));

      if (info) {

        this.checkTransition(transition);
      }
    }
  }

  /**
   * Keycloak callback function.
   *
   * @property onReady
   * @type {Function}
   */
  onReady = (authenticated) => {
    console.debug(`Keycloak session :: onReady ${authenticated}`);
    set(this, 'ready', true);
    set(this, 'authenticated', authenticated);
    set(this, 'timestamp', new Date());
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthSuccess
   * @type {Function}
   */
  onAuthSuccess = () => {
    console.debug('Keycloak session :: onAuthSuccess');
    set(this, 'authenticated', true);
    set(this, 'timestamp', new Date());
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthError
   * @type {Function}
   */
  onAuthError = () => {
    console.debug('onAuthError');
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthRefreshSuccess
   * @type {Function}
   */
  onAuthRefreshSuccess = () => {
    console.debug('onAuthRefreshSuccess');
    set(this, 'authenticated', true);
    set(this, 'timestamp', new Date());
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthRefreshError
   * @type {Function}
   */
  onAuthRefreshError = () => {
    console.debug('onAuthRefreshError');
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
    this.clearToken();
  };

  /**
   * Keycloak callback function.
   *
   * @property onTokenExpired
   * @type {Function}
   */
  onTokenExpired = () => {
    console.debug('onTokenExpired');
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
  };

  /**
   * Keycloak callback function.
   *
   * @property onAuthLogout
   * @type {Function}
   */
  onAuthLogout = () => {
    console.debug('onAuthLogout');
    set(this, 'authenticated', false);
    set(this, 'timestamp', new Date());
  };

  /**
   * @method installKeycloak
   * @param {*[]} parameters Constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
   */
  installKeycloak(parameters) {

    console.debug('Keycloak session :: keycloak');

    let keycloak = new Keycloak(parameters);

    keycloak.onReady = this.onReady;
    keycloak.onAuthSuccess = this.onAuthSuccess;
    keycloak.onAuthError = this.onAuthError;
    keycloak.onAuthRefreshSuccess = this.onAuthRefreshSuccess;
    keycloak.onAuthRefreshError = this.onAuthRefreshError;
    keycloak.onTokenExpired = this.onTokenExpired;
    keycloak.onAuthLogout = this.onAuthLogout;

    this._keycloak = keycloak;

    console.debug('Keycloak session :: install :: completed');
  }

  /**
   * @method initKeycloak
   */
  initKeycloak() {

    console.debug('Keycloak session :: init');

    let options = this.getProperties('onLoad', 'responseMode', 'checkLoginIframe', 'checkLoginIframeInterval', 'flow');

    return new Promise((resolve, reject) => {
      this.keycloak.init(options)
        .success(authenticated => {
          console.info('Keycloak session ::  init success');
          resolve(authenticated);
        })
        .error(reason => {
          console.warn('Keycloak session ::  init success');
          reject(reason);
        });
    });
  }

  /**
   * The wrapped Keycloak instance.
   *
   * @property keycloak
   * @type {Keycloak}
   */
  @computed('timestamp')
  get keycloak() {
    return this._keycloak;
  }

  /**
   * The current Keycloak subject.
   *
   * @property subject
   * @type {string}
   */
  @computed('timestamp')
  get subject() {
    return this.keycloak.subject;
  }

  /**
   * The current Keycloak refreshToken.
   *
   * @property refreshToken
   * @type {string}
   */
  @computed('timestamp')
  get refreshToken() {
    return this.keycloak.refreshToken;
  }

  /**
   * The current Keycloak token.
   *
   * @property token
   * @type {string}
   */
  @computed('timestamp')
  get token() {
    return this.keycloak.token;
  }

  /**
   * The current Keycloak tokenParsed.
   *
   * @property tokenParsed
   * @type {string}
   */
  @computed('timestamp')
  get tokenParsed() {
    return this.keycloak.tokenParsed;
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method hasRealmRole
   * @param role {string} The role to check
   * @return {boolean} True if user in role.
   */
  hasRealmRole(role) {
    return this.keycloak.hasRealmRole(role);
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method hasResourceRole
   * @param role {string} The role to check
   * @param resource {string} The resource to check
   * @return {boolean} True if user in role.
   */
  hasResourceRole(role, resource) {
    return this.keycloak.hasResourceRole(role, resource);
  }

  /**
   * Delegates to the wrapped Keycloak instance's method using the minValidity property.
   *
   * @method updateToken
   * @return {Promise}
   */
  updateToken() {

    return new Promise((resolve, reject) => {

      this.keycloak.updateToken(this.minValidity)
        .success(refreshed => {
          // console.debug(`update token resolved as success refreshed='${refreshed}'`);
          resolve(refreshed);
        })
        .error(() => {
          console.debug('update token resolved as error');
          reject(new Error('authentication token update failed'));
        });
    });
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method clearToken
   * @return {Promise} x
   */
  clearToken() {
    this.keycloak.clearToken();
  }

  /**
   * Updates the keycloak token redirecting to login page if not valid.
   *
   * @method checkTransition
   * @param {Transition} transition The transition in progress.
   * @return {Promise} Wrapped promise.
   */
  checkTransition(transition) {

    if (this.ready) {

      let url = this._parseRedirectUrl(this.router, transition);

      // console.debug(`Keycloak session :: checkTransition :: url='${url}'`);

      return this.updateToken().then(
        null,
        (reason) => {
          console.debug(`Keycloak session :: checkTransition :: update token failed reason='${reason}'. Will login with redirect='${url}'`);
          return this.login(url);
        });
    }
  }

  /**
   * Parses the redirect url from the intended 'to' route of a transition.
   *
   * @method _parseRedirectUrl
   * @param {RouterService} router The ember router service.
   * @param {Transition} transition The transition in progress.
   * @returns {String} URL to include as the Keycloak redirect
   * @private
   */
  _parseRedirectUrl(router, transition) {

    let routeInfo = transition.to;
    let queryParams = routeInfo.queryParams;

    let params = [];

    routeInfo.find(info => info.paramNames.forEach(name => params.push(info.params[name])));

    // console.debug(`Keycloak session :: _parseRedirectUrl :: '${routeInfo.name} ${JSON.stringify(params)} ${JSON.stringify(routeInfo.queryParams)}'`);

    /**
     * First check the intent for an explicit url
     */
    let url = router.urlFor(routeInfo.name, ...params, { queryParams });

    // console.debug(`Keycloak session :: _parseRedirectUrl :: ${window.location.origin} + ${router.rootUrl} + ${url}`);

    if (router.rootUrl) {

      return `${window.location.origin}${router.rootUrl}${url}`;
    }

    return `${window.location.origin}${url}`;
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method loadUserProfile
   * @return {Promise} Resolves on server response
   */
  loadUserProfile() {

    this.keycloak.loadUserProfile().success(profile => {

      console.debug(`Loaded profile for ${profile.id}`);
      set(this, 'profile', profile);
    });
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method login
   * @param {String} redirectUri Optional redirect url
   * @return {Promise} Resolves on server response
   */
  login(redirectUri) {

    let options = { redirectUri };

    //Add idpHint to options, if it is populated
    if (this.get('idpHint')) {
      options['idpHint'] = this.get('idpHint');
    }

    console.debug(`Keycloak session :: login :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      this.keycloak.login(options).success(() => {
        console.debug('Keycloak session :: login :: success');
        resolve('login OK');
      }).error(() => {
        console.debug('login error - this should never be possible');
        reject(new Error('login failed'));
      });
    });
  }

  /**
   * Delegates to the wrapped Keycloak instance's method.
   *
   * @method logout
   * @param {String} redirectUri Optional redirect url
   * @return {Promise} Resolves on server response.
   */
  logout(redirectUri) {

    let options = { redirectUri };

    console.debug(`Keycloak session :: logout :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      this.keycloak.logout(options).success(() => {
        console.debug('Keycloak session :: logout :: success');
        this.keycloak.clearToken();
        resolve('logout OK');
      }).error(() => {
        console.debug('logout error - this should never be possible');
        this.keycloak.clearToken();
        reject(new Error('logout failed'));
      });
    });
  }
}
