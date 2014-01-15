CD.attr = function(options) {
  return Em.computed(function(key, value) {
    var data = Em.get(this, '_data'),
        dataValue = data && Em.get(data, key);

    if (arguments.length === 2) {
      if (!data) {
        data = {};
        Em.set(this, '_data', data);
      }
      data[key] = value;
      return value;
    }

    if (!dataValue && options && options.defaultValue) {
      return Em.copy(options.defaultValue);
    }

    return dataValue;
  }).property('_data').meta({ isAttribute: true, options: options });
}
