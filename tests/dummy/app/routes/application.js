/**
 *
 */
import Route from '@ember/routing/route';
import {   get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Cookies from 'ember-cli-js-cookie';

export default Route.extend({

  session: service('keycloak-session'),

  init() {

    this._super(...arguments);

    // if required constuctor parameters are available as cookies go ahead in init the service.
    // this would be replaced by initialization code when used in an application
    let url = Cookies.get('keycloak-url');
    let realm = Cookies.get('keycloak-realm');
    let clientId = Cookies.get('keycloak-clientId');

    if (url && realm && clientId) {

      let session = this.get('session');

      let options = {
        url,
        realm,
        clientId,
      };

      session.installKeycloak(options);
      session.initKeycloak().then(() => {

        const keycloakSession = get(this, 'session');
        const token = get(keycloakSession, 'keycloak').tokenParsed;

        console.log(token);

      });
    }
  },
});
