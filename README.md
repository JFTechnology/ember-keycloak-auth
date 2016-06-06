# ember-keycloak-auth

ember-keycloak-auth is an addon that can be installed with Ember CLI. It is intended for EmberJS applications accessing 
REST services secured by the Keycloak authentication server from Redhat/JBoss (http://keycloak.jboss.org). It is intended to ...
 * present the Keycloak JS adapter in a service that can be injected into an EmberJS app, 
 * provide a simple mixin that can be used with Ember Routes to check authentication on transition. 
 * provide a mixin that can be used with Ember data adapters to manage authentication headers whenever calls are made to a Keycloak secured backend via the Ember data framework,
 * a few small utility components for display user login state
 
 ** This is version 0.1.x

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

There is a trivial demo app that allows testing of the service and route mixin. 

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
