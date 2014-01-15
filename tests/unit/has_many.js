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

test("requires an options.inverse", function() {
  throws(
    function() {
      var Person = CD.Model.extend({
        pets: CD.hasMany('Pet', { key: 'pet_ids' })
      });
    }
  );
});
