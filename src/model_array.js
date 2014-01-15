//maintains a list of IDs to related models

CD.ModelArray = Em.ArrayProxy.extend({
  objectAtContent: function(idx) {
    var id = this.get('content').objectAt(idx);

    if(id) {
      return CD.find(this.get('modelClass'), id);
    } else {
      return null;
    }
  },

  pushObject: function(model, skipInverseUpdate) {
    var id = model.get('id'),
        content = this.get('content'),
        inverse = this.get('inverse'),
        parent = this.get('parent');

    if(!content.contains(id)) {
      content.pushObject(id);

      if(!skipInverseUpdate) {
        Em.run.next(this, function() {
          model.set(inverse, parent);
        });
      }
    }
  }
});
