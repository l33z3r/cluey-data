//the hasMany will store an array of ids of related models
require('./model_array');

CD.hasMany = function(type, options) {
  var meta = { type: type, isRelationship: true, options: options, kind: 'hasMany' },
      arrayKey = options.key;

  if(!options.key) {
    throw 'A CD.hasMany relationship must specify a key (' + type + ')';
  }

  return Ember.computed(function(key, value, oldValue) {
    var data = Em.get(this, '_data');
    if (!data) {
      data = {};
      Em.set(this, '_data', data);
    }

    var modelIDs = data[arrayKey];
    if(!modelIDs) {
      modelIDs = data[arrayKey] = Em.A();
    }

    return CD.ModelArray.create({
      parent: this,
      modelClass: type,
      content: modelIDs,
      key: key,
      arrayKey: arrayKey,
      inverse: options.inverse
    });
  }).property().meta(meta);
};
