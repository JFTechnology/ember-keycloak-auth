'use strict';

module.exports = {
  name: require('./package').name,

  autoImport: {
    exclude: [
      'ember-cli-mirage',
    ],
  },
};
