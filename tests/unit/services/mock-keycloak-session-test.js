import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import MockKeycloakSession from '@jftechnology/ember-keycloak-auth/test-support/mock-keycloak-session';

module('Unit | Services | mock keycloak session', function(hooks) {

  setupTest(hooks);

  hooks.beforeEach(function() {

    this.owner.register('service:keycloak-session', MockKeycloakSession);

    let service = this.owner.lookup('service:keycloak-session');

    service.installKeycloak({
        url: 'https://localhost:1234',
        realm: 'my-realm',
        clientId: 'my-client-id'
      }
    );
  });

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
