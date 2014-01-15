module("model.js");

test("can filter by hash", function() {
  App.Person.create({ name: "Lee" });
  App.Person.create({ name: "Gavin" });
  App.Person.create({ name: "Zoltan" });

  var filtered = App.Person.find({ name: "Zoltan" });

  equal(filtered.length, 1);
});
