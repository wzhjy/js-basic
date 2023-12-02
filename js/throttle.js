/**
 * const throttled = throttle(console.log, 3000);
document.addEventListener('keypress', () => throttled(currentTime));
// currentTime = 0ms - user starts typing.
// Callback function fires immediately: logs the currentTime at the last keypress, which was 0ms.
// currentTime = 1000ms - user stops typing.
// currentTime = 3000ms - 3000ms have elapsed since last log.
// Callback function fires: logs the currentTime at the last keypress, which was 1000ms.
// currentTime = 7000ms - user starts typing.
// Callback function fires immediately: logs the currentTime at the last keypress, which was 7000ms.
// currentTime = 9000ms - user stops typing.
// currentTime = 10000ms - 3000ms have elapsed since last log.
// Callback function fires: logs the currentTime at the last keypress, which was 9000ms.
 * @param {*} callback 
 * @param {*} delay 
 * @returns 
 */
function throttle(callback, delay) {
  let timerId;
  let lastCallTime = 0;
  const throttled = function (...args) {
    // console.log(this);
    const currentTime = + Date.now(); // get current timestamp (number);
    const timeSinceLastCall = currentTime - lastCallTime;
    const isSafeToExcuteCbNow = timeSinceLastCall >= delay;
    if (isSafeToExcuteCbNow) {
      // exectue now!
      lastCallTime = currentTime;
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
      callback.apply(this, args);
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
      // callback.call(this, ...args);
      // DON'T DO THIS!!! `this` missing
      // callback(...args);
      // For example: 
      // const object = {};
      // object.throttled = throttle(someCallback, 1000);
      // object.throttled(); 
      // <--same as-->
      // const throttled = throttle(someCallback, 1000);
      // throttled.call(object);
    } else {
      // there is a possibility that we setup a timer function already
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastCallTime = + Date.now();
        callback.apply(this, args);
      }, delay - timeSinceLastCall);
    }
  }

  throttled.cancel = function () {
    clearTimeout(timerId);
  }

  return throttled;

}