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

ember-keycloak-auth works in Ember **1.13.9+** or **2.0+**, including beta and canary.

Run:

```
ember install ember-keycloak-auth
```

## Usage

### Load the keycloak.js adapter

First make sure that the keycloak.js is present. Simplest way to do this is to 
grab it from your keycloak server by adding something like this to your app's index.html ... 

app/index.html
```
    <script src="https://auth.my-server.com/auth/js/keycloak.js"></script>
```

### Initialising the service

Next the keycloak service needs to be initialised. One obvious place to do this would be in the application route...

app/routes/application.js
```

  session: Ember.inject.service('keycloak-session'),

  init: function () {

    this._super(...arguments);

      var session = this.get('session');

      // Keycloak constructor arguments as described in the keycloak documentation.
      var options = {
        'url': 'https://auth.my-server.com/auth',
        'realm': 'my-realm',
        'clientId': 'my-client-id'
      };

      // this will result in a newly constructed keycloak object
      session.installKeycloak(options);
      
      // set any keycloak init parameters where defaults need to be overidden
      session.set('responseMode', 'fragment');
      
      // finally init the service
      session.initKeycloak();
  
  }
```

### Protecting a route with the keycloak-authenticated-route mixin

You can protect your routes by adding the keycloak-authenticated-route mixin. This 
will check that the keycloak instance is authenticated and that you obtained a fresh access 
token.

```
import Ember from 'ember';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default Ember.Route.extend(KeycloakAuthenticatedRouteMixin, {

  model: function (params) {

    return ...
  }

});
```

### Accessing a protected resource with the keycloak-adapter mixin
 
 
Adding the keycloak-adapter mixin ensures that all ember-data calls to your 
back-end service will contain an HTTP Authentication header.

app/adapters/application.js
```
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import KeycloakAdapterMixin from 'ember-keycloak-auth/mixins/keycloak-adapter';

export default JSONAPIAdapter.extend(KeycloakAdapterMixin, {

});
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
