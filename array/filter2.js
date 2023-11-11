if (!Array.prototype.filter) {
  Array.prototype.filter = function (
    callback,
    thisArg, // optional this for callback
  ) {
    // check this
    if (this === null || this === undefined) {
      throw new TypeError('this can not be null or undefined');
    }
    // check callback
    if (typeof callback !== 'function') {
      throw new TypeError('callback should be a function');
    }

    const res = [];
    const thisObject = Object(this); // safe for index in this (this can be 1, '123' etc)
    const len = thisObject.length >>> 0; // Unit32;

    for (let i = 0; i < len; i++) {
      if (i in thisObject) {
        const val = thisObject[i];
        if (callback.call(thisArg, val, i, thisObject)) {
          res.push(val);
        }
      }
    }

    return res;
  }
}

// test cases
// get odd numbers
[1,2,3].filter(a => a % 2); // [1,3]
const filter = [].filter;
filter.call('123', (a) => Number(a) % 2); // ["1", "3"]
filter.call(123, (a) => a ); // []
filter.call({length: 100, 1: 2}, (a) => a); // [2]
filter.call(function (a,b) { return a + b}, (a) => a); // function.length = params.length // []