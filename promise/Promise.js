
function isFunction(fn) {
  return typeof fn === 'function';
}

class MyPromise {
  static #ID = 1;
  static #STATE = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED',
  }

  #state = MyPromise.#STATE.PENDING;
  #value;
  #fulfilledCbs = [];
  #rejectedCbs = [];
  #id = MyPromise.#ID;

  constructor(executorFunc) {
    console.log('MyPromise.' + this.#id);
    MyPromise.#ID ++;
    try {
      executorFunc(
        (value) => this.#resolve(value),
        (error) => this.#reject(error)
      )
    } catch (error) {
      this.#reject(error)
    }
  }

  #resolve(value) {
    this.#state = MyPromise.#STATE.FULFILLED;
    this.#value = value;
    console.log('Resolve.' + this.#id, this.#value);
    this.#fulfilledCbs.forEach((cb) => cb());
  }

  #reject(error) {
    this.#state = MyPromise.#STATE.REJECTED;
    this.#value = error;
    console.log('Reject.' + this.#id, this.#value);
    this.#rejectedCbs.forEach((cb) => cb());
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfilledCb = () => {
        if (!isFunction(onFulfilled)) {
          return resolve(this.#value);
        }
        queueMicrotask(() => {
          try {
            const value = onFulfilled(this.#value);
            resolve(value);
          } catch (error) {
            reject(error);
          }
        })
      }
      const rejectedCb = () => {
        if (!isFunction(onRejected)) {
          return reject(this.#value);
        }
        queueMicrotask(() => {
          try {
            const value = onRejected(this.#value);
            resolve(value);
          } catch (error) {
            reject(value);
          }
        })
      }
      switch (this.#state) {
        case MyPromise.#STATE.FULFILLED:
          fulfilledCb();
          break;
        case MyPromise.#STATE.REJECTED:
          rejectedCb();
          break;
        case MyPromise.#STATE.PENDING:
          this.#fulfilledCbs.push(fulfilledCb);
          this.#rejectedCbs.push(rejectedCb);
          break;
        default:
          throw new Error('Unexpected MyPromise state');
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

}


function test1() {
  const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 100)
  });

  const p2 = p1.then((value) => {
    console.log('test1', value)
  })

}

function test2() {
  const p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject(2)
    }, 100)
  });

  p.catch((value) => {
    console.log('test2', value)
  })

}

function test3() {
  const p1 = new MyPromise((resolve, reject) => {
    resolve(3);
  });

  const p2 = p1.then();
}

function test4() {
  const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 100);
  });

  p1.then((value) => {
    return 'P2';
  })
  .then((value) => {
    return 'P3';
  });

  p1.then(value => {
    return 'P4';
  });

}

// test1();
// test2();
// test3();
// test4();



