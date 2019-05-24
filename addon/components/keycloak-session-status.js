import Component from '@ember/component';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-status';

export default class KeycloakSessionStatus extends Component {

  @service('keycloak-session')
  session;

  layout = template;

  @action
  refresh() {
    this.session.updateToken().then(result => {
      console.debug(result);
    });
  }

  @action
  login() {
    this.session.login();
  }

  @action
  logout() {
    this.session.logout();
  }
}
