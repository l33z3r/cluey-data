module("model.js");

test("can filter by hash", function() {
  App.Person.create({ name: "Lee", age: 10 });
  App.Person.create({ name: "Gavin", age: 11 });
  App.Person.create({ name: "Zoltan", age: 12 });

  var filtered = App.Person.find({ name: "Zoltan", age: 12 });
  equal(filtered.length, 1);

  filtered = App.Person.find({ name: "Zoltan", age: 14 });
  equal(filtered.length, 0);
});
