import Ember from 'ember';

const {RSVP} = Ember;
const {Promise} = RSVP;

export default Ember.Service.extend({

  routingService: Ember.inject.service('-routing'),

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
   * Default route to transition to after successful login
   */
  defaultLoginRoute: 'logged-in',

  /**
   * Default route to transition to after logout
   */
  defaultLogoutRoute: 'logged-out',

  /**
   * Keycloak.init() option.
   */
  onLoad: 'check-sso',

  /**
   * Keycloak.init() option.
   */
  responseMode: 'fragment',

  /**
   * Keycloak.init() option.
   */
  flow: 'standard',

  /**
   * Keycloak.init() option.
   */
  checkLoginIframe: false,

  /**
   * Keycloak.init() option.
   */
  checkLoginIframeInterval: 5,

  /**
   * Redirect uri to use for login redirection
   */
  defaultLoginRedirectUri: Ember.computed('defaultLoginRoute', function () {

    return this._defaultRedirectUri('defaultLoginRoute');
  }),

  /**
   * Redirect uri to use for logout redirection
   */
  defaultLogoutRedirectUri: Ember.computed('defaultLogoutRoute', function () {

    return this._defaultRedirectUri('defaultLogoutRoute');
  }),

  /**
   * @param defaultRoute - fall back route
   * @returns {*}
   * @private
   */
  _defaultRedirectUri(defaultRoute) {

    var route = this.get(defaultRoute);
    var router = this.get('routingService.router');

    return `${window.location.origin}${router.generate(route)}`;
  },

  /**
   * @param parameters constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
   */
  installKeycloak(parameters) {

    console.log('Keycloak session :: keycloak');

    var self = this;

    var keycloak = new Keycloak(parameters);

    keycloak.onReady = function (authenticated) {
      console.log('onReady ' + authenticated);
      self.set('ready', true);
      self.set('authenticated', authenticated);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthSuccess = function () {
      console.log('onAuthSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthError = function () {
      console.log('onAuthError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshSuccess = function () {
      console.log('onAuthRefreshSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshError = function () {
      console.log('onAuthRefreshError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onTokenExpired = function () {
      console.log('onTokenExpired');
      self.set('timestamp', new Date());
    };

    keycloak.onAuthLogout = function () {
      console.log('onAuthLogout');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    Ember.Application.keycloak = keycloak;

    console.log('Keycloak session :: init :: completed');
  },

  initKeycloak() {

    console.log('Keycloak session :: prepare');

    var keycloak = this.get('keycloak');
    var options = {};

    options['onLoad'] = this.get('onLoad');
    options['responseMode'] = this.get('responseMode');
    options['checkLoginIframe'] = this.get('checkLoginIframe');
    options['checkLoginIframeInterval'] = this.get('checkLoginIframeInterval');
    options['flow'] = this.get('flow');

    return new Promise(function (resolve, reject) {
      keycloak.init(options)
        .success(function (authenticated) {
          resolve(authenticated);
        })
        .error(function (reason) {
          reject(reason);
        });
    });
  },

  keycloak: Ember.computed('timestamp', function () {
    return Ember.Application.keycloak;
  }),

  subject: Ember.computed('timestamp', function () {
    return Ember.Application.keycloak.subject;
  }),

  refreshToken: Ember.computed('timestamp', function () {
    return Ember.Application.keycloak.refreshToken;
  }),

  token: Ember.computed('timestamp', function () {
    return Ember.Application.keycloak.token;
  }),

  updateToken(){

    // console.log(`Keycloak session :: updateToken`);

    var minValidity = this.get('minValidity');
    var keycloak = this.get('keycloak');

    return new Promise(function (resolve, reject) {

      keycloak.updateToken(minValidity)
        .success(function (refreshed) {
          // console.log(`update token resolved as success refreshed='${refreshed}'`);
          resolve(refreshed);
        })
        .error(function () {
          console.log('update token resolved as error');
          reject(new Error('authentication token update failed'));
        });
    });
  },

  checkTransition(transition){

    var self = this;
    var routingService = this.get('routingService');
    var router = this.get('routingService.router');
    var parser = this._parseRedirectUrl;

    return this.updateToken().then(null, function (reason) {

      console.log(`Keycloak session :: checkTransition :: update token failed reason='${reason}'`);

      var redirectUri = parser(routingService, router, transition);

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
    var url = transition.intent.url;

    if (url) {

      url = router.location.formatURL(url);
      console.log(`Keycloak session :: parsing explicit intent URL from transition :: '${url}'`);

    } else {

      /**
       * If no explicit url try to generate one
       */
      url = routingService.generateURL(transition.targetName, transition.intent.contexts, transition.queryParams);
      console.log(`Keycloak session :: parsing implicit intent URL from transition :: '${url}'`);
    }

    return `${window.location.origin}${url}`;
  },

  /**
   * @param url optional redirect url - if not present the
   */
  login(url) {

    var redirectUri = url || this.get('defaultLoginRedirectUri');
    var keycloak = this.get('keycloak');
    var options = {redirectUri};

    console.log('Keycloak session :: login :: ' + JSON.stringify(options));

    return new Promise(function (resolve, reject) {

      keycloak.login(options).success(function () {
        console.log('Keycloak session :: login :: success');
        resolve('login OK');
      }).error(function () {
        console.log('login error - this should never be possible');
        reject(new Error('login failed'));
      });
    });
  },

  /**
   * @param url optional redirect url - if not present the
   */
  logout(url) {

    var redirectUri = url || this.get('defaultLogoutRedirectUri');
    var keycloak = this.get('keycloak');
    var options = {redirectUri};

    console.log('Keycloak session :: logout :: ' + JSON.stringify(options));

    return new Promise(function (resolve, reject) {

      keycloak.logout(options).success(function () {
        console.log('Keycloak session :: logout :: success');
        keycloak.clearToken();
        resolve('logout OK');
      }).error(function () {
        console.log('logout error - this should never be possible');
        keycloak.clearToken();
        reject(new Error('logout failed'));
      });
    });
  }
});
