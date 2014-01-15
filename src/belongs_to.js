CD.belongsTo = function(type, options) {
  var meta = { type: type, isRelationship: true, options: options, kind: 'belongsTo' },
      foreignKey = options.key,
      internalKey = '_data.' + foreignKey;

  if(!foreignKey) {
    throw 'A CD.belongsTo relationship must specify a key (' + type + ')';
  }

  if(!options.inverse) {
    throw 'A CD.belongsTo relationship must specify an inverse (' + type + ')';
  }

  return Ember.computed(function(key, model, oldModel) {
    var data = Em.get(this, '_data');
    if (!data) {
      data = {};
      Em.set(this, '_data', data);
    }

    if (arguments.length > 1) { //an update
      var target = Em.get(meta.type);
      var targetIsBelongsTo = target.metaForProperty(meta.options.inverse).kind === 'belongsTo';

      if(oldModel && oldModel !== model) {
        Em.run.next(this, function() {
          if(targetIsBelongsTo) {
            oldModel.set(meta.options.inverse, null);
          } else {
            oldModel.get(meta.options.inverse).removeObject(this);
          }
        });
      }

      if(oldModel && oldModel === model) {
        //no need to update as the model is the same as the current one
      } else {
        var modelID = model ? model.get('id') : null;
        Em.set(this, internalKey, modelID);

        if(model) {
          Em.run.next(this, function() {
            if(targetIsBelongsTo) {
              model.set(meta.options.inverse, this);
            } else {
              model.get(meta.options.inverse).pushObject(this, true);
            }
          });
        }
      }

      return model === undefined ? null : model;
    } else {
      var modelID = data && Em.get(data, foreignKey);
      return modelID === undefined ? null : CD.find(meta.type, modelID);
    }
  }).property(internalKey).meta(meta);
};
