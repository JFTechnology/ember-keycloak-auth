import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('keycloak-session-status', 'Integration | Component | keycloak session status', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{keycloak-session-status}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#keycloak-session-status}}
      template block text
    {{/keycloak-session-status}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
