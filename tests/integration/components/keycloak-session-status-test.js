import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupKeycloakSession } from '@jftechnology/ember-keycloak-auth/test-support';

module('Integration | Component | keycloak session status', function(hooks) {

  setupRenderingTest(hooks);
  setupKeycloakSession(hooks);

  test('test rendered output', async function(assert) {

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
