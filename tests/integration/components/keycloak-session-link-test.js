import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('keycloak-session-link', 'Integration | Component | keycloak session link', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{keycloak-session-link}}`);

  assert.equal(this.$().text().trim(), 'No session');

  // Template block usage:
  this.render(hbs`
    {{#keycloak-session-link}}
      xyz
    {{/keycloak-session-link}}
  `);

  assert.equal(this.$().text().trim(), 'No session');
});
