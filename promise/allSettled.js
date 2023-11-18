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