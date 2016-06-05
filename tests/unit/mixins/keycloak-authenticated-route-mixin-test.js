import Ember from 'ember';
import KeycloakAuthenticatedRouteMixinMixin from 'ember-cli-jft-keycloak/mixins/keycloak-authenticated-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | keycloak authenticated route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeycloakAuthenticatedRouteMixinObject = Ember.Object.extend(KeycloakAuthenticatedRouteMixinMixin);
  let subject = KeycloakAuthenticatedRouteMixinObject.create();
  assert.ok(subject);
});
