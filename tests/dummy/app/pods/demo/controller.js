import Controller from '@ember/controller';

import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';
import {action, computed} from '@ember/object';

export default class DemoController extends Controller {

  @service
  keycloakSession;

  @service
  cookies;

  @tracked
  url;

  @tracked
  realm;

  @tracked
  clientId;

  @computed()
  get allCookies() {

    let currentCookies = this.cookies.read();

    return Object.keys(currentCookies).reduce((acc, key) => {
      let value = currentCookies[key];
      acc.push({name: key, value});

      return acc;
    }, []);
  }

  constructor() {
    super(...arguments);

    let cookies = this.cookies;

    this.url = cookies.read('keycloak-url');
    this.realm = cookies.read('keycloak-realm');
    this.clientId = cookies.read('keycloak-clientId');
  }

  @action
  initKeycloak() {

    let session = this.keycloakSession;
    let cookies = this.cookies;

    // save details as cookies for subsequent initializations
    cookies.write('keycloak-url', this.url);
    cookies.write('keycloak-realm', this.realm);
    cookies.write('keycloak-clientId', this.clientId);

    if (this.url && this.realm && this.clientId) {

      let options = {
        url: this.url,
        realm: this.realm,
        clientId: this.clientId,
      };

      session.installKeycloak(options);
      session.initKeycloak();

    } else {

      alert('Config details incomplete');
    }
  }
}
