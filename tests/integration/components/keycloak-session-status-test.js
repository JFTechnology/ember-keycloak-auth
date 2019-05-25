import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import MockKeycloakSession from '@jftechnology/ember-keycloak-auth/test-support/mock-keycloak-session';

module('Integration | Component | keycloak session status', function(hooks) {

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

    await render(hbs`{{keycloak-session-status}}`);

    assert.dom(this.element).hasText('No session');

    await service.initKeycloak();
    await render(hbs`{{keycloak-session-status}}`);

    assert.dom(this.element.querySelector('.btn:nth-child(1)')).hasText('Refresh');
    assert.dom(this.element.querySelector('.btn:nth-child(2)')).hasText('Login');
    assert.dom(this.element.querySelector('.btn:nth-child(3)')).hasText('Logout');

    await service.login();
    await render(hbs`{{keycloak-session-status}}`);

    assert.dom(this.element.querySelector('.btn:nth-child(1)')).hasText('Refresh');
    assert.dom(this.element.querySelector('.btn:nth-child(2)')).hasText('Login');
    assert.dom(this.element.querySelector('.btn:nth-child(3)')).hasText('Logout');

  });
});
