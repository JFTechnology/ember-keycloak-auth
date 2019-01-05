/**
 *
 */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
const { keys } = Object;

export default Controller.extend({

  keycloakSession: service(),

  cookies: service(),

  allCookies: computed(function() {

    let cookieService = this.get('cookies');

    let cookies = cookieService.read();

    return keys(cookies).reduce((acc, key) => {
      let value = cookies[key];
      acc.push({ name: key, value });

      return acc;
    }, []);
  }),

  init() {

    this._super(...arguments);

    let cookies = this.get('cookies');

    this.set('url', cookies.read('keycloak-url'));
    this.set('realm', cookies.read('keycloak-realm'));
    this.set('clientId', cookies.read('keycloak-clientId'));
  },

  actions: {

    initKeycloak() {

      let session = this.get('keycloakSession');
      let cookies = this.get('cookies');

      let url = this.get('url');
      let realm = this.get('realm');
      let clientId = this.get('clientId');

      // save details as cookies for subsequent initializations
      cookies.write('keycloak-url', url);
      cookies.write('keycloak-realm', realm);
      cookies.write('keycloak-clientId', clientId);

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
