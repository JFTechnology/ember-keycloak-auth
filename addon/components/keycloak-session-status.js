import Ember from 'ember';
import layout from '../templates/keycloak-session-status';

const { inject, Component, Logger } = Ember;

export default Component.extend({

  layout,

  session: inject.service('keycloak-session'),

  actions: {
    refresh() {
      this.get('session').updateToken().then(function (result) {
        Logger.debug(result);
      });
    },
    login() {
      this.get('session').login();
    },
    logout() {
      this.get('session').logout();
    }
  }
});
