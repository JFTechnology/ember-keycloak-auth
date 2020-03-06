import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import {setupKeycloakSession} from '@jftechnology/ember-keycloak-auth/test-support';

module('Integration | Component | keycloak-session-config', function(hooks) {

  setupRenderingTest(hooks);
  setupKeycloakSession(hooks);

  test('test rendered output', async function(assert) {

    assert.expect(14);

    await render(hbs`{{keycloak-session-config}}`);

    assert.dom(this.element.querySelector('table tbody tr:nth-child(1) th')).hasText('minValidity');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(1) td')).hasText('30');

    assert.dom(this.element.querySelector('table tbody tr:nth-child(2) th')).hasText('onLoad');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(2) td')).hasText('login-required');

    assert.dom(this.element.querySelector('table tbody tr:nth-child(3) th')).hasText('responseMode');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(3) td')).hasText('fragment');

    assert.dom(this.element.querySelector('table tbody tr:nth-child(4) th')).hasText('flow');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(4) td')).hasText('standard');

    assert.dom(this.element.querySelector('table tbody tr:nth-child(5) th')).hasText('checkLoginIframe');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(5) td')).hasText('false');

    assert.dom(this.element.querySelector('table tbody tr:nth-child(6) th')).hasText('checkLoginIframeInterval');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(6) td')).hasText('5');

    assert.dom(this.element.querySelector('table tbody tr:nth-child(7) th')).hasText('idpHint');
    assert.dom(this.element.querySelector('table tbody tr:nth-child(7) td')).hasText('');

  });

});


