import Component from '@ember/component';

import { debug } from '@ember/debug';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-status';

export default class KeycloakSessionStatus extends Component {

  @service('keycloak-session')
  session;

  layout = template;

  @action
  refresh() {
    this.get('session').updateToken().then(result => {
      debug(result);
    });
  }

  @action
  login() {
    this.get('session').login();
  }

  @action
  logout() {
    this.get('session').logout();
  }
}
