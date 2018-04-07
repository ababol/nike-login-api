import puppeteer from 'puppeteer';

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
      headless: false,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
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

    await page.waitFor(Math.floor(Math.random() * 500));

    const inputs = [
      '.nike-unite-text-input.emailAddress input',
      '.nike-unite-text-input.password input',
    ];
    await page.waitForSelector(inputs[0]);
    await page.type(inputs[0], randomText(), {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.keyboard.press('Backspace', {
      delay: Math.floor(Math.random() * 300) + 1,
    });
    await page.type(inputs[0], login, {
      delay: Math.floor(Math.random() * 300) + 1,
    });

    await page.waitFor(Math.floor(Math.random() * 3000));
    await page.type(inputs[1], password, {
      delay: Math.floor(Math.random() * 300) + 1,
    });

    const submitBtn = '.nike-unite-submit-button.loginSubmit input';

    await page.waitFor(Math.floor(Math.random() * 500));

    await page.waitForSelector(submitBtn);
    await page.click('.nike-unite-swoosh');
    await page.click('.view-header');
    await page.hover('.view-header');
    await page.click(submitBtn);

    let browserClosed = false;

    page.on('response', async response => {
      if (
        response.url().indexOf('https://unite.nike.com/login') > -1 &&
        response.request().method() === 'POST'
      ) {
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
