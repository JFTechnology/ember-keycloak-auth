/**
 *
 */
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({

  session: service('keycloak-session'),

  cookies: service(),

  init() {

    this._super(...arguments);

    // if required constuctor parameters are available as cookies go ahead in init the service.
    // this would be replaced by initialization code when used in an application
    let cookies = this.get('cookies');
    let url = cookies.read('keycloak-url');
    let realm = cookies.read('keycloak-realm');
    let clientId = cookies.read('keycloak-clientId');

    if (url && realm && clientId) {

      let session = get(this, 'session');

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
