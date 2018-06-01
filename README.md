[![Build Status](https://travis-ci.org/JFTechnology/ember-keycloak-auth.svg)](https://travis-ci.org/JFTechnology/ember-keycloak-auth)
[![Ember Observer Score](http://emberobserver.com/badges/ember-keycloak-auth.svg)](http://emberobserver.com/addons/ember-keycloak-auth)
[![npm version](https://badge.fury.io/js/ember-keycloak-auth.svg)](https://badge.fury.io/js/ember-keycloak-auth)
[![Dependency Status](https://david-dm.org/JFTechnology/ember-keycloak-auth.svg)](https://david-dm.org/JFTechnology/ember-keycloak-auth)
[![devDependency Status](https://david-dm.org/JFTechnology/ember-keycloak-auth/dev-status.svg)](https://david-dm.org/JFTechnology/ember-keycloak-auth#info=devDependencies)
# ember-keycloak-auth 

This README outlines the details of collaborating on this Ember addon.

ember-keycloak-auth is an addon that can be installed with Ember CLI. It is intended for EmberJS applications accessing 
REST services secured by the Keycloak authentication server from Redhat/JBoss (http://keycloak.jboss.org). 

## Features overview

 * Presents the Keycloak JS adapter in a service that can be injected into an EmberJS app.
 * Provides a mixin that can be used with Ember Routes to check authentication on transition.
 * Provides a mixin that can be used with Ember data adapters to manage authentication headers whenever calls 
 are made to a Keycloak secured backend via the Ember data framework.
 * Small utility components for displaying user login state.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-keycloak-auth`
* `yarn install`

Run:

```
ember install ember-keycloak-auth
```

## Usage

### Initialising the service

Next the keycloak service needs to be initialised. One obvious place to do this would be in the application route...

```

// app/routes/application.js

  session: inject('keycloak-session'),

  beforeModel: function () {

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
      
      // finally init the service and return promise to pause router.
      return session.initKeycloak();
  
  }
```

### Protecting a route with the keycloak-authenticated-route mixin

You can protect your routes by adding the keycloak-authenticated-route mixin. This 
will check that the keycloak instance is authenticated and that you obtained a fresh access 
token.

```
import Route from '@ember/routing/route';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default Route.extend(KeycloakAuthenticatedRouteMixin, {

  model: function (params) {

    return ...
  }

});
```

### Accessing a protected resource with the keycloak-adapter mixin
 
 
Adding the keycloak-adapter mixin ensures that all ember-data calls to your 
back-end service will contain an HTTP Authentication header.

```
// app/adapters/application.js

import JSONAPIAdapter from 'ember-data/adapters/json-api';
import KeycloakAdapterMixin from 'ember-keycloak-auth/mixins/keycloak-adapter';

export default JSONAPIAdapter.extend(KeycloakAdapterMixin, {

});
```

 




## Running

There is a trivial demo app that allows testing of the service and route mixin. Enter the details of your Keycloak server 
and then navigate around a selection of access protected and unprotected routes.

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
For more information on Keycloak, visit [http://keycloak.jboss.com/](http://keycloak.jboss.com/).
