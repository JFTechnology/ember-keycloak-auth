import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | keycloak session link', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    assert.expect(2);

    await render(hbs`{{keycloak-session-link}}`);

    assert.dom(this.element).hasText('No session');

    // Template block usage:
    await render(hbs`
    {{#keycloak-session-link}}
      xyz
    {{/keycloak-session-link}}
  `);

    assert.dom(this.element).hasText('No session');
  });

});


