/* jshint node: true */

module.exports = {

  description: 'ember-keycloack-auth',

  afterInstall: function () {

    return this.addBowerPackagesToProject([
      { name: 'keycloack' }
    ]);

  }

};
