import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import MockKeycloakSession from '@jftechnology/ember-keycloak-auth/test-support/mock-keycloak-session';

module('Integration | Helper | hasRole', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {

    this.owner.register('service:keycloak-session', MockKeycloakSession);

    let service = this.owner.lookup('service:keycloak-session');

    service.installKeycloak({
        url: 'https://localhost',
        realm: 'my-realm',
        clientId: 'my-client-id',
        realmRoles: {
          'my-realm-role': true,
        },
        resourceRoles: {
          'my-resource': {
            'my-resource-role': true,
          },
        },
      }
    );
  });

  test('check realm role #1', async function(assert) {

    assert.expect(1);

    this.set('goodRole', 'my-realm-role');
    this.set('badRole', 'not-a-realm-role');

    await render(hbs`yes {{#if (has-role goodRole)}}yes{{/if}} yes`);

    assert.equal(this.element.textContent.trim(), 'yes yes yes');
  });


  test('check realm role #2', async function(assert) {

    assert.expect(1);

    this.set('goodRole', 'my-realm-role');
    this.set('badRole', 'not-a-realm-role');

    await render(hbs`no {{#if (has-role badRole)}}yes{{/if}} no`);

    assert.equal(this.element.textContent.trim(), 'no  no');
  });

  test('check resource role #1', async function(assert) {

    assert.expect(1);

    this.set('goodResource', 'my-resource');
    this.set('goodRole', 'my-resource-role');
    this.set('badRole', 'not-a-realm-role');

    await render(hbs`yes {{#if (has-role goodRole goodResource)}}yes{{/if}} yes`);

    assert.equal(this.element.textContent.trim(), 'yes yes yes');
  });

  test('check resource role #2', async function(assert) {

    assert.expect(1);

    this.set('goodResource', 'my-resource');
    this.set('goodRole', 'my-resource-role');
    this.set('badRole', 'not-a-realm-role');

    await render(hbs`no {{#if (has-role badRole goodResource)}}yes{{/if}} no`);

    assert.equal(this.element.textContent.trim(), 'no  no');
  });

});
