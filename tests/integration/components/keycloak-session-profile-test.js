import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('keycloak-session-profile', 'Integration | Component | keycloak session profile', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{keycloak-session-profile}}`);

  assert.equal(this.$().text().trim(), 'No session');

  // Template block usage:
  this.render(hbs`
    {{#keycloak-session-profile}}
      template block text
    {{/keycloak-session-profile}}
  `);

  assert.equal(this.$().text().trim(), 'No session');
});
