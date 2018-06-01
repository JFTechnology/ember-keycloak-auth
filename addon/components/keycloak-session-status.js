import Component from '@ember/component';
import { debug } from '@ember/debug';
import { inject as service } from '@ember/service';
import layout from '../templates/components/keycloak-session-status';

export default Component.extend({

  layout,

  session: service('keycloak-session'),

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
