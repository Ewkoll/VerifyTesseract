const fs = require('fs');
const path = require('path');
const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const utils_captcha = require('./utils/captcha_ocr.js')();

module.exports = function () {
    var app = {};

    app.run = async function () {
        let driver = await new Builder().forBrowser('chrome').build();
        try {
            await driver.get('http://qmeuat.jiajiaexchange.com/#/');
            const captcha = driver.findElement(By.id('s-canvas'));
            const captcha_text = await captcha.getText();
            console.log(captcha_text);
            const injectJS = 'return document.getElementById("s-canvas").toDataURL()';
            const captcha_image = await driver.executeScript(injectJS);
            console.log(captcha_image);
            var base64Data = captcha_image.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = Buffer.from(base64Data, 'base64');
            const captcha_file_name = "captcha/captcha" + Date.now() + ".png"
            fs.writeFile(captcha_file_name, dataBuffer, async function (err) {
                if (err) {
                    console.log(err, '保存失败！');
                } else {
                    console.log('保存成功！' + captcha_file_name);
                    const text = await utils_captcha.captcha_recognise(captcha_file_name);
                    console.log(text);
                }
            });
        } catch (error) {
            console.log(error)
        } finally {
            driver.quit();
        }
    }

    app.sleep = async function (sleep_time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('sleep' + sleep_time)
            }, sleep_time)
        })
    }

    app.download_captcha = async function () {
        let driver = await new Builder().forBrowser('chrome').build();
        try {
            await driver.get('http://qmeuat.jiajiaexchange.com/#/');
            const el_link__inner = driver.findElement(By.className('el-link--inner'));
            let captcha_count = 5000;
            const injectJS = 'return document.getElementById("s-canvas").toDataURL()';
            do {
                const captcha_image = await driver.executeScript(injectJS);
                console.log(captcha_image);
                var base64Data = captcha_image.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = Buffer.from(base64Data, 'base64');
                const captcha_file_name = "captcha/captcha" + Date.now() + ".png"
                fs.writeFile(captcha_file_name, dataBuffer, async function (err) {
                    if (err) {
                        console.log(err, '保存失败！');
                    } else {
                        console.log('保存成功！' + captcha_file_name);
                    }
                });
                await el_link__inner.click();
                await app.sleep(1000);
            } while (captcha_count--);
        } catch (error) {
            console.log(error)
        } finally {
            driver.quit();
        }
    }

    return app;
}