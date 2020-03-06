import Controller from '@ember/controller';

import {inject as service} from '@ember/service';
import {action, computed} from '@ember/object';

export default class DemoController extends Controller {

  @service
  keycloakSession;

  @service
  cookies;

  @computed()
  get allCookies() {

    let cookieService = this.get('cookies');

    let cookies = cookieService.read();

    return Object.keys(cookies).reduce((acc, key) => {
      let value = cookies[key];
      acc.push({name: key, value});

      return acc;
    }, []);
  }

  init() {

    super.init(...arguments);

    let cookies = this.cookies;

    this.set('url', cookies.read('keycloak-url'));
    this.set('realm', cookies.read('keycloak-realm'));
    this.set('clientId', cookies.read('keycloak-clientId'));
  }

  @action
  initKeycloak() {

    let session = this.keycloakSession;
    let cookies = this.cookies;

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
  }
}
