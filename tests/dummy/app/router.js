import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {

  docsRoute(this, function() {
    this.route('index');
    this.route('helpers');
    this.route('test-support');
    this.route('usage');
  });

  this.route('demo', function() {

    this.route('status');
    this.route('logged-out');
    this.route('logged-in');

    this.route('unprotected');
    this.route('protected-mixin');
    this.route('protected-metadata');

    this.route('model-a', { path: '/model-a/:model_a_id' }, function() {
      this.route('model-b', { path: '/model-b/:model_b_id' });
    });
  });

  this.route('not-found', { path: '/*path' });

});
