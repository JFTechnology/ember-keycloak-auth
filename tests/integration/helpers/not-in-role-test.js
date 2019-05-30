import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { login, setupKeycloakSession } from '@jftechnology/ember-keycloak-auth/test-support';

module('Integration | Helper | not-in-role', function(hooks) {

  setupRenderingTest(hooks);
  setupKeycloakSession(hooks);

  test('check realm role #1', async function(assert) {

    assert.expect(1);

    await login(this.owner);

    this.set('role', 'realm-role-1');

    await render(hbs`Not in role realm-role-1 : {{not-in-role role}}`);

    assert.equal(this.element.textContent.trim(), 'Not in role realm-role-1 : false');
  });


  test('check realm role #2', async function(assert) {

    assert.expect(1);

    await login(this.owner);

    this.set('role', 'not-a-realm-role');

    await render(hbs`Not in role realm-role-1 : {{not-in-role role}}`);

    assert.equal(this.element.textContent.trim(), 'Not in role realm-role-1 : true');
  });

  test('check resource role #1', async function(assert) {

    assert.expect(1);

    await login(this.owner);

    this.set('resource', 'resource-A');
    this.set('role', 'resource-A-role-1');

    await render(hbs`yes {{#if (not-in-role role resource)}}yes{{/if}} yes`);

    assert.equal(this.element.textContent.trim(), 'yes  yes');
  });

  test('check resource role #2', async function(assert) {

    assert.expect(1);

    await login(this.owner);

    this.set('resource', 'resource-A');
    this.set('role', 'resource-B-role-1');

    await render(hbs`no {{#if (not-in-role role resource)}}yes{{/if}} no`);

    assert.equal(this.element.textContent.trim(), 'no yes no');
  });

});
