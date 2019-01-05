import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {

  this.route('status');
  this.route('logged-out');
  this.route('logged-in');

  this.route('unprotected');
  this.route('protected');

  this.route('model-a', { path: '/model-a/:model_a_id' }, function() {
    this.route('model-b', { path: '/model-b/:model_b_id' });
  });

});

export default Router;
