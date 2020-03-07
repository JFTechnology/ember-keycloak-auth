## Configuring the service in an Ember application

The keycloak session service needs to be initialised. One place to do this might be in the application route (this could also be done via initializers)...

<DocsDemo as |demo|>
  {{demo.snippet name="pods/demo/route-snippet.js" label="Application route"}}
</DocsDemo>

## Ember data

Calls to an OAuth2 secured back end via Ember Data adapters typically require an Authorization bearer header...

        {
            Authorization: "Bearer 1234...etc"
        }
        
This header can be obtained from the 'headers' property on the Keycloak session service. However it is before each call 
to the secured back end is made we need ensure that the token is refreshed - and refresh it if stale (this is an asynchronous task).         

The simplest way to do this is to intercept the JSONAPIAdapter (or RESTAdapter) ajax method. All backend requests pass 
through this method which returns a Promise to the Ember data framework. The Keycloak session service provides a wrappedCall() 
method which adds a token refresh check to the Promise chain to ensure that a fresh token is avai.

The following snippet shows the few lines of code that need to be added to a JSONAPIAdapter to refresh the token (if required) 
and ensure that the header is up-to-date...

<DocsDemo as |demo|>
  <demo.snippet @name="adapters/json-api-adapter-snippet.js" @label="JSONAPIAdapter with refresh" />
</DocsDemo>

