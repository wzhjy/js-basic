if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (
    callback,
    // initValue,
  ) {

    // check this
    if (this === null || this === undefined) {
      throw new TypeError('this can not be null or undefined');
    }

    // check callback
    if (typeof callback !== 'function') {
      throw new Error('callback should be a function');
    }
    const thisObject = Object(this);
    const len = thisObject.length >>> 0;
    // get init value
    let value;
    let k = 0;
    if (arguments.length > 1) {
      value = arguments[1];
    } else {
      // value should be the first value of thisObject;
      // get first value's k
      while (k < len && !(k in thisObject)) {
        k++;
      }
      // k === len is correct;
      // k >= len is correct too; 
      if (k === len) {
        // can't find initValue;
        throw new TypeError('Reduce with no initial value')
      }
      value = thisObject[k];
      k++;
    }
    while (k < len) {
      if (k in thisObject) {
        // preValue, currentVal, currentIndex, thisObject
        value = callback(value, thisObject[k], k, thisObject)
      }
      k++;
    }
    return value;
  }
}

// test cases
const getMax = (a, b) => Math.max(a, b);

// callback is invoked for each element in the array starting at index 0
[1, 100].reduce(getMax, 50); // 100
[50].reduce(getMax, 10); // 50

// callback is invoked once for element at index 1
[1, 100].reduce(getMax); // 100

// callback is not invoked
[50].reduce(getMax); // 50
[].reduce(getMax, 1); // 1

[].reduce(getMax); // TypeError


const reduce = [].reduce;
// Math.max('1', '2') -> 2
reduce.call('123', getMax); // 3
reduce.call(123, getMax, 0); // 0, callback is not invoked
reduce.call(123, getMax); // TypeError - no length
reduce.call({ length: 100, 1: 2 }, getMax); // 2, callback is not invoked
reduce.call(function (a, b) { return a + b }, getMax); // TypeError
reduce.call(function (a, b) { return a + b }, getMax, 2); // 2, callback is not invoked