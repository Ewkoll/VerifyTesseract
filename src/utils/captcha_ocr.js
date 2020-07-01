const path = require('path');
const {
    createWorker
} = require('tesseract.js');

module.exports = function () {
    var captcha = {};

    captcha.captcha_recognise = async function (image_path) {
        var config_path = path.join(__dirname, './traineddata');
        const worker = createWorker({
            langPath: config_path,
            gzip: false,
            logger: m => console.log(m)
        });
        await worker.load();
        await worker.loadLanguage('captcha');
        await worker.initialize('captcha');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ',
        });
        const {
            data: {
                text
            }
        } = await worker.recognize(image_path);
        await worker.terminate();
        return Promise.resolve(text);
    }

    captcha.init = async function() {
        var config_path = path.join(__dirname, './traineddata');
        const worker = createWorker({
            langPath: config_path,
            gzip: false,
            logger: m => console.log(m)
        });
        await worker.load();
        await worker.loadLanguage('captcha');
        await worker.initialize('captcha');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ',
        });
        captcha.worker = worker;
    }

    captcha.direct_captcha_recognise = async function(image_path) {
        const {
            data: {
                text
            }
        } = await captcha.worker.recognize(image_path);
        return Promise.resolve(text);
    }

    captcha.terminate = async function() {
        await captcha.worker.terminate();
    }
    return captcha
}