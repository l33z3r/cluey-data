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
      "partner": null,
      "pets": [],
      "score": 0
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
      "partner": null,
      "pets": [pet.get('id')],
      "score": 0
    };

    expected['App.Pet']['records'][pet.get('id')] = {
      "id": pet.get('id'),
      "name" : "Sully",
      "owner": person.get('id'),
      "tags": []
    };

    deepEqual(CD.serialize(), expected);
  });
});

asyncTest('CD.deserialize() models without relationships', function() {
  var person = App.Person.create({ name: 'Gavin' });
  var pet = App.Pet.create({ name: 'Sully' });

  var expected = CD.serialize();
  CD.clear();
  CD.deserialize(expected);

  Ember.run.next(function() {
    start();
    deepEqual(CD.serialize(), expected);
  });
});

asyncTest('CD.deserialize() models with relationships', function() {
  var gavin = App.Person.create({ name: 'Gavin' });
  var sarah = App.Person.create({ name: 'Sarah', partner: gavin });
  var pet = App.Pet.create({ name: 'Sully', owner: gavin });

  var expected = CD.serialize();
  CD.clear();
  CD.deserialize(expected);

  Ember.run.next(function() {
    start();
    deepEqual(CD.serialize(), expected);
  });
});
