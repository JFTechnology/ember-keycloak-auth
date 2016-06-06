import Ember from 'ember';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak/mixins/keycloak-authenticated-route';
import { module, test } from 'qunit';

module('Unit | Mixin | keycloak authenticated route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeycloakAuthenticatedRouteMixinObject = Ember.Object.extend(KeycloakAuthenticatedRouteMixin);
  let subject = KeycloakAuthenticatedRouteMixinObject.create();
  assert.ok(subject);
});
