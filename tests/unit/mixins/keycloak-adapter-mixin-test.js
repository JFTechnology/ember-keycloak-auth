import Ember from 'ember';
import KeycloakAdapterMixinMixin from 'ember-cli-jft-keycloak/mixins/keycloak-adapter-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | keycloak adapter mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeycloakAdapterMixinObject = Ember.Object.extend(KeycloakAdapterMixinMixin);
  let subject = KeycloakAdapterMixinObject.create();
  assert.ok(subject);
});
