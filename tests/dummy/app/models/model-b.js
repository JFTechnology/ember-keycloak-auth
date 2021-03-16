import Model, {attr} from '@ember-data/model';

export default class ModelB extends Model {

  @attr('string')
  name;

}
