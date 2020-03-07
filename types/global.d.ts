// Types for compiled templates
declare module '@jftechnology/ember-keycloak-auth/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
