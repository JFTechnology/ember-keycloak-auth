import Component from '@ember/component';
import { inject } from '@ember/service';
import layout from '../templates/components/keycloak-session-link';

export default Component.extend({

  layout,

  session: inject('keycloak-session'),

  actions: {
    login() {
      this.get('session').login();
    },
    logout() {
      this.get('session').logout();
    },
  },
});
