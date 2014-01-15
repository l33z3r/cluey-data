module("belongs_to.js");

test("requires an options.key", function() {
  throws(
    function() {
      var Pet = CD.Model.extend({
        owner: CD.belongsTo('Person', { inverse: 'owner' })
      });
    }
  );
});

test("requires an options.inverse", function() {
  throws(
    function() {
      var Pet = CD.Model.extend({
        owner: CD.belongsTo('Person', { key: 'owner_id' })
      });
    }
  );
});

var person, cat;

module('belongs_to.js', {
  setup: function() {
    person = App.Person.create({ name: 'Gavin' });
    cat = App.Pet.create({ name: 'Sully' });

    equal(cat.get('owner'), null, 'belongsTo is null by default');
    equal(person.get('pets.length'), 0);
  }, teardown: function() {
    CD.clear();
  }
})

test("getting and setting the belongsTo property", function() {
  cat.set('owner', person);
  equal(cat.get('owner'), person, 'the belongsTo property can be set to a model');
  equal(cat.get('owner.id'), person.get('id'), 'the belongsTo property sub-properties can be accessed');

  cat.set('owner', null);
  equal(cat.get('owner'), null, 'the belongsTo property can be set to null');
});

asyncTest("setting a belongsTo affects the corresponding hasMany", function() {
  cat.set('owner', person);

  Ember.run.next(function() {
    start();
    equal(person.get('pets.length'), 1, 'the hasMany array should be updated');
    equal(person.get('pets.firstObject'), cat);
  });
});

asyncTest("setting a belongsTo that has an existing model correctly updates the existing model", function() {
  cat.set('owner', person);

  var newPerson = App.Person.create({ name: 'Sarah' });
  cat.set('owner', newPerson);

  Ember.run.next(function() {
    start();
    equal(person.get('pets.length'), 0, 'the original person should not relate to the cat');
    equal(newPerson.get('pets.length'), 1, 'the newPerson should relate to the cat');
    equal(newPerson.get('pets.firstObject'), cat);
  });
});
