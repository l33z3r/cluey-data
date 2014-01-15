module("model.js");

test("can filter by hash", function() {
  App.Person.create({ name: "Lee", age: 10 });
  App.Person.create({ name: "Gavin", age: 11 });
  App.Person.create({ name: "Zoltan", age: 12 });

  var filtered = App.Person.find({ name: "Zoltan", age: 12 });
  equal(filtered.length, 1);

  filtered = App.Person.find({ name: "Zoltan", age: 14 });
  equal(filtered.length, 0);
  CD.clear();
});

var lee, gavin;

module('first()', {
  setup: function() {
    lee = App.Person.create({ name: 'Lee' });
    gavin = App.Person.create({ name: 'Gavin' });
  }, teardown: function() {
    CD.clear();
  }
});

test("returns first object when there is data", function() {
  equal(App.Person.first(), lee);
});

test("can filter by hash", function() {
  equal(App.Person.first({ name: 'Gavin' }), gavin);
});

var sully;

module('delete()', {
  teardown: function() {
    CD.clear();
  }
});

// asyncTest("returns first object when there is data", function() {
//   var gavin = App.Person.create({ name: 'Gavin'});
//   var sully = App.Pet.create({ name: 'Sully', owner: gavin });
//   sully.delete();

//   Em.run.next(function() {
//     start();
//     equal(gavin.get('pets.length'), 0);
//   });
// });

