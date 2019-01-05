import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Services | keycloak session', function(hooks) {

  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:keycloak-session');
    assert.ok(service);
  });

});
