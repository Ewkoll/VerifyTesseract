// ============================================================================================================
// @Date: 2020-07-01 10:57:35
// @Author: Ewkoll
// @Email: ideath@operatorworld.com
// @Description: 验证码自动识别，训练文件需要更新。
// @License: Apache-2.0
// @FilePath: /VerifyTesseract/src/utils/captcha_ocr.js
// @LastEditTime: 2020-07-01 11:29:43
// ============================================================================================================
const path = require('path');
const {
    createWorker
} = require('tesseract.js');

module.exports = function () {
    
    var captcha = {};

    // ============================================================================================================
    // @description: captcha recognise
    // @param {type} 
    // @return: 
    // ============================================================================================================
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

    // ============================================================================================================
    // @description: init ocr module
    // @param {type} 
    // @return: 
    // ============================================================================================================
    captcha.init = async function() {
        var config_path = path.join(__dirname, './traineddata');
        const worker = createWorker({
            langPath: config_path,
            gzip: false,
            logger: m => console.log(m)
        });
        await worker.load();
        await worker.loadLanguage('eng.normal');
        await worker.initialize('eng.normal');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ',
        });
        captcha.worker = worker;
    }

    // ============================================================================================================
    // @description: captcha recognise
    // @param {type} 
    // @return: 
    // ============================================================================================================
    captcha.direct_captcha_recognise = async function(image_path) {
        if (captcha.worker) {
            const {
                data: {
                    text
                }
            } = await captcha.worker.recognize(image_path);
            return Promise.resolve(text);
        }
    }

    // ============================================================================================================
    // @description: ocr clear
    // @param {type} 
    // @return: 
    // ============================================================================================================
    captcha.terminate = async function() {
        if (captcha.worker) {
            await captcha.worker.terminate();
        }
    }
    return captcha
}