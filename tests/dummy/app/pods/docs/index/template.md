## Configuring the service in an Ember application

The keycloak session service needs to be initialised. One place to do this might be in the application route (this could also be done via initializers)...

{{#docs-demo as |demo|}}
  {{demo.snippet name="pods/demo/route-snippet.js" label="Application route"}}
{{/docs-demo}}

## Protecting routes

As OAuth2 tokens need to be refreshed periodically it is useful to be able to trigger OAuth2 token 
update checks via the Keycloak Session Service before entering any route that might access a 
protected resource. 

An OAuth2 token update update check will either
 - return silently (if a fresh token has already been obtained)
 - refresh a stale token (if current token is close to expiry)
 - redirect the browser to the configured Keycloak service if user is required to authenticate

### Using route metadata API

The simplest (and recommended) way to trigger an OAuth2 token update check is using the 
<a href="https://github.com/emberjs/rfcs/blob/master/text/0398-RouteInfo-Metadata.md">[0398-RouteInfo-Metadata]</a>
API (introduced in Ember 3.8). 

The Keycloak Session Service uses the public Ember Routing API to inspect the route info metadata for any route entered
and if any the metadata of any segment of that route contains the `'updateKeycloakToken'` key with a value of true it will 
trigger a token update check.

Triggering token update checks via route metadata is as simple as this...

{{#docs-demo as |demo|}}
  {{demo.snippet name="pods/demo/protected-metadata/route.js" label="Metadata protected route"}}
{{/docs-demo}}

### Using route mixin

It is also possible to trigger a token update check using the KeycloakAuthenticatedRoute mixin.
  
Requiring an update check via route mixin...

{{#docs-demo as |demo|}}
  {{demo.snippet name="pods/demo/protected-mixin/route.js" label="Mixin protected route"}}
{{/docs-demo}}


## Accessing a protected resource with the keycloak-adapter mixin
 
Adding the keycloak-adapter mixin ensures that all ember-data calls to your back-end service will contain an HTTP 
Authentication header in the form `'Authorization': 'Bearer qwdwesdfsdf...'`.

{{#docs-demo as |demo|}}
  {{demo.snippet name="adapters/application-snippet.js" label="Mixin protected adapter"}}
{{/docs-demo}}
