/**
 *
 */
import Ember from 'ember';

export default Ember.Route.extend({

  model: function (params) {

    console.log(`Unprotected route ${Object.keys(params)}`);
  }

});
