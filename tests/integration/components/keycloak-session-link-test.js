import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import {setupKeycloakSession} from '@jftechnology/ember-keycloak-auth/test-support';

module('Integration | Component | keycloak session link', function(hooks) {

  setupRenderingTest(hooks);
  setupKeycloakSession(hooks);

  test('test rendered output', async function(assert) {

    assert.expect(3);

    let service = this.owner.lookup('service:keycloak-session');

    await render(hbs`{{keycloak-session-link}}`);

    assert.dom(this.element).hasText('No session');

    await service.initKeycloak();
    await render(hbs`{{keycloak-session-link}}`);

    assert.dom(this.element).hasText('Sign in');

    await service.login();
    await render(hbs`{{keycloak-session-link}}`);

    assert.dom(this.element).hasText('Sign out');

  });

  test('it renders block', async function(assert) {

    let service = this.owner.lookup('service:keycloak-session');

    assert.expect(3);

    // Template block usage:
    await render(hbs`{{#keycloak-session-link}}xyz{{/keycloak-session-link}}`);

    assert.dom(this.element).hasText('No session');

    await service.initKeycloak();
    await render(hbs`{{#keycloak-session-link}}xyz{{/keycloak-session-link}}`);

    assert.dom(this.element).hasText('Sign in');

    await service.login();
    await render(hbs`{{#keycloak-session-link}}xyz{{/keycloak-session-link}}`);

    assert.dom(this.element).hasText('Sign out');

  });

});


