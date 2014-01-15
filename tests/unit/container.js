module('container.js', {
  teardown: function() {
    CD.clear();
  }
})

test('ClueyData namespace exists', function() {
  ok(ClueyData);
});

test('CD namespace exists', function() {
  ok(CD);
});

test('CD.clear()', function() {
  deepEqual(CD.data, {});

  App.Person.create({ name: 'Gavin' });

  notDeepEqual(CD.data, {});

  CD.clear();
  deepEqual(CD.data, {});
});

asyncTest('CD.serialize() with single model', function() {
  deepEqual(CD.serialize(), {}, 'an empty hash by default');
  var person = App.Person.create({ name: 'Gavin' });

  Ember.run.next(function() {
    start();
    var expected = {
      "App.Person": {
        "records": {}
      }
    };

    expected['App.Person']['records'][person.get('id')] = {
      "id": person.get('id'),
      "age": person.get('age'),
      "is_male": person.get('is_male'),
      "name": "Gavin",
      "pet_ids": []
    }

    deepEqual(CD.serialize(), expected, 'there should be one App.Person');
  });
});

asyncTest('CD.serialize() with related models', function() {
  deepEqual(CD.serialize(), {}, 'an empty hash by default');
  var person = App.Person.create({ name: 'Gavin' });
  var pet = App.Pet.create({ name: 'Sully', owner: person });

  Ember.run.next(function() {
    start();

    var expected = {
      "App.Person": {
        "records": {}
      },
      "App.Pet": {
        "records": {}
      }
    };

    expected['App.Person']['records'][person.get('id')] = {
      "id": person.get('id'),
      "age": person.get('age'),
      "is_male": person.get('is_male'),
      "name": "Gavin",
      "pet_ids": [pet.get('id')]
    };

    expected['App.Pet']['records'][pet.get('id')] = {
      "id": pet.get('id'),
      "name" : "Sully",
      "owner_id": person.get('id')
    };

    deepEqual(CD.serialize(), expected);
  });
});

asyncTest('CD.deserialize() models without relationships', function() {
  var person = App.Person.create({ name: 'Gavin' });
  var pet = App.Pet.create({ name: 'Sully' });

  Ember.run.next(function() {
    var expected = CD.serialize();
    CD.clear();
    CD.deserialize(expected);

    Ember.run.next(function() {
      start();
      ok(true);
      deepEqual(CD.serialize(), expected);
    });
  });
});

