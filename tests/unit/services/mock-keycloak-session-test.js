import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { setupKeycloakSession } from '@jftechnology/ember-keycloak-auth/test-support';

module('Unit | Services | mock keycloak session', function(hooks) {

  setupTest(hooks);
  setupKeycloakSession(hooks);

  test('service ok', async function(assert) {

    let service = this.owner.lookup('service:keycloak-session');

    assert.ok(service);

    assert.equal(false, service.ready);
    assert.equal(false, service.authenticated);

    await service.initKeycloak();
    assert.equal(true, service.ready);
    assert.equal(false, service.authenticated);

    await service.login();
    assert.equal(true, service.ready);
    assert.equal(true, service.authenticated);

    await service.logout();
    assert.equal(true, service.ready);
    assert.equal(false, service.authenticated);

  });

});
