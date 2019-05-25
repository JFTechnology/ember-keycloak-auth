import Object from '@ember/object';
import KeycloakAdapterMixin from '@jftechnology/ember-keycloak-auth/mixins/keycloak-adapter';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixins | keycloak adapter', function(hooks) {

  setupTest(hooks);

  // Replace this with your real tests.
  test('it works', assert => {
    let MixinObject = Object.extend(KeycloakAdapterMixin);
    let subject = MixinObject.create();
    assert.ok(subject);
  });

});
