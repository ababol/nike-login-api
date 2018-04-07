import puppeteer from 'puppeteer';

const randomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomText = () => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const loginToNike = (login, password) => {
  return new Promise(async res => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    });
    await page.goto('https://www.nike.com/us/en_us/e/nike-plus-membership', {
      waitUntil: 'networkidle0',
    });
    // const cookies = await page.cookies();
    //
    // const sessionFreeCookies = cookies.map(
    //   async cookie =>
    //     await page.setCookie({
    //       ...cookie,
    //       expires: Date.now() / 1000 + 10 * 60,
    //       session: false,
    //     }),
    // );

    const loginSelector = '.login-text';
    await page.waitForSelector(loginSelector);
    await page.click(loginSelector);

    const emailSelector = '.nike-unite-text-input.emailAddress input';
    await page.waitFor(emailSelector);
    await page.waitFor(randomDelay(300, 600));

    const inputs = [emailSelector, '.nike-unite-text-input.password input'];

    // random thing -> human behavior
    await page.type(inputs[0], randomText(), {
      delay: randomDelay(150, 250),
    });
    for (var i = 0; i < randomDelay(6, 10); i++) {
      await page.keyboard.press('Backspace', {
        delay: randomDelay(150, 250),
      });
    }

    await page.type(inputs[0], login, {
      delay: randomDelay(200, 300),
    });

    await page.waitFor(randomDelay(300, 600));
    await page.type(inputs[1], password, {
      delay: randomDelay(200, 300),
    });

    const submitBtn = '.nike-unite-submit-button.loginSubmit input';

    await page.waitFor(randomDelay(200, 500));

    await page.waitForSelector(submitBtn);
    await page.click('.nike-unite-swoosh');
    await page.hover('.nike-unite-swoosh');
    await page.waitFor(randomDelay(200, 400));
    await page.click('.view-header');
    await page.hover('.nike-unite-swoosh');
    await page.waitFor(randomDelay(200, 400));
    await page.hover('.view-header');
    await page.click(submitBtn);

    let browserClosed = false;

    page.on('response', async response => {
      if (
        response.url().indexOf('https://unite.nike.com/login') > -1 &&
        response.request().method() === 'POST'
      ) {
        console.log(response.status());
        const data = await response.json();
        browserClosed = true;
        await browser.close();
        return res(data);
      }
    });

    await page.waitFor(10000);

    if (!browserClosed) await browser.close();
    return res(null);
  });
};

export default loginToNike;
