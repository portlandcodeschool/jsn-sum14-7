module.exports = function (partial, data) {
  return partial.replace(/\{\{ *([\w_]+) *\}\}/g, function (partial, key) {
    var value = data[key];
    if (value === undefined) {
      throw new Error('No value provided for variable ' + partial);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    console.log(value);
    return value;
  });
}
