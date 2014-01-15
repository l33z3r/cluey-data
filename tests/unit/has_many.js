module("has_many.js");

test("requires an options.key", function() {
  throws(
    function() {
      var Person = CD.Model.extend({
        pets: CD.hasMany('Pet', { inverse: 'owner' })
      });
    }
  );
});


var person, cat, tag;

module('has_many.js', {
  setup: function() {
    person = App.Person.create({ name: 'Gavin' });
    cat = App.Pet.create({ name: 'Sully' });
    tag = App.Tag.create({ name: 'Furry' })

    equal(person.get('pets.length'), 0, 'hasMany should be empty');
    equal(cat.get('tags.length'), 0);
  }, teardown: function() {
    CD.clear();
  }
});


asyncTest("a hasMany relationship with no inverse can be set", function() {
  cat.get('tags').pushObject(tag);

  Ember.run.next(function() {
    start();
    equal(cat.get('tags.length'), 1, 'the hasMany array should be updated');
  });
});
