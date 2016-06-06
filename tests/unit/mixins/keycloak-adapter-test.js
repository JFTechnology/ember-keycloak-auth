import Ember from 'ember';
import KeycloakAdapterMixin from 'ember-keycloak/mixins/keycloak-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | keycloak adapter mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeycloakAdapterMixinObject = Ember.Object.extend(KeycloakAdapterMixin);
  let subject = KeycloakAdapterMixinObject.create();
  assert.ok(subject);
});
