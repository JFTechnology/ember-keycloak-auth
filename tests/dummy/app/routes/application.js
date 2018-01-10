/**
 *
 */
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Route.extend({

  session: inject('keycloak-session'),

  init() {

    this._super(...arguments);

    // if required constuctor parameters are available as cookies go ahead in init the service.
    // this would be replaced by initialization code when used in an application
    let url = $.cookie('keycloak-url');
    let realm = $.cookie('keycloak-realm');
    let clientId = $.cookie('keycloak-clientId');

    if (url && realm && clientId) {

      let session = this.get('session');

      let options = {
        url,
        realm,
        clientId,
      };

      session.installKeycloak(options);
      session.initKeycloak();
    }
  },

});
