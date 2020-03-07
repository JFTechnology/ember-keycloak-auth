import Component from '@glimmer/component';

import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';
import {action, computed} from '@ember/object';

export default class DemoConfiguration extends Component {

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

  @computed('cookies')
  get allCookies() {

    let cookies = this.cookies.read();

    return Object.keys(cookies).reduce((acc, key) => {
      let value = cookies[key];
      acc.push({name: key, value});

      return acc;
    }, []);
  }

  @action
  didInsert() {

    this.url = this.cookies.read('keycloak-url');
    this.realm = this.cookies.read('keycloak-realm');
    this.clientId = this.cookies.read('keycloak-clientId');
  }

  @action
  initKeycloak() {

    let url = this.url;
    let realm = this.realm;
    let clientId = this.clientId;

    if (url && realm && clientId) {

      // save details as cookies for subsequent initializations
      this.cookies.write('keycloak-url', url);
      this.cookies.write('keycloak-realm', realm);
      this.cookies.write('keycloak-clientId', clientId);

      this.keycloakSession.installKeycloak({url, realm, clientId});
      this.keycloakSession.initKeycloak();

    } else {

      alert('Config details incomplete');
    }
  }
}
