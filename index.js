#! /usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer');
const packageInfo = require('./package');
const { createConfiguration } = require('./config');
const selectors = require('./selectors');

program
  .name(packageInfo.name)
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
    await page.evaluate(config => {
      localStorage.pontoweb_identity = config.device.identity;
      localStorage.company_name = config.device.companyName;
    }, config);

    await page.click(selectors.account);
    await page.keyboard.type(config.credentials.account);

    await page.click(selectors.password);
    await page.keyboard.type(config.credentials.password);

    await page.click(selectors.button);
    await page.waitFor(selectors.successMessage);

    await browser.close();
  });

program.parse(process.argv);

// If no arguments were supplied, output help and exit
if (!process.argv.slice(2).length) {
  program.help();
}
