// Types for compiled templates
declare module '@jftechnology/ember-keycloak-auth/templates/*' {
  import {TemplateFactory} from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '@jftechnology/ember-keycloak-auth' {
  import {KeycloakTokenParsed} from "keycloak-js";
  import RSVP from "rsvp";

  export interface KeycloakAdapterService {

    /**
     * The current Keycloak tokenParsed.
     *
     * @property tokenParsed
     * @type {string}
     */
    tokenParsed: KeycloakTokenParsed | undefined

    login(redirectUri?: string): RSVP.Promise<any>

    logout(redirectUri?: string): RSVP.Promise<any>

    loadUserProfile(): RSVP.Promise<any>

    updateToken(): RSVP.Promise<boolean>

    inRole(role: string, resource?: string): boolean

  }
}
