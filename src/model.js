CD.Model = Em.Object.extend({
  init: function() {
    this.save();
    this._super();
  },
  save: function() {
    CD.save(this);
  },
  delete: function() {
    var self = this;
    this.constructor.getRelationships().forEach(function(relationship) {
      var meta = self.constructor.metaForProperty(relationship);

			if(meta.options.inverse) {
				
	      target = Em.get(meta.type);
		
				targetIsBelongsTo = target.metaForProperty(meta.options.inverse).kind === "belongsTo";
		
				if(targetIsBelongsTo) {
					targetInstanceArray = self.get(meta.options.key);
					
					if(targetInstanceArray != null) {
						tia = targetInstanceArray.toArray()
						for(i=0; i<tia.get('length'); i++) {
							tia[i].set(meta.options.inverse, null);
						}	
				  }
				} else {
					targetInstance = self.get(meta.options.key);
					targetHasManyArray = targetInstance.get(meta.options.inverse);
					targetHasManyArray.removeObject(self);
				}
					
			}
    });
		
		CD.delete(this);
    this.destroy();
  },
  toJson: function() {
    return JSON.stringify(this.serialize());
  },
  serialize: function() {
    var serialized = {},
        attributes = this.constructor.getAttributes(),
        properties = attributes ? this.getProperties(attributes) : {},
        relationships = this.constructor.getRelationships(),
        _data = this.get('_data') || {};

    for (var key in properties) {
      serialized[key] = properties[key];
    }

    for(var i = 0; i < relationships.length; i++) {
      var meta = this.constructor.metaForProperty(relationships[i]);
      var relationshipDataKey = meta.options.key || key;

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

    if(!properties.id) {
      properties.id = this.generateID();
    }

    return this._super(properties);
  },
  generateID: function() {
    return Math.random().toString(32).slice(2).substr(0,6);
  },
  getAttributes: function() {
    this.proto(); // force class "compilation" if it hasn't been done.
    var attributes = this._attributes || [];

    if (typeof this.superclass.getAttributes === 'function') {
      attributes = this.superclass.getAttributes().concat(attributes);
    }

    return attributes;
  },

  getRelationships: function() {
    this.proto(); // force class "compilation" if it hasn't been done.
    var relationships = this._relationships || [];
    if (typeof this.superclass.getRelationships === 'function') {
      relationships = this.superclass.getRelationships().concat(relationships);
    }
    return relationships;
  },
  find: function(criteria) {
    if(criteria instanceof Array) {
      return criteria.map(this.find, this);
    } else if(criteria instanceof Object) {
      return this.filter(criteria);
    } else {
      return CD.find(this, criteria);
    }
  },
  filter: function(criteria) {
    return this.all().filter(
      function(item) {
        return Object.keys(criteria).every(function(c) {
          return item.get(c) === criteria[c];
        });
      }
    );
  },
	first: function(criteria) {
    if(criteria) {
      return this.filter(criteria)[0];
    } else {
      return this.all()[0];
    }
	},
  count: function() {
    return Object.keys(CD.list(this)).length;
  },
  ids: function() {
    return Object.keys(CD.list(this));
  },
  all: function() {
    return this.find(this.ids());
  },
  deserialize: function(models) {
    var self = this;
    Object.keys(models).forEach(function(id) {
      var modelData = models[id];

      var attributeData = {};
      self.getAttributes().forEach(function(attribute) {
        attributeData[attribute] = modelData[attribute];
      });
      var model = self.create(attributeData);

      self.getRelationships().forEach(function(relationship) {
        var meta = self.metaForProperty(relationship);
        model.set('_data.' + meta.relationshipKey, modelData[meta.relationshipKey]);
      });
    });
  }
});
