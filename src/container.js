CD = ClueyData = {
  data: {}, //a hash of model type arrays
  list: function(klass) {
    var key = String(klass);
    return this.data[key] = (this.data[key] || {});
  },
  find: function(klass, id) {
    return this.list(klass)[id];
  },
  save: function(model) {
    this.list(model.constructor)[model.get('id')] = model;
  },
  classKeys: function() {
    return Object.keys(this.data);
  },
  serialize: function() {
    var serialized = {};
    var self = this;
    this.classKeys().forEach(function(classKey) {
      var models = self.data[classKey];
      var records = {}

      Object.keys(models).forEach(function(id) {
        records[id] = models[id].serialize();
      });

      serialized[classKey] = {
        'records': records
      };
    });
    return serialized;
  },
  deserialize: function(data) {
    this.clear();
    Object.keys(data).forEach(function(classKey) {
      var klass = Em.get(classKey);
      klass.deserialize(data[classKey].records);
    });
  },
  toJson: function() {
    return JSON.stringify(this.serialize());
  },
  fromJson: function(json) {
    this.clear();
    //TODO: GJ: deserialise
  },
  clear: function() {
    //TODO: GJ: do we need to free objects so that they can be GCd?
    this.data = {};
  }
};
