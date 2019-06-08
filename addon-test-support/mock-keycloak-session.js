import KeycloakSessionService from '@jftechnology/ember-keycloak-auth/services/keycloak-session';
import MockKeycloakInstance from './mock-keycloak-instance';

export default class MockKeycloakSessionService extends KeycloakSessionService {

  installKeycloak(parameters) {

    console.debug('Mock Keycloak Session :: installKeycloak');

    let keycloak = new MockKeycloakInstance(parameters);

    this._installKeycloak(keycloak);
  }

  get isStub() {
    return true;
  }
}
