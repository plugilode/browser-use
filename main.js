const Apify = require('apify');
const { Browser } = require('browser-use');

Apify.main(async () => {
    const input = await Apify.getInput();
    if (!input || !input.url || !input.command) {
        throw new Error('Please provide a "url" and a "command" in the input!');
    }

    const { url, command, email, password } = input;

    console.log('Starting the robot...');
    const browser = new Browser({ executablePath: '/usr/bin/google-chrome', headless: true });
    await browser.start();
    const page = await browser.newPage();

    console.log(`Navigating to URL: ${url}...`);
    await page.goto(url);

    if (url.includes('chat.openai.com') && email && password) {
        console.log('Detected ChatGPT URL, attempting login...');
        await page.type('input[name="username"]', email, { delay: 100 });
        await page.type('input[name="password"]', password, { delay: 100 });
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
        console.log('Logged in, going to chat page...');
        await page.goto('https://chat.openai.com/');
    }

    console.log(`Executing command: "${command}"...`);
    await page.type('textarea', command, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.wait(3000);

    const response = await page.evaluate(() => {
        const messages = document.querySelectorAll('.message:last-child');
        return messages.length > 0 ? messages[0].innerText : 'No response yet';
    });
    console.log('Response:', response);

    await Apify.pushData({ url, command, response });

    console.log('Closing the browser...');
    await browser.close();
    console.log('Robot finished!');
});
