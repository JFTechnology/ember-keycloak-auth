import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ProjectSerializer extends JSONAPISerializer {

  keyForAttribute(key) {
    console.debug(`ProjectSerializer attribute ${key}`);
    return key;
  }
}
