import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupKeycloakSession } from '@jftechnology/ember-keycloak-auth/test-support';

module('Unit | Services | keycloak session', function(hooks) {

  setupTest(hooks);
  setupKeycloakSession(hooks);

  test('check login/logout cycle', function(assert) {

    assert.expect(9);

    let session = this.owner.lookup('service:keycloak-session');

    assert.ok(session);

    assert.equal(session.ready, false);
    assert.equal(session.authenticated, false);

    session.initKeycloak();

    assert.equal(session.ready, true);
    assert.equal(session.authenticated, false);

    session.login();

    assert.equal(session.ready, true);
    assert.equal(session.authenticated, true);

    session.logout();

    assert.equal(session.ready, true);
    assert.equal(session.authenticated, false);

  });

});
