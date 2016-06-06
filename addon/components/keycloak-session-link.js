import Ember from 'ember';
import layout from '../templates/keycloak-session-link';

export default Ember.Component.extend({

  layout,

  session: Ember.inject.service('keycloak-session'),

  actions: {
    login() {
      this.get('session').login();
    },
    logout() {
      this.get('session').logout();
    }
  }
});
