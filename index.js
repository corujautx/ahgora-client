#! /usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer');
const packageInfo = require('./package');
const { SELECTORS, KEYS } = require('./constants');
const { createConfiguration } = require('./config');

program
  .version(packageInfo.version)
  .command('punch')
  .description('register a new card punch')
  .option('--config [path]', 'the path to a configuration JSON file')
  .action(async options => {
    const config = createConfiguration(options.config);
    const browser = await puppeteer.launch(config.browser);
    const page = await browser.newPage();

    await page.goto(config.page.url, {
      waitUntil: 'domcontentloaded'
    });

    // Authenticate the device
    await page.evaluate(
      (KEYS, config) => {
        localStorage.setItem(KEYS.device.identity, config.device.identity);
        localStorage.setItem(
          KEYS.device.companyName,
          config.device.companyName
        );
      },
      KEYS,
      config
    );

    await page.click(SELECTORS.account);
    await page.keyboard.type(config.credentials.account);

    await page.click(SELECTORS.password);
    await page.keyboard.type(config.credentials.password);

    await page.waitFor(3000);
    await browser.close();
  });

program.parse(process.argv);
