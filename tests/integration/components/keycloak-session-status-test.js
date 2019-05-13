import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | keycloak session status', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{keycloak-session-status}}`);

    assert.dom(this.element).hasText('No session');

    // Template block usage:
    await render(hbs`
    {{#keycloak-session-status}}
      xyz
    {{/keycloak-session-status}}
  `);

    assert.dom(this.element).hasText('No session');

  });
});
