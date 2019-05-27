import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import MockKeycloakSession from '@jftechnology/ember-keycloak-auth/test-support/mock-keycloak-session';

module('Integration | Component | keycloak session profile', function(hooks) {

  setupRenderingTest(hooks);

  hooks.beforeEach(function() {

    this.owner.register('service:keycloak-session', MockKeycloakSession);

    let service = this.owner.lookup('service:keycloak-session');

    service.installKeycloak({
        url: 'https://localhost',
        realm: 'my-realm',
        clientId: 'my-client-id'
      }
    );
  });

  test('it renders', async function(assert) {

    let service = this.owner.lookup('service:keycloak-session');

    assert.expect(3);

    await render(hbs`{{keycloak-session-profile}}`);

    assert.dom(this.element).hasText('No session');

    await service.initKeycloak();
    await render(hbs`{{keycloak-session-profile}}`);

    assert.dom(this.element.querySelector('.btn:nth-child(1)')).hasText('Load user profile');

    await service.login();
    await render(hbs`{{keycloak-session-profile}}`);

    assert.dom(this.element.querySelector('.btn:nth-child(1)')).hasText('Load user profile');

  });

});
