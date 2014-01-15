CD.Model = Em.Object.extend({
  init: function() {
    this.save();
    this._super();
  },
  save: function() {
    CD.save(this);
  },
  toJson: function() {
    return JSON.stringify(this.serialize());
  },
  serialize: function() {
    var serialized = {},
        attributes = this.constructor.getAttributes(),
        properties = attributes ? this.getProperties(attributes) : {},
        relationships = this.constructor.getRelationships(),
        _data = this.get('_data');

    for (key in properties) {
      serialized[key] = properties[key];
    }

    for(var i = 0; i < relationships.length; i++) {
      meta = this.constructor.metaForProperty(relationships[i]);
      relationshipDataKey = meta.options.key || key;

      var value = _data[relationshipDataKey];
      if (value === undefined) {
        //the property hasn't been accessed yet so lets use a default value
        value = meta.kind === 'hasMany' ? [] : null;
      }
      serialized[relationshipDataKey] = value;
    }

    return serialized;
  },
  didDefineProperty: function(proto, key, value) {
    if (value instanceof Em.Descriptor) {
      var meta = value.meta();
      var klass = proto.constructor;

      if (meta.isAttribute) {
        if (!klass._attributes) { klass._attributes = ['id']; }
        klass._attributes.push(key);
      } else if (meta.isRelationship) {
        if (!klass._relationships) { klass._relationships = []; }
        klass._relationships.push(key);
        meta.relationshipKey = key;
      }
    }
  },
}).reopenClass({
  create: function(properties) {
    if(!properties) {
      properties = {};
    }

    if(!properties['id']) {
      properties['id'] = this.generateID();
    }

    return this._super(properties);
  },
  generateID: function() {
    return Math.random().toString(32).slice(2).substr(0,6);
  },
  getAttributes: function() {
    var attributes = this._attributes || [];

    if (typeof this.superclass.getAttributes === 'function') {
      attributes = this.superclass.getAttributes().concat(attributes);
    }

    return attributes;
  },

  getRelationships: function() {
    var relationships = this._relationships || [];
    if (typeof this.superclass.getRelationships === 'function') {
      relationships = this.superclass.getRelationships().concat(relationships);
    }
    return relationships;
  },

  find: function(ids) {
    if(ids instanceof Array) {
      return ids.map(this.find, this);
    } else {
      return CD.find(this, ids);
    }
  },
  count: function() {
    return Object.keys(CD.list(this)).length;
  },
  ids: function() {
    return Object.keys(CD.list(this))
  },
  all: function() {
    return this.find(this.ids());
  },
  deserialize: function(data) {
    var self = this;
    Object.keys(data).forEach(function(id) {
      var attributeData = {};
      self.getAttributes().forEach(function(attribute) {
        attributeData[attribute] = data[id][attribute];
      });
      var model = self.create(attributeData);


      //TODO: GJ: deserialize relationships too
    })
  },
});
