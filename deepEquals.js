/**
 *   
    Write a deepEquals function that takes in two required values
    and returns if those two values are deeply equal to each other.
  
  For the purpose of this problem, deep equality is defined as follows:
  
    Values with different types are not equal.
    NaN is only equal to NaN.
    
      null is only equal to null, and
      undefined is only equal to undefined. These
      values are not equal to each other.
    
      Arrays are only equal if their entries are deeply equal to each other.
      
      Objects are equal only if their keys and values are deeply equal to each
      other (note that the order of the keys doesn't matter).
    
  
  You can make the following assumptions:
    
      Functions will never be passed to deepEquals and will never
      be contained in objects or arrays passed to deepEquals.
    
      Objects will only have string keys, and their values won't be recursive
      references to themselves.
  
      The prototype chain doesn't need to be considered when determining if two
      objects are deeply equal.
 */


function isNaN(x) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
  return Number.isNaN ? Number.isNaN(x) : x !== x;
}

function isArray(x) {
  // https://stackoverflow.com/questions/62074163/understanding-array-isarray-polyfill
  return Array.isArray ? Array.isArray(x) : Object.prototype.toString.call(arg) === '[object Array]';
}

function isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]'
}


function deepEquals(a, b) {
  // number, string, null, undefined, boolean
  if (a === b) return true;

  if (isNaN(a) && isNaN(b)) return true;

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }

  if (isObject(a) && isObject(b)) {
    // recursively deepEquals
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
    for (const k of aKeys) {
      if (!(k in b)) return false;
      if (!deepEquals(a[k], b[k])) return false;
    }
    return true;
  }

  return false;
}


console.log(deepEquals(1, 1)); // true
console.log(deepEquals(1, '1')); // false
console.log(deepEquals(null, null)); // true
console.log(deepEquals(null, undefined)); // false
console.log(deepEquals([], [])); // true
console.log(deepEquals({}, {})); // true
console.log(deepEquals([], {})); // false
console.log(deepEquals({ a: 123, b: { c: [4, 5, 6] } }, { a: 123, b: { c: [4, 5, 6] } })); // true
console.log(deepEquals({ a: 123, b: { c: [4, 5, 6] } }, { b: { c: [4, 5, 6] } })); // false
console.log(deepEquals({ a: 123, b: { c: [4, 5, 6] } }, { a: 123, b: { c: [4, '5', 6] } })); // false
console.log(deepEquals([1, 2, [3, 4]], [1, 2, [3, 4]])); // true
console.log(deepEquals([1, 2, [3, 4, { a: 'abc' }]], [1, 2, [3, 4, { a: 'abc' }]])); // true