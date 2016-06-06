import Ember from 'ember';

/**
 * Ember Mixin that can be combined with an ember route. It is intended to check that the keycloak session is fresh
 * before a route transition. If the keycloak session is not valid the keycloak session will redirect the browser
 * (by default to the keycloak log in page.
 */
export default Ember.Mixin.create({

  session: Ember.inject.service('keycloak-session'),

  beforeModel(transition){

    this._super(...arguments);

    var session = this.get('session');

    return session.checkTransition(transition);
  }
});
