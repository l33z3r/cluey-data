module("attr.js");

test("attributes can have default values", function() {
  var person1 = App.Person.create();
  var person2 = App.Person.create({ name: 'Sarah', age: 30, is_male: false });

  equal(person1.get('name'), 'Alex');
  equal(person1.get('age'), 1);
  equal(person1.get('is_male'), true);

  equal(person2.get('name'), 'Sarah');
  equal(person2.get('age'), 30);
  equal(person2.get('is_male'), false);

  CD.clear();
});

test("attributes can be set", function() {
  var person1 = App.Person.create();
  var person2 = App.Person.create({ name: 'Sarah', age: 30, is_male: false });

  person1.set('name', 'Tony');
  person2.set('name', 'Tony');

  equal(person1.get('name'), 'Tony');
  equal(person2.get('name'), 'Tony');

  CD.clear();
});
