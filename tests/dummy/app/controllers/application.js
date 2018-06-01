/**
 *
 */
import Controller from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  session: inject('keycloak-session'),

  url: $.cookie('keycloak-url'),

  realm: $.cookie('keycloak-realm'),

  clientId: $.cookie('keycloak-clientId'),

  actions: {

    initKeycloak() {

      let session = this.get('session');

      let url = this.get('url');
      let realm = this.get('realm');
      let clientId = this.get('clientId');

      // save details as cookies for subsequent initializations
      $.cookie('keycloak-url', url);
      $.cookie('keycloak-realm', realm);
      $.cookie('keycloak-clientId', clientId);

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
