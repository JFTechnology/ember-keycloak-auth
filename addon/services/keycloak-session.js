import Ember from 'ember';

const {RSVP} = Ember;
const {Promise} = RSVP;

export default Ember.Service.extend({

  routingService: Ember.inject.service('-routing'),

  name: 'keycloak session',

  validity: 30,

  timestamp: new Date(),

  authenticated: false,

  ready: false,

  loginRoute: 'keycloak.status',

  logoutRoute: 'keycloak.logged-out',

  onLoad: 'check-sso',

  responseMode: 'fragment',

  flow: 'standard',

  checkLoginIframe: false,

  checkLoginIframeInterval: 5,

  /**
   * Route to use for login redirection
   */
  loginRedirect: Ember.computed('timestamp', 'landingRoute', function () {

    var route = this.get('loginRoute');
    var router = this.get('routingService.router');
    var redirectBase = this.get('redirectBase');

    return `${redirectBase}${router.generate(route)}`;
  }),

  /**
   * Route to use for logout redirection
   */
  logoutRedirect: Ember.computed('timestamp', 'loginRoute', function () {

    var route = this.get('logoutRoute');
    var router = this.get('routingService.router');
    var redirectBase = this.get('redirectBase');

    return `${redirectBase}${router.generate(route)}`;
  }),

  redirectBase: Ember.computed(function () {

    return `${window.location.origin}`;
  }),

  installKeycloak(parameters) {

    console.log('Keycloak session :: keycloak');

    var self = this;

    var keycloak = Keycloak(parameters);

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

    var validity = this.get('validity');
    var keycloak = Ember.Application.keycloak;

    return new Promise(function (resolve, reject) {

      keycloak.updateToken(validity)
        .success(function (refreshed) {
          // console.log(`update token resolved as success refreshed='${refreshed}'`);
          resolve(refreshed);
        })
        .error(function (reason) {
          console.log('update token resolved as error ' + reason);
          reject(new Error('authentication token update failed'));
        });
    });
  },

  checkTransition(transition){

    var self = this;
    var routingService = this.get('routingService');
    var router = this.get('routingService.router');

    return this.updateToken().then(null, function (reason) {

      /**
       * First check the intent for an explicit url
       */
      var url = transition.intent.url;


      if (url) {

        url = router.location.formatURL(url);
        console.log(`Keycloak session :: checkTransition :: intent url = ${url} reason=${reason}`);

      } else {
        /**
         * If no explicit url try to generate one
         */
        url = routingService.generateURL(transition.targetName, transition.intent.contexts, transition.queryParams);
        console.log(`Keycloak session :: checkTransition :: generated url = ${url} reason=${reason}`);
      }

      url = `${window.location.origin}${url}`;

      return self._doLogin({'redirectUri': url});
    });
  },

  login() {

    var redirectUri = this.get('loginRedirect');

    console.log('Keycloak session :: login ' + redirectUri);

    var options = {};

    if (redirectUri) {
      options['redirectUri'] = redirectUri;
    }

    return this._doLogin(options);
  },

  _doLogin(options) {

    var keycloak = this.get('keycloak');

    console.log('Keycloak session :: login ' + options);

    return new Promise(function (resolve, reject) {

      keycloak.login(options).success(function () {
        console.log('success');
        resolve('login OK');
      }).error(function () {
        console.log('login error - this should never be possible');
        reject(new Error('login failed'));
      });
    });
  },

  logout() {

    console.log('Keycloak session :: logout');

    var redirectUri = this.get('logoutRedirect');
    var keycloak = this.get('keycloak');

    console.log('Keycloak session :: logout ' + redirectUri);

    var options = {};

    if (redirectUri) {
      options['redirectUri'] = redirectUri;
    }

    return new Promise(function (resolve, reject) {

      keycloak.logout(options).success(function () {
        console.log('success');
        resolve('logout OK');
      }).error(function () {
        console.log('logout error - this should never be possible');
        reject(new Error('logout failed'));
      });
    });
  }
});
