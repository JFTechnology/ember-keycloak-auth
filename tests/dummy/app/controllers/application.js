/**
 *
 */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Cookies from 'ember-cli-js-cookie';

export default Controller.extend({

  session: service('keycloak-session'),

  url: Cookies.get('keycloak-url'),

  realm: Cookies.get('keycloak-realm'),

  clientId: Cookies.get('keycloak-clientId'),

  actions: {

    initKeycloak() {

      let session = this.get('session');

      let url = this.get('url');
      let realm = this.get('realm');
      let clientId = this.get('clientId');

      // save details as cookies for subsequent initializations
      Cookies.set('keycloak-url', url);
      Cookies.set('keycloak-realm', realm);
      Cookies.set('keycloak-clientId', clientId);

      if (url && realm && clientId) {

        let options = {
          url,
          realm,
          clientId,
        };

        session.installKeycloak(options);
        session.initKeycloak();

      } else {

        alert('Config details incomplete');
      }
    },
  },
});
