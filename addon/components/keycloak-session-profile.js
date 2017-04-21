import Ember from 'ember';
import layout from '../templates/components/keycloak-session-profile';

const { inject, Component } = Ember;

export default Component.extend({

  layout,

  session: inject.service('keycloak-session'),

  actions: {
    loadUserProfile() {
      this.get('session').loadUserProfile();
    },
  },
});
