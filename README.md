[![Build Status](https://travis-ci.org/JFTechnology/ember-keycloak-auth.svg)](https://travis-ci.org/JFTechnology/ember-keycloak-auth)
[![Ember Observer Score](http://emberobserver.com/badges/ember-keycloak-auth.svg)](http://emberobserver.com/addons/ember-keycloak-auth)
[![npm version](https://badge.fury.io/js/ember-keycloak-auth.svg)](https://badge.fury.io/js/ember-keycloak-uath)

# ember-keycloak-auth 

ember-keycloak-auth is an addon that can be installed with Ember CLI. It is intended for EmberJS applications accessing 
REST services secured by the Keycloak authentication server from Redhat/JBoss (http://keycloak.jboss.org). 

## Features overview

 * presents the Keycloak JS adapter in a service that can be injected into an EmberJS app
 * provide a simple mixin that can be used with Ember Routes to check authentication on transition
 * provide a mixin that can be used with Ember data adapters to manage authentication headers whenever calls 
 are made to a Keycloak secured backend via the Ember data framework
 * a few small utility components for display user login state

## Installation

Ember Power Select works in Ember **1.13.9+** or **2.0+**, including beta and canary.

Run:

```
ember install ember-keycloak-auth
```

## Running

There is a trivial demo app that allows testing of the service and route mixin. Enter the details of your Keycloak server 
and then navigate around a selection of access protected and unprotected routes.

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
For more information on Keycloak, visit [http://keycloak.jboss.com/](http://keycloak.jboss.com/).
