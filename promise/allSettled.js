function isIterable(iterable) {
  return typeof iterable?.[Symbol.iterator] === 'function'
}

if (!Promise.allSettled) {
  Promise.allSettled = function (iterable) {
    // iterable is iterable?
    if (!isIterable(iterable)) {
      throw new TypeError('argument not iterable')
    }
    return new Promise((resolve, reject) => {
      const length = iterable.length
      let counter = 0
      const result = []
      if (length === 0) {
        resolve([])
      }
      [...iterable].forEach((promise, index) => {
        Promise.resolve(promise)
          .then((value) => {
            return { status: 'fulfilled', value }
          }, (reason) => {
            return { status: 'rejected', reason }
          })
          .then((obj) => {
            result[index] = obj
            counter++
            if (counter === length) {
              resolve(result)
            }
          })
      })
    })
  }
}

//test cases
function test0() {
  Promise.allSettled([
    Promise.resolve(33),
    new Promise((resolve) => setTimeout(() => resolve(66), 0)),
    99,
    Promise.reject(new Error("an error")),
  ]).then((values) => console.log(values));
  // [
  //   { status: 'fulfilled', value: 33 },
  //   { status: 'fulfilled', value: 66 },
  //   { status: 'fulfilled', value: 99 },
  //   { status: 'rejected', reason: Error: an error }
  // ]
}


