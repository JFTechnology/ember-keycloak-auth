import MockKeycloakSession from './mock-keycloak-session';
import { assert } from '@ember/debug';

export const OPENID_RESPONSE = {
  "access_token": "the-access-token-the-real-thing-is-much-much-longer",
  "expires_in": 120,
  "refresh_expires_in": 7200,
  "refresh_token": "the-refresh-token",
  "token_type": "bearer",
  "id_token": "the-id-token",
  "not-before-policy": 1418191510,
  "session_state": "8f229c34-cef0-409b-8707-9797ae721efb",
  "scope": "openid"
};

export const PROFILE = {
  "username": "stephen.flynn@jftechnology.com",
  "firstName": "Stephen",
  "lastName": "Flynn",
  "email": "stephen.flynn@jftechnology.com",
  "emailVerified": true,
  "attributes": {}
};

export const PARSED_TOKEN = {
  "iss": "https://localhost:4200/auth/realms/my-realm",
  "aud": "my-client-id",
  "sub": "3c3fa2d3-5691-4581-a122-950327a6c424",
  "typ": "Bearer",
  "azp": "my-client-id",
  "nonce": "d2e3f77b-1912-42be-bab1-f9bb13638dbd",
  "auth_time": 1559159364,
  "session_state": "8f229c34-cef0-409b-8707-9797ae721efb",
  "acr": "0",
  "allowed-origins": ["https://localhost:4200"],
  "realm_access": {
    "roles": ["realm-role-1", "realm-role-1"]
  },
  "resource_access": {
    "resource-A": {
      "roles": ["resource-A-role-1", "resource-A-role-2"],
    },
    "resource-B": {
      "roles": ["resource-B-role-1", "resource-B-role-2"],
    }
  },
  "scope": "openid",
  "name": "Stephen Flynn",
  "preferred_username": "stephen.flynn@jftechnology.com",
  "given_name": "Stephen",
  "family_name": "Flynn",
  "email": "stephen.flynn@jftechnology.com"
};

class AuthStore {
  response = OPENID_RESPONSE;
  parsedToken = PARSED_TOKEN;
  profile = PROFILE;
}

export const AUTH_STORE = new AuthStore();

export function setupKeycloakSession(hooks) {

  hooks.beforeEach(function() {

    this.owner.register('service:keycloak-session', MockKeycloakSession);

    let session = this.owner.lookup('service:keycloak-session');

    session.installKeycloak({
        url: 'https://localhost',
        realm: 'my-realm',
        clientId: 'my-client-id'
      }
    );

    assert('Keycloak-session registration failed ! Called the hook too late ?', session.isStub);
    assert('Keycloak-session install failed ! Called the hook too late ?', session.keycloak);
  });
}


export function login(owner) {

  let session = owner.lookup('service:keycloak-session');

  session.initKeycloak();

  assert('Keycloak-session init failed !', session.ready, true);

  return session.login();
}
