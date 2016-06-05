import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({

  layout,

  session: Ember.inject.service('keycloak-session'),

  actions: {
    refresh() {
      this.get('session').updateToken().then(function (result) {
        console.log(result);
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
