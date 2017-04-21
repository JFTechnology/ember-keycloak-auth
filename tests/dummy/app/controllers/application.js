/**
 *
 */
import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('keycloak-session'),

  url: Ember.$.cookie('keycloak-url'),

  realm: Ember.$.cookie('keycloak-realm'),

  clientId: Ember.$.cookie('keycloak-clientId'),

  actions: {

    initKeycloak() {

      let session = this.get('session');

      let url = this.get('url');
      let realm = this.get('realm');
      let clientId = this.get('clientId');

      // save details as cookies for subsequent initializations
      Ember.$.cookie('keycloak-url', url);
      Ember.$.cookie('keycloak-realm', realm);
      Ember.$.cookie('keycloak-clientId', clientId);

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
