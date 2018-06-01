import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from '../templates/components/keycloak-session-profile';

export default Component.extend({

  layout,

  token: null,

  session: service('keycloak-session'),

  roles: computed('token', function() {

    const token = get(this, 'session.tokenParsed');

    console.log(JSON.stringify(token, null, 2));

    const array = [];

    if (token) {
      const access = token['resource_access'];
      Object.keys(access).forEach(k => {
        const roles = access[k]['roles'];
        roles.forEach(r => array.push(`${k}/${r}`));
      })
    }

    return array;
  }),

  actions: {
    loadUserProfile() {
      this.get('session').loadUserProfile();
    },
  },
});
