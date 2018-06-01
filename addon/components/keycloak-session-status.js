import Component from '@ember/component';
import { inject } from '@ember/service';
import { debug } from '@ember/debug';
import layout from '../templates/components/keycloak-session-status';

export default Component.extend({

  layout,

  session: inject('keycloak-session'),

  actions: {
    refresh() {
      this.get('session').updateToken().then(result => {
        debug(result);
      });
    },
    login() {
      this.get('session').login();
    },
    logout() {
      this.get('session').logout();
    },
  },
});
