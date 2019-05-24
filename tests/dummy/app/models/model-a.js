import Model from 'ember-data/model';

import attr from 'ember-data/attr';

export default class ModelA extends Model {

  @attr('string')
  name;

}
