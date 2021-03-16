import Model, {attr} from '@ember-data/model';

export default class ModelA extends Model {

  @attr('string')
  name;

}
