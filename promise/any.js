
function isIterable(iterable) {
  return typeof iterable?.[Symbol.iterator] === 'function';
}

Promise.any = function (iterable) {
  // check iterable is iterable;
  if (!isIterable(iterable)) {
    throw new TypeError(`${iterable} is not iterable`);
  }
  return new Promise(function (resolve, reject) {
    const len = iterable.length;
    const errors = []; // errors is a object, it won't change, we only push elements.
    let counter = 0;
    function onReject() {
      reject(new AggregateError(errors, 'All promises were rejected'));
    }
    if (len === 0) {
      return onReject();
    }
    [...iterable].forEach(((promise, index) => {
      Promise.resolve(promise)
        .then(
          resolve,
          (error) => {
            errors[index] = error;
            counter++;
            if (counter === len) {
              onReject();
            }
          })
    }));
  });
}

function test1() {
  const pErr = new Promise((resolve, reject) => {
    reject("Always fails");
  });

  const pSlow = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, "Done eventually");
  });

  const pFast = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "Done quick");
  });

  Promise.any([pErr, pSlow, pFast]).then((value) => {
    console.log(value);
    // pFast fulfills first
  });
  // Logs:
  // Done quick
}


function test2() {
  const failure = new Promise((resolve, reject) => {
    reject("Always fails");
  });

  Promise.any([failure]).catch((err) => {
    console.log(err);
    console.log(err.errors);
  });
  // AggregateError: No Promise in Promise.any was resolved
}