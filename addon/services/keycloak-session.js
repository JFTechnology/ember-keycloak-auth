/*global Keycloak*/
/*eslint no-undef: "error"*/
import RSVP from 'rsvp';
import Service from '@ember/service';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Application from '@ember/application';
import { debug } from '@ember/debug';

const { Promise } = RSVP;

export default Service.extend({

  routingService: inject('-routing'),

  name: 'keycloak session',

  /**
   * Value used in calls to KeyCloak.updateToken(minValidity)
   */
  minValidity: 30,

  /**
   * Bound property to track session state. Indicates that a keycloak session has been successfully created.
   */
  ready: false,

  /**
   * Bound property to track session state. Indicates that the session has authenticated.
   */
  authenticated: false,

  /**
   * Bound property to track session state. Track last activity time.
   */
  timestamp: null,

  /**
   * Default route to transition to after successful login
   */
  defaultLoginRoute: 'logged-in',

  /**
   * Default route to transition to after logout. This will be used to calculate the redirectUri
   * parameter used when calling Keycloak.logout() when no explicit value is given. This only has
   * effect when the onLoad init option is set to 'check-sso'.
   */
  defaultLogoutRoute: 'logged-out',

  /**
   * Keycloak.init() option. Should be one of 'check-sso' or 'login-required'.
   * See http://www.keycloak.org/documentation.html for complete details.
   */
  onLoad: 'login-required',

  /**
   * Keycloak.init() option. Should be one of 'query' or 'fragment'.
   * See http://www.keycloak.org/documentation.html for complete details.
   */
  responseMode: 'fragment',

  /**
   * Keycloak.init() option. Should be one of 'standard', 'implicit' or 'hybrid'.
   * See http://www.keycloak.org/documentation.html for complete details.
   */
  flow: 'standard',

  /**
   * Keycloak.init() option.
   */
  checkLoginIframe: true,

  /**
   * Keycloak.init() option.
   */
  checkLoginIframeInterval: 5,

  /**
   * Redirect uri to use for login redirection
   */
  defaultLoginRedirectUri: computed('defaultLoginRoute', function() {

    return this._defaultRedirectUri('defaultLoginRoute');
  }),

  /**
   * Redirect uri to use for logout redirection
   */
  defaultLogoutRedirectUri: computed('defaultLogoutRoute', function() {

    return this._defaultRedirectUri('defaultLogoutRoute');
  }),

  /**
   * @param defaultRoute - fall back route
   * @returns {*}
   * @private
   */
  _defaultRedirectUri(defaultRoute) {

    let route = this.get(defaultRoute);
    let router = this.get('routingService.router');

    return `${window.location.origin}${router.generate(route)}`;
  },

  /**
   * @param parameters constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
   */
  installKeycloak(parameters) {

    debug('Keycloak session :: keycloak');

    let self = this;

    let keycloak = new Keycloak(parameters);

    keycloak.onReady = function(authenticated) {
      debug(`onReady ${authenticated}`);
      self.set('ready', true);
      self.set('authenticated', authenticated);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthSuccess = function() {
      debug('onAuthSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthError = function() {
      debug('onAuthError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshSuccess = function() {
      debug('onAuthRefreshSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshError = function() {
      debug('onAuthRefreshError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
      keycloak.clearToken();
    };

    keycloak.onTokenExpired = function() {
      debug('onTokenExpired');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthLogout = function() {
      debug('onAuthLogout');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    Application.keycloak = keycloak;

    debug('Keycloak session :: init :: completed');
  },

  initKeycloak() {

    debug('Keycloak session :: prepare');

    let keycloak = this.get('keycloak');
    let options = this.getProperties('onLoad', 'responseMode', 'checkLoginIframe', 'checkLoginIframeInterval', 'flow');

    //options['onLoad'] = this.get('onLoad');
    //options['responseMode'] = this.get('responseMode');
    //options['checkLoginIframe'] = this.get('checkLoginIframe');
    //options['checkLoginIframeInterval'] = this.get('checkLoginIframeInterval');
    //options['flow'] = this.get('flow');

    return new Promise((resolve, reject) => {
      keycloak.init(options)
        .success(authenticated => {
          resolve(authenticated);
        })
        .error(reason => {
          reject(reason);
        });
    });
  },

  keycloak: computed('timestamp', () => Application.keycloak),

  subject: computed('timestamp', () => Application.keycloak.subject),

  refreshToken: computed('timestamp', () => Application.keycloak.refreshToken),

  token: computed('timestamp', () => Application.keycloak.token),

  updateToken() {

    // debug(`Keycloak session :: updateToken`);

    let minValidity = this.get('minValidity');
    let keycloak = this.get('keycloak');

    return new Promise((resolve, reject) => {

      keycloak.updateToken(minValidity)
        .success(refreshed => {
          // debug(`update token resolved as success refreshed='${refreshed}'`);
          resolve(refreshed);
        })
        .error(() => {
          debug('update token resolved as error');
          reject(new Error('authentication token update failed'));
        });
    });
  },

  checkTransition(transition) {

    let self = this;
    let routingService = this.get('routingService');
    let router = this.get('routingService.router');
    let parser = this._parseRedirectUrl;

    return this.updateToken().then(null, reason => {

      debug(`Keycloak session :: checkTransition :: update token failed reason='${reason}'`);

      let redirectUri = parser(routingService, router, transition);

      return self.login(redirectUri);
    });
  },

  /**
   * Parses the redirect url from the intended route of a transition. WARNING : this relies on private methods in an
   * undocumented class.
   *
   * @param routingService
   * @param router
   * @param transition
   * @returns URL to include as the Keycloak redirect
   * @private
   */
  _parseRedirectUrl(routingService, router, transition) {

    /**
     * First check the intent for an explicit url
     */
    let url = transition.intent.url;

    if (url) {

      url = router.location.formatURL(url);
      debug(`Keycloak session :: parsing explicit intent URL from transition :: '${url}'`);

    } else {

      /**
       * If no explicit url try to generate one
       */
      url = routingService.generateURL(transition.targetName, transition.intent.contexts, transition.queryParams);
      debug(`Keycloak session :: parsing implicit intent URL from transition :: '${url}'`);
    }

    return `${window.location.origin}${url}`;
  },

  loadUserProfile() {

    let self = this;

    this.get('keycloak').loadUserProfile().success(profile => {

      debug(`Loaded profile for ${profile.id}`);
      self.set('profile', profile);
    });
  },

  /**
   * @param url optional redirect url - if not present the
   */
  login(url) {

    let redirectUri = url || this.get('defaultLoginRedirectUri');
    let keycloak = this.get('keycloak');
    let options = { redirectUri };

    debug(`Keycloak session :: login :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      keycloak.login(options).success(() => {
        debug('Keycloak session :: login :: success');
        resolve('login OK');
      }).error(() => {
        debug('login error - this should never be possible');
        reject(new Error('login failed'));
      });
    });
  },

  /**
   * @param url optional redirect url - if not present the
   */
  logout(url) {

    let redirectUri = url || this.get('defaultLogoutRedirectUri');
    let keycloak = this.get('keycloak');
    let options = { redirectUri };

    debug(`Keycloak session :: logout :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      keycloak.logout(options).success(() => {
        debug('Keycloak session :: logout :: success');
        keycloak.clearToken();
        resolve('logout OK');
      }).error(() => {
        debug('logout error - this should never be possible');
        keycloak.clearToken();
        reject(new Error('logout failed'));
      });
    });
  },
});
