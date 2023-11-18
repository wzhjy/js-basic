
function isIterable(input) {
  return typeof input?.[Symbol.iterator] === "function";
}


Promise.race = function (iterable) {
  // check iterable is iterable;
  if (!isIterable(iterable)) {
    throw new TypeError(`${iterable} is not iterable`);
  }
  return new Promise((resolve, reject) => {
    [...iterable]
      .forEach(promise => {
        Promise.resolve(promise)
          .then(resolve, reject);
      })
  });
}

function test1() {
  function sleep(time, value, state) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === "fulfill") {
          return resolve(value);
        } else {
          return reject(new Error(value));
        }
      }, time);
    });
  }

  const p1 = sleep(500, "one", "fulfill");
  const p2 = sleep(100, "two", "fulfill");

  Promise.race([p1, p2]).then((value) => {
    console.log(value); // "two"
    // Both fulfill, but p2 is faster
  });

  const p3 = sleep(100, "three", "fulfill");
  const p4 = sleep(500, "four", "reject");

  Promise.race([p3, p4]).then(
    (value) => {
      console.log(value); // "three"
      // p3 is faster, so it fulfills
    },
    (error) => {
      // Not called
    },
  );

  const p5 = sleep(500, "five", "fulfill");
  const p6 = sleep(100, "six", "reject");

  Promise.race([p5, p6]).then(
    (value) => {
      // Not called
    },
    (error) => {
      console.error(error.message); // "six"
      // p6 is faster, so it rejects
    },
  );

}

function test2() {
  // Passing an array of promises that are already resolved,
  // to trigger Promise.race as soon as possible
  const resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

  const p = Promise.race(resolvedPromisesArray);
  // Immediately logging the value of p
  console.log(p);

  // Using setTimeout, we can execute code after the stack is empty
  setTimeout(() => {
    console.log("the stack is now empty");
    console.log(p);
  });

  // Logs, in order:
  // Promise { <state>: "pending" }
  // the stack is now empty
  // Promise { <state>: "fulfilled", <value>: 33 }

}

function test3() {
  const foreverPendingPromise = Promise.race([]);
  const alreadyFulfilledProm = Promise.resolve(100);

  const arr = [foreverPendingPromise, alreadyFulfilledProm, "non-Promise value"];
  const arr2 = [foreverPendingPromise, "non-Promise value", Promise.resolve(100)];
  const p = Promise.race(arr);
  const p2 = Promise.race(arr2);

  console.log(p);
  console.log(p2);
  setTimeout(() => {
    console.log("the stack is now empty");
    console.log(p);
    console.log(p2);
  });

  // Logs, in order:
  // Promise { <state>: "pending" }
  // Promise { <state>: "pending" }
  // the stack is now empty
  // Promise { <state>: "fulfilled", <value>: 100 }
  // Promise { <state>: "fulfilled", <value>: "non-Promise value" }

}