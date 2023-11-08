if (!Array.prototype.map) {
    Array.prototype.map = function (
        callback,
        thisArg
    ) {
        // check this
        if (this === null || this === undefined) {
            throw new TypeError('this can\'t be null or undefined ');
        }
        // check callback
        if (typeof callback !== 'function') {
            throw new TypeError('callback should be a function');
        }

        const thisObj = Object(this);
        const len = thisObj.length >>> 0; // Unit32
        const newArray = new Array(len);
        for (let k = 0; k < len; k++) {
            if (k in thisObj) {
                const kValue = thisObj[k];
                const mappedValue = callback.call(thisArg, kValue, k, thisObj);
                newArray[k] = mappedValue;
            }
        }
        return newArray;
    }
}