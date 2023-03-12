// let a = {
//     _a: 0,
//     toString: function () {
//         return ++this._a;
//     }
// };
Object.defineProperties(global, {
    _a: {
        value: 0,
        writable: true
    },
    a: {
        get() {
            return ++global._a;
        }
    }
});
if (a == 1 && a == 2 && a == 3) {
    console.log(123);
}
