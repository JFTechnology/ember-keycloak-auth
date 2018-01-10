import Object from '@ember/object';
import KeycloakAdapterMixin from 'ember-keycloak-auth/mixins/keycloak-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | keycloak adapter mixin');

// Replace this with your real tests.
test('it works', assert => {
  let KeycloakAdapterMixinObject = Object.extend(KeycloakAdapterMixin);
  let subject = KeycloakAdapterMixinObject.create();
  assert.ok(subject);
});
