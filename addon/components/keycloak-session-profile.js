import Component from '@ember/component';
import { inject } from '@ember/service';
import layout from '../templates/components/keycloak-session-profile';

export default Component.extend({

  layout,

  session: inject('keycloak-session'),

  actions: {
    loadUserProfile() {
      this.get('session').loadUserProfile();
    },
  },
});
