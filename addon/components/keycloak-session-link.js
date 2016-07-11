import Ember from 'ember';
import layout from '../templates/keycloak-session-link';

const { inject, Component } = Ember;

export default Component.extend({

  layout,

  session: inject.service('keycloak-session'),

  actions: {
    login() {
      this.get('session').login();
    },
    logout() {
      this.get('session').logout();
    }
  }
});
