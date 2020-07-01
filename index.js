const app = require('./src/app.js')();

async function main() {
    await app.run();
    await app.sleep(500);
    await app.download_captcha(100);
}

main();