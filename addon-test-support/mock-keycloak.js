import { get } from '@ember/object';

export default class MockKeycloak {

  parameters;

  options;

  tokenParsed = '1234';

  given_name = 'Name';

  token = '1234';

  constructor(parameters) {

    this.parameters = parameters;
  }

  init(options) {
    console.log(`MockKeycloak :: init :: ${options}`);
    this.options = options;
    this.onReady(false);
    return new MockKeycloakPromise(true, null);
  }

  updateToken(minValidity) {
    console.log(`MockKeycloak :: updateToken :: ${minValidity}`);
    return new MockKeycloakPromise(true, false);
  }

  login(options) {
    console.log(`MockKeycloak :: login :: ${options}`);
    this.onAuthSuccess();
    return new MockKeycloakPromise(true, false);
  }

  logout(options) {
    console.log(`MockKeycloak :: logout :: ${options}`);
    this.onAuthLogout();
    return new MockKeycloakPromise(true, false);
  }

  clearToken() {
    console.log(`MockKeycloak :: clearToken`);
  }

  hasRealmRole(role) {
    return get(this, `parameters.realmRoles.${role}`);
  }

  hasResourceRole(role, resource) {
    return get(this, `parameters.resourceRoles.${resource}.${role}`);
  }
}

class MockKeycloakPromise {

  successValue;

  errorValue;

  constructor(successValue, errorValue) {
    this.successValue = successValue;
    this.errorValue = errorValue;
  }

  success(callback) {
    if (this.success) {
      callback(this.success)
    }

    return this;
  }

  error(callback) {
    if (this.error) {
      callback(this.error)
    }

    return this;
  }
}
