import Object from '@ember/object';
import KeycloakAuthenticatedRouteMixin from '@jftechnology/ember-keycloak-auth/mixins/keycloak-authenticated-route';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixins | keycloak authenticated route', function(hooks) {

  setupTest(hooks);

  // Replace this with your real tests.
  test('it works', assert => {
    let MixinObject = Object.extend(KeycloakAuthenticatedRouteMixin);
    let subject = MixinObject.create();
    assert.ok(subject);
  });

});
