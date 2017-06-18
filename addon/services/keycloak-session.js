/*global Keycloak*/
/*eslint no-undef: "error"*/
import Ember from 'ember';

const { RSVP, inject, Service, computed, Application, Logger } = Ember;
const { Promise } = RSVP;

export default Service.extend({

  routingService: inject.service('-routing'),

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
  timestamp: new Date(),

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
   * @param parameters constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
   */
  installKeycloak(parameters) {

    Logger.debug('Keycloak session :: keycloak');

    let self = this;

    let keycloak = new Keycloak(parameters);

    keycloak.onReady = function(authenticated) {
      Logger.debug(`onReady ${authenticated}`);
      self.set('ready', true);
      self.set('authenticated', authenticated);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthSuccess = function() {
      Logger.debug('onAuthSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthError = function() {
      Logger.debug('onAuthError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshSuccess = function() {
      Logger.debug('onAuthRefreshSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshError = function() {
      Logger.debug('onAuthRefreshError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
      keycloak.clearToken();
    };

    keycloak.onTokenExpired = function() {
      Logger.debug('onTokenExpired');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthLogout = function() {
      Logger.debug('onAuthLogout');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    Application.keycloak = keycloak;

    Logger.debug('Keycloak session :: init :: completed');
  },

  initKeycloak() {

    Logger.debug('Keycloak session :: prepare');

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

    // Logger.debug(`Keycloak session :: updateToken`);

    let minValidity = this.get('minValidity');
    let keycloak = this.get('keycloak');

    return new Promise((resolve, reject) => {

      keycloak.updateToken(minValidity)
        .success(refreshed => {
          // Logger.debug(`update token resolved as success refreshed='${refreshed}'`);
          resolve(refreshed);
        })
        .error(() => {
          Logger.debug('update token resolved as error');
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

      Logger.debug(`Keycloak session :: checkTransition :: update token failed reason='${reason}'`);

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
      Logger.debug(`Keycloak session :: parsing explicit intent URL from transition :: '${url}'`);

    } else {

      /**
       * If no explicit url try to generate one
       */
      url = routingService.generateURL(transition.targetName, transition.intent.contexts, transition.queryParams);
      Logger.debug(`Keycloak session :: parsing implicit intent URL from transition :: '${url}'`);
    }

    return `${window.location.origin}${url}`;
  },

  loadUserProfile() {

    let self = this;

    this.get('keycloak').loadUserProfile().success(profile => {

      Logger.debug(`Loaded profile for ${profile.id}`);
      self.set('profile', profile);
    });
  },

  /**
   * @param url optional redirect url - if not present the
   */
  login(url) {

    let keycloak = this.get('keycloak');
    let options = { url };

    Logger.debug(`Keycloak session :: login :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      keycloak.login(options).success(() => {
        Logger.debug('Keycloak session :: login :: success');
        resolve('login OK');
      }).error(() => {
        Logger.debug('login error - this should never be possible');
        reject(new Error('login failed'));
      });
    });
  },

  /**
   * @param url optional redirect url - if not present the
   */
  logout(url) {

    let keycloak = this.get('keycloak');
    let options = { url };

    Logger.debug(`Keycloak session :: logout :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      keycloak.logout(options).success(() => {
        Logger.debug('Keycloak session :: logout :: success');
        keycloak.clearToken();
        resolve('logout OK');
      }).error(() => {
        Logger.debug('logout error - this should never be possible');
        keycloak.clearToken();
        reject(new Error('logout failed'));
      });
    });
  },
});
