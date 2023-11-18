
function isIterable(input) {
  return typeof input?.[Symbol.iterator] === "function";
}

Promise.all = function (iterable) {
  if (!isIterable(iterable)) {
    throw new TypeError(`${iterable} is not iterable`);
  }
  return new Promise(function (resolve, reject) {
    const result = [];
    const len = iterable.length;
    if (len === 0) {
      return resolve(result);
    }
    let counter = 0;
    [...iterable].forEach((promise, index) => {
      Promise.resolve(promise).then(function (x) {
        // fulfills when all of the input's promises fulfill, with an array of the fulfillment values
        // in the order of the promises passed, regardless of completion order. 
        result[index] = x;
        counter++;
        if (counter === len) {
          resolve(result);
        }
      }, reject); // rejects when any of the input's promises rejects, with this first rejection reason.
    })
  });
}

function test0() {
  console.log(Promise.all([]));
}

test0();

function test1() {
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });
  const promise4 = new Promise((resolve, reject) => {
    setTimeout(resolve, 50, 'bar');
  });

  Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
    console.log(values);
  });
  // Expected output: Array [3, 42, "foo", "bar"]
}

test1();

function test2() {
  // All values are non-promises, so the returned promise gets fulfilled
  const p = Promise.all([1, 2, 3]);
  // The only input promise is already fulfilled,
  // so the returned promise gets fulfilled
  const p2 = Promise.all([1, 2, 3, Promise.resolve(444)]);
  // One (and the only) input promise is rejected,
  // so the returned promise gets rejected
  const p3 = Promise.all([1, 2, 3, Promise.reject(555)]);

  // Using setTimeout, we can execute code after the queue is empty
  setTimeout(() => {
    console.log(p);
    console.log(p2);
    console.log(p3);
  });

  // Logs:
  // Promise { <state>: "fulfilled", <value>: Array[3] }
  // Promise { <state>: "fulfilled", <value>: Array[4] }
  // Promise { <state>: "rejected", <reason>: 555 }

}

test2();


function test3() {
  const p = Promise.all([]); // Will be immediately resolved
  const p2 = Promise.all([1337, "hi"]); // Non-promise values are ignored, but the evaluation is done asynchronously
  console.log(p);
  console.log(p2);
  setTimeout(() => {
    console.log("the queue is now empty");
    console.log(p2);
  });

  // Logs:
  // Promise { <state>: "fulfilled", <value>: Array[0] }
  // Promise { <state>: "pending" }
  // the queue is now empty
  // Promise { <state>: "fulfilled", <value>: Array[2] }
}

test3();

function test4() {
  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("one"), 1000);
  });
  const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("two"), 2000);
  });
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("three"), 3000);
  });
  const p4 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("four"), 4000);
  });
  const p5 = new Promise((resolve, reject) => {
    reject(new Error("reject"));
  });

  // Using .catch:
  Promise.all([p1, p2, p3, p4, p5])
    .then((values) => {
      console.log(values);
    })
    .catch((error) => {
      console.error(error.message);
    });
  // Logs:
  // "reject"
}

test4();

function test5() {
  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("p1_delayed_resolution"), 1000);
  });

  const p2 = new Promise((resolve, reject) => {
    reject(new Error("p2_immediate_rejection"));
  });

  Promise.all([p1.catch((error) => error), p2.catch((error) => error)]).then(
    (values) => {
      console.log(values[0]); // "p1_delayed_resolution"
      console.error(values[1]); // "Error: p2_immediate_rejection"
    },
  );
}

test5();