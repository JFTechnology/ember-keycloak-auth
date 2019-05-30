import KeycloakSessionService from '@jftechnology/ember-keycloak-auth/services/keycloak-session';
import MockKeycloakInstance from './mock-keycloak-instance';

export default class MockKeycloakSessionService extends KeycloakSessionService {

  installKeycloak(parameters) {

    console.debug('Mock Keycloak Session :: installKeycloak');

    let keycloak = new MockKeycloakInstance(parameters);

    keycloak.onReady = this.onReady;
    keycloak.onAuthSuccess = this.onAuthSuccess;
    keycloak.onAuthError = this.onAuthError;
    keycloak.onAuthRefreshSuccess = this.onAuthRefreshSuccess;
    keycloak.onAuthRefreshError = this.onAuthRefreshError;
    keycloak.onTokenExpired = this.onTokenExpired;
    keycloak.onAuthLogout = this.onAuthLogout;

    this._keycloak = keycloak;

    console.debug('Mock Keycloak Session :: installKeycloak :: completed');
  }

  get isStub() {
    return true;
  }
}
