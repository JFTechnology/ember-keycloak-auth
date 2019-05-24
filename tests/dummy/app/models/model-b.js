import Model from 'ember-data/model';

import attr from 'ember-data/attr';

export default class ModelB extends Model {

  @attr('string')
  name;

}
