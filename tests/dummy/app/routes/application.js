/**
 *
 */
import Ember from 'ember';

export default Ember.Route.extend({

  session: Ember.inject.service('keycloak-session'),

  init: function () {

    this._super(...arguments);

    // if required constuctor parameters are available as cookies go ahead in init the service.
    // this would be replaced by initialization code when used in an application
    let url = Ember.$.cookie('keycloak-url');
    let realm = Ember.$.cookie('keycloak-realm');
    let clientId = Ember.$.cookie('keycloak-clientId');

    if (url && realm && clientId) {

      var session = this.get('session');

      var options = {
        url,
        realm,
        clientId
      };

      session.installKeycloak(options);
      session.initKeycloak();
    }
  }

});
