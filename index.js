
saferString = function (str) {
    let ret = '';
    if (str && typeof str === 'string') {
        ret = str.replace(/\W+/g, '');
    }
    return ret;
};
console.log('^@# 3   dsd  ')
console.log(saferString('^ 3@#   dsd  '))

const app = require('./src/app.js')();

/*
async function test() {
    let result = await app.setPromise()
    console.log(result)
}

test()
*/
app.download_captcha();