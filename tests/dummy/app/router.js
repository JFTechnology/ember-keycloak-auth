import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('status');
  this.route('logged-out');
  this.route('logged-in');

  this.route('unprotected');
  this.route('protected');
  this.route('protected-1', { path: '/protected-1/:protected_1_id' }, function() {
    this.route('protected-2', { path: '/protected-2/:protected_2_id' });
  });

});

export default Router;
