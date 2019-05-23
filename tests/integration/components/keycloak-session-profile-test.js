import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | keycloak session profile', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    assert.expect(2);

    await render(hbs`{{keycloak-session-profile}}`);

    assert.dom(this.element).hasText('No session');

    // Template block usage:
    await render(hbs`
    {{#keycloak-session-profile}}
      template block text
    {{/keycloak-session-profile}}
  `);

    assert.dom(this.element).hasText('No session');
  });

});
