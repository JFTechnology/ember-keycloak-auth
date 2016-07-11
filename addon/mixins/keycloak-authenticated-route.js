import Ember from 'ember';

const { inject, Mixin } = Ember;

/**
 * Ember Mixin that can be combined with an ember route. It is intended to check that the keycloak session is fresh
 * before a route transition. If the keycloak session is not valid the keycloak session will redirect the browser
 * (by default to the keycloak log in page.
 */
export default Mixin.create({

  session: inject.service('keycloak-session'),

  beforeModel(transition){

    this._super(...arguments);

    var session = this.get('session');

    return session.checkTransition(transition);
  }
});
