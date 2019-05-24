import Component from '@ember/component';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import template from '../templates/components/keycloak-session-link';

export default class KeycloakSessionLink extends Component {

  @service('keycloak-session')
  session;

  layout = template;

  @action
  login() {
    this.session.login();
  }

  @action
  logout() {
    this.session.logout();
  }
}
