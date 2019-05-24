/*global Keycloak*/
/*eslint no-undef: "error"*/
import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { computed, get, set } from '@ember/object';

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

  init() {

    super.init(...arguments);

    this.router.on('routeWillChange', this, 'routeWillChange');
  }

  routeWillChange(transition) {

    let routeInfo = transition.to;

    if (routeInfo) {

      let info = routeInfo.find(info => get(info, 'metadata.updateKeycloakToken'));

      if (info) {

        console.debug(`Keycloak session :: routeWillChange :: ${routeInfo.name} / ${JSON.stringify(get(info, 'metadata'))}`);
        this.checkTransition(transition);
      }
    }
  }

  /**
   * @param parameters constructor parameters for Keycloak object - see Keycloak JS adapter docs for details
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

  onReady = (authenticated) => {
    console.debug(`Keycloak session :: onReady ${authenticated}`);
    this.set('ready', true);
    this.set('authenticated', authenticated);
    this.set('timestamp', new Date());
  };

  onAuthSuccess = () => {
    console.debug('Keycloak session :: onAuthSuccess');
    this.set('authenticated', true);
    this.set('timestamp', new Date());
  };

  onAuthError = () => {
    console.debug('onAuthError');
    this.set('authenticated', false);
    this.set('timestamp', new Date());
  };

  onAuthRefreshSuccess = () => {
    console.debug('onAuthRefreshSuccess');
    this.set('authenticated', true);
    this.set('timestamp', new Date());
  };

  onAuthRefreshError = () => {
    console.debug('onAuthRefreshError');
    this.set('authenticated', false);
    this.set('timestamp', new Date());
    this.clearToken();
  };

  onTokenExpired = () => {
    console.debug('onTokenExpired');
    this.set('authenticated', false);
    this.set('timestamp', new Date());
  };

  onAuthLogout = () => {
    console.debug('onAuthLogout');
    this.set('authenticated', false);
    this.set('timestamp', new Date());
  };

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

  @computed('timestamp')
  get keycloak() {
    return this._keycloak;
  }

  @computed('timestamp')
  get subject() {
    return this.keycloak.subject;
  }

  @computed('timestamp')
  get refreshToken() {
    return this.keycloak.refreshToken;
  }

  @computed('timestamp')
  get token() {
    return this.keycloak.token;
  }

  @computed('timestamp')
  get tokenParsed() {
    return this.keycloak.tokenParsed;
  }

  hasRealmRole(role) {
    return this.keycloak.hasRealmRole(role);
  }

  hasResourceRole(role, resource) {
    //If resource is null then clientId is used
    return this.keycloak.hasResourceRole(role, resource);
  }

  updateToken() {

    // console.debug(`Keycloak session :: updateToken`);

    let minValidity = this.get('minValidity');

    return new Promise((resolve, reject) => {

      this.keycloak.updateToken(minValidity)
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

  clearToken() {
    this.keycloak.clearToken();
  }

  checkTransition(transition) {

    if (this.ready) {

      let url = this._parseRedirectUrl(this.router, transition);

      console.debug(`Keycloak session :: checkTransition :: url='${url}'`);

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

    this.keycloak.loadUserProfile().success(profile => {

      console.debug(`Loaded profile for ${profile.id}`);
      set(this, 'profile', profile);
    });
  }

  /**
   * @param redirectUri optional redirect url - if not present the
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
   * @param redirectUri optional redirect url - if not present the
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
