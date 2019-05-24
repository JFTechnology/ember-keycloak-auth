/*global Keycloak*/
/*eslint no-undef: "error"*/
import Service, { inject as service } from '@ember/service';

import Application from '@ember/application';
import RSVP from 'rsvp';
import { computed } from '@ember/object';

const { Promise } = RSVP;

export default class KeycloakSession extends Service {

  @service('router')
  router;

  name = 'keycloak session';

  /**
   * Value used in calls to KeyCloak.updateToken(minValidity)
   */
  minValidity = 30;

  /**
   * Bound property to track session state. Indicates that a keycloak session has been successfully created.
   */
  ready = false;

  /**
   * Bound property to track session state. Indicates that the session has authenticated.
   */
  authenticated = false;

  /**
   * Bound property to track session state. Track last activity time.
   */
  timestamp = null;

  /**
   * Keycloak.init() option. Should be one of 'check-sso' or 'login-required'.
   * See http://www.keycloak.org/documentation.html for complete details.
   */
  onLoad = 'login-required';

  /**
   * Keycloak.init() option. Should be one of 'query' or 'fragment'.
   * See http://www.keycloak.org/documentation.html for complete details.
   */
  responseMode = 'fragment';

  /**
   * Keycloak.init() option. Should be one of 'standard', 'implicit' or 'hybrid'.
   * See http://www.keycloak.org/documentation.html for complete details.
   */
  flow = 'standard';

  /**
   * Keycloak.init() option.
   */
  checkLoginIframe = true;

  /**
   * Keycloak.init() option.
   */
  checkLoginIframeInterval = 5;

  /**
   * Keycloak.login() option.
   */
  idpHint = null;

  /**
   * @param parameters constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
   */
  installKeycloak(parameters) {

    console.debug('Keycloak session :: keycloak');

    let self = this;

    let keycloak = new Keycloak(parameters);

    keycloak.onReady = function(authenticated) {
      console.debug(`onReady ${authenticated}`);
      self.set('ready', true);
      self.set('authenticated', authenticated);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthSuccess = function() {
      console.debug('onAuthSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthError = function() {
      console.debug('onAuthError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshSuccess = function() {
      console.debug('onAuthRefreshSuccess');
      self.set('authenticated', true);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthRefreshError = function() {
      console.debug('onAuthRefreshError');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
      keycloak.clearToken();
    };

    keycloak.onTokenExpired = function() {
      console.debug('onTokenExpired');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    keycloak.onAuthLogout = function() {
      console.debug('onAuthLogout');
      self.set('authenticated', false);
      self.set('timestamp', new Date());
    };

    Application.keycloak = keycloak;

    console.debug('Keycloak session :: init :: completed');
  }

  initKeycloak() {

    console.debug('Keycloak session :: prepare');

    let keycloak = this.get('keycloak');
    let options = this.getProperties('onLoad', 'responseMode', 'checkLoginIframe', 'checkLoginIframeInterval', 'flow');

    return new Promise((resolve, reject) => {
      keycloak.init(options)
        .success(authenticated => {
          resolve(authenticated);
        })
        .error(reason => {
          reject(reason);
        });
    });
  }

  @computed('timestamp')
  get keycloak() {
    return Application.keycloak;
  }

  @computed('timestamp')
  get subject() {
    return Application.keycloak.subject;
  }

  @computed('timestamp')
  get refreshToken() {
    return Application.keycloak.refreshToken;
  }

  @computed('timestamp')
  get token() {
    return Application.keycloak.token;
  }

  @computed('timestamp')
  get tokenParsed() {
    return Application.keycloak.tokenParsed;
  }

  hasRealmRole(role) {
    return Application.keycloak.hasRealmRole(role);
  }

  hasResourceRole(role, resource) { //If resource is null then clientId is used
    return Application.keycloak.hasResourceRole(role, resource);
  }

  updateToken() {

    // console.debug(`Keycloak session :: updateToken`);

    let minValidity = this.get('minValidity');
    let keycloak = this.get('keycloak');

    return new Promise((resolve, reject) => {

      keycloak.updateToken(minValidity)
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

  checkTransition(transition) {

    let self = this;
    let router = this.router;
    let parser = this._parseRedirectUrl;

    // console.debug(`Keycloak session :: checkTransition :: _parseRedirectUrl='${this._parseRedirectUrl(router, transition)}'`);

    return this.updateToken().then(null, (reason) => {

      let redirectUri = parser(router, transition);

      console.debug(`Keycloak session :: checkTransition :: update token failed reason='${reason}'. Will login with redirect='${redirectUri}'`);

      return self.login(redirectUri);
    });
  }

  /**
   * Parses the redirect url from the intended 'to' route of a transition.
   *
   * @param router
   * @param transition
   * @returns URL to include as the Keycloak redirect
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

  loadUserProfile() {

    let self = this;

    this.get('keycloak').loadUserProfile().success(profile => {

      console.debug(`Loaded profile for ${profile.id}`);
      self.set('profile', profile);
    });
  }

  /**
   * @param url optional redirect url - if not present the
   */
  login(redirectUri) {

    let keycloak = this.get('keycloak');
    let options = { redirectUri };

    //Add idpHint to options, if it is populated
    if (this.get('idpHint')) {
      options['idpHint'] = this.get('idpHint');
    }

    console.debug(`Keycloak session :: login :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      keycloak.login(options).success(() => {
        console.debug('Keycloak session :: login :: success');
        resolve('login OK');
      }).error(() => {
        console.debug('login error - this should never be possible');
        reject(new Error('login failed'));
      });
    });
  }

  /**
   * @param url optional redirect url - if not present the
   */
  logout(redirectUri) {

    let keycloak = this.get('keycloak');
    let options = { redirectUri };

    console.debug(`Keycloak session :: logout :: ${JSON.stringify(options)}`);

    return new Promise((resolve, reject) => {

      keycloak.logout(options).success(() => {
        console.debug('Keycloak session :: logout :: success');
        keycloak.clearToken();
        resolve('logout OK');
      }).error(() => {
        console.debug('logout error - this should never be possible');
        keycloak.clearToken();
        reject(new Error('logout failed'));
      });
    });
  }
}
